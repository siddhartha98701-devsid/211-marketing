/**
 * Zod validation schema for the Free NMC-Aware Check form (/free-nmc-check/)
 * 
 * Strict server-side validation & sanitization:
 * - Length caps on all fields
 * - Strict allow-list for entityType ("I am a")
 * - E.164-compatible Indian mobile phone format
 * - Strict URL validation (http/https only)
 * - Instagram handle regex
 * - Anti-spam honeypot and time-to-submit verification
 */

import { z } from "zod";

export const ENTITY_TYPES = [
  "Doctor",
  "Clinic",
  "Hospital",
  "Diagnostics",
  "Other"
] as const;

export type EntityType = typeof ENTITY_TYPES[number];

// Indian mobile regex: optional country code (+91, 91, 0), followed by 6-9 and 9 digits
const INDIAN_PHONE_REGEX = /^(?:(?:\+|00)91[\s.-]?|[0]?)?[6789]\d{9}$/;

// Instagram handle regex: optional leading @, 1-30 chars consisting of letters, numbers, periods, underscores
const INSTAGRAM_REGEX = /^@?[a-zA-Z0-9._]{1,30}$/;

export const freeCheckFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (at least 2 characters).")
    .max(100, "Name must not exceed 100 characters.")
    .regex(/^[a-zA-Z\s.'-]+$/, "Name contains invalid characters."),

  organisation: z
    .string()
    .trim()
    .min(2, "Please enter your clinic, hospital or organisation name.")
    .max(120, "Organisation name must not exceed 120 characters."),

  entityType: z.enum(ENTITY_TYPES, {
    errorMap: () => ({ message: "Please select a valid entity type." })
  }),

  city: z
    .string()
    .trim()
    .min(2, "Please enter your city.")
    .max(80, "City must not exceed 80 characters.")
    .regex(/^[a-zA-Z\s.'-]+$/, "City contains invalid characters."),

  instagram: z
    .string()
    .trim()
    .regex(INSTAGRAM_REGEX, "Please provide a valid Instagram handle (e.g. @yourclinic).")
    .max(35, "Instagram handle too long."),

  website: z
    .string()
    .trim()
    .max(200, "Website URL must not exceed 200 characters.")
    .optional()
    .or(z.literal(""))
    .refine((val) => {
      if (!val || val === "") return true;
      try {
        const url = new URL(val.startsWith("http") ? val : `https://${val}`);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    }, "Please enter a valid website address (e.g. clinic.com or https://clinic.com)."),

  whatsapp: z
    .string()
    .trim()
    .regex(INDIAN_PHONE_REGEX, "Please enter a valid 10-digit Indian WhatsApp number (e.g. 9099097585 or +91 90990 97585).")
    .max(20, "Phone number format too long."),

  consent: z
    .union([z.boolean(), z.literal("true"), z.literal("on"), z.literal("1")])
    .refine((val) => val === true || val === "true" || val === "on" || val === "1", {
      message: "You must agree to be contacted about your free NMC check."
    }),

  // Honeypot field (must remain empty)
  website_url_hp: z.string().max(0, "Spam detected").optional().or(z.literal("")),

  // Timestamp when the form was rendered (to prevent sub-second bot submission)
  form_rendered_at: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // graceful fallback if JS is disabled
      const timestamp = parseInt(val, 10);
      if (isNaN(timestamp)) return false;
      const elapsed = Date.now() - timestamp;
      // Submission must take at least 2.5 seconds and less than 2 hours
      return elapsed >= 2500 && elapsed <= 7200000;
    }, "Submission completed abnormally fast. Please try again."),

  // Cloudflare Turnstile token
  "cf-turnstile-response": z.string().optional()
});

export type FreeCheckFormData = z.infer<typeof freeCheckFormSchema>;
