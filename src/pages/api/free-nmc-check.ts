import type { APIRoute } from "astro";
import { freeCheckFormSchema } from "../../schemas/form";
import { SITE_CONFIG } from "../../config/site";
import { checkRateLimit } from "../../utils/rate-limit";
import { sanitizeHeader, escapeHtml, redactPII } from "../../utils/sanitize";

export const prerender = false;

const MAX_BODY_SIZE_BYTES = 10 * 1024; // 10 KB limit

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const forwarded = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
  const ip = (forwarded ? forwarded.split(",")[0].trim() : null) || clientAddress || "127.0.0.1";

  // 1. Rate Limiting (5 requests per hour per IP)
  const rateLimit = checkRateLimit(ip, 5, 60 * 60 * 1000);
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Too many requests. Please wait before submitting another review request or contact us directly on WhatsApp."
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": rateLimit.resetSeconds.toString()
        }
      }
    );
  }

  // 2. CSRF & Origin Verification
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const siteUrl = SITE_CONFIG.placeholders.siteUrl;

  try {
    const allowedHost = new URL(siteUrl).host;
    if (origin) {
      const originHost = new URL(origin).host;
      if (originHost !== allowedHost && !originHost.includes("localhost") && !originHost.includes("127.0.0.1")) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid submission origin." }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
    } else if (referer) {
      const refererHost = new URL(referer).host;
      if (refererHost !== allowedHost && !refererHost.includes("localhost") && !refererHost.includes("127.0.0.1")) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid submission referer." }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  } catch (e) {
    // Malformed origin/referer URL
    return new Response(
      JSON.stringify({ success: false, error: "Security check failed." }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  // 3. Content-Type and Payload Size Validation
  const contentType = request.headers.get("content-type") || "";
  const contentLength = parseInt(request.headers.get("content-length") || "0", 10);

  if (contentLength > MAX_BODY_SIZE_BYTES) {
    return new Response(
      JSON.stringify({ success: false, error: "Payload exceeds maximum allowed size (10KB)." }),
      { status: 413, headers: { "Content-Type": "application/json" } }
    );
  }

  // 4. Parse incoming body (Support both JSON and standard Form POST)
  let rawData: Record<string, any> = {};
  const isJsonRequest = contentType.includes("application/json");

  try {
    if (isJsonRequest) {
      rawData = await request.json();
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        rawData[key] = value.toString();
      });
    } else {
      return new Response(
        JSON.stringify({ success: false, error: "Unsupported Media Type." }),
        { status: 415, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: "Malformed request payload." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // 5. Honeypot check (Silent drop to deceive bots)
  if (rawData.website_url_hp && rawData.website_url_hp.length > 0) {
    console.warn(`[Security Alert] Honeypot triggered from IP: ${redactPII(ip)}`);
    if (isJsonRequest) {
      return new Response(JSON.stringify({ success: true, message: "Thank you." }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(null, {
      status: 302,
      headers: { Location: "/free-nmc-check/?submitted=1" }
    });
  }

  // 6. Zod Server-Side Schema Validation
  const validationResult = freeCheckFormSchema.safeParse(rawData);

  if (!validationResult.success) {
    const errorDetails = validationResult.error.flatten().fieldErrors;
    console.warn("[Validation Warning] Rejected invalid form payload:", Object.keys(errorDetails));

    if (isJsonRequest) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Please verify all required fields and ensure formats are correct.",
          fields: errorDetails
        }),
        { status: 422, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(null, {
      status: 302,
      headers: { Location: "/free-nmc-check/?error=validation" }
    });
  }

  const validData = validationResult.data;

  // 7. Cloudflare Turnstile Verification
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const turnstileToken = validData["cf-turnstile-response"];

  if (turnstileSecret && turnstileSecret.trim().length > 0) {
    if (!turnstileToken) {
      return new Response(
        JSON.stringify({ success: false, error: "Security verification token missing." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: turnstileSecret,
          response: turnstileToken,
          remoteip: ip
        })
      });

      const verifyData = await verifyRes.json() as { success: boolean };
      if (!verifyData.success) {
        console.warn(`[Security] Turnstile verification failed from IP: ${redactPII(ip)}`);
        return new Response(
          JSON.stringify({ success: false, error: "Bot verification failed. Please try again." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    } catch (turnstileErr) {
      console.error("[Security] Error calling Turnstile API:", turnstileErr);
      // Fallback: Proceed cautiously if upstream turnstile verification service experiences outage
    }
  }

  // 8. Sanitise & Prevent Header Injection
  const safeName = sanitizeHeader(validData.name);
  const safeOrg = sanitizeHeader(validData.organisation);
  const safeRole = sanitizeHeader(validData.entityType);
  const safeCity = sanitizeHeader(validData.city);
  const safeInstagram = sanitizeHeader(validData.instagram);
  const safeWebsite = sanitizeHeader(validData.website || "Not provided");
  const safeWhatsapp = sanitizeHeader(validData.whatsapp);
  const submissionTimestamp = new Date().toISOString();

  // 9. Dispatch Transactional Email via Resend
  const resendApiKey = process.env.RESEND_API_KEY;
  const businessEmail = SITE_CONFIG.placeholders.businessEmail;

  const emailSubject = `New Free NMC Check Request: ${safeOrg} (${safeRole})`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #263947; max-width: 600px; margin: 0 auto; border: 1px solid #D8D1C6; padding: 24px; border-radius: 8px;">
      <h2 style="color: #263947; margin-top: 0; border-bottom: 2px solid #D8D1C6; padding-bottom: 12px;">New Free NMC-Aware Check Request</h2>
      <p style="font-size: 14px; color: #9A8A72; margin-top: 0;">Received on ${submissionTimestamp}</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr>
          <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #EFE9DF; width: 35%;">Name:</td>
          <td style="padding: 8px; border-bottom: 1px solid #EFE9DF;">${escapeHtml(safeName)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #EFE9DF;">Organisation:</td>
          <td style="padding: 8px; border-bottom: 1px solid #EFE9DF;">${escapeHtml(safeOrg)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #EFE9DF;">Entity Type:</td>
          <td style="padding: 8px; border-bottom: 1px solid #EFE9DF;">${escapeHtml(safeRole)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #EFE9DF;">City:</td>
          <td style="padding: 8px; border-bottom: 1px solid #EFE9DF;">${escapeHtml(safeCity)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #EFE9DF;">Instagram Handle:</td>
          <td style="padding: 8px; border-bottom: 1px solid #EFE9DF;">${escapeHtml(safeInstagram)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #EFE9DF;">Website:</td>
          <td style="padding: 8px; border-bottom: 1px solid #EFE9DF;">${escapeHtml(safeWebsite)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #EFE9DF;">WhatsApp:</td>
          <td style="padding: 8px; border-bottom: 1px solid #EFE9DF;">${escapeHtml(safeWhatsapp)}</td>
        </tr>
      </table>

      <div style="margin-top: 24px; padding: 12px; background-color: #F6F2EA; border-radius: 4px; font-size: 13px; color: #263947;">
        <strong>Protocol Reminder:</strong> Review this account against the 15-point NMC 2026 checklist and deliver the 1-page report within 48 hours.
      </div>
    </div>
  `;

  const emailText = `
New Free NMC-Aware Check Request
---------------------------------------
Received: ${submissionTimestamp}
Name: ${safeName}
Organisation: ${safeOrg}
Entity Type: ${safeRole}
City: ${safeCity}
Instagram: ${safeInstagram}
Website: ${safeWebsite}
WhatsApp: ${safeWhatsapp}

Protocol: Review against the 15-point NMC checklist and deliver within 48 hours.
  `.trim();

  if (resendApiKey && resendApiKey.trim().length > 0) {
    try {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "211 Marketing Notifications <noreply@211marketing.in>",
          to: [businessEmail],
          subject: emailSubject,
          html: emailHtml,
          text: emailText
        })
      });

      if (!emailResponse.ok) {
        const errBody = await emailResponse.text();
        console.error("[Email Error] Resend dispatch failed:", errBody);
      }
    } catch (emailErr) {
      console.error("[Email Error] Failed to connect to Resend API:", emailErr);
    }
  } else {
    // Development mode simulation
    console.log("----------------------------------------------------------------");
    console.log("ℹ️ [DEV SIMULATION] Free Check Request Received (No RESEND_API_KEY configured):");
    console.log(`To: ${businessEmail}`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`Organisation: ${safeOrg} | City: ${safeCity} | Role: ${safeRole}`);
    console.log("----------------------------------------------------------------");
  }

  // 10. Return Response
  if (isJsonRequest) {
    return new Response(
      JSON.stringify({
        success: true,
        message: "Thank you. We'll send your one-page check on WhatsApp or email within 48 hours."
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      }
    );
  }

  // No-JS Form fallback redirect
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/free-nmc-check/?submitted=1",
      "Cache-Control": "no-store"
    }
  });
};
