/**
 * Security & Functional Test Suite for /api/free-nmc-check
 */

const API_URL = "http://127.0.0.1:4321/api/free-nmc-check";

async function runTests() {
  console.log("=================================================");
  console.log("🛡️ Running Security & API Validation Test Suite...");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  async function testCase(name, options, validate) {
    try {
      const res = await fetch(API_URL, {
        headers: {
          "Content-Type": "application/json",
          "Origin": "http://127.0.0.1:4321",
          ...(options.headers || {})
        },
        method: options.method || "POST",
        body: options.body ? JSON.stringify(options.body) : undefined
      });
      const data = await res.json().catch(() => ({}));
      const ok = validate(res.status, data);
      if (ok) {
        console.log(`✅ [PASS] ${name} (Status: ${res.status})`);
        passed++;
      } else {
        console.error(`❌ [FAIL] ${name} (Status: ${res.status})`, data);
        failed++;
      }
    } catch (err) {
      console.error(`❌ [FAIL] ${name} threw error:`, err);
      failed++;
    }
  }

  // 1. Valid submission
  await testCase(
    "1. Valid form submission",
    {
      headers: { "x-forwarded-for": "192.168.1.101" },
      body: {
        name: "Dr Amit Patel",
        organisation: "Apex Eye Clinic",
        entityType: "Clinic",
        city: "Ahmedabad",
        instagram: "@apexeye",
        website: "https://apexeyeclinic.in",
        whatsapp: "9876543210",
        consent: true,
        website_url_hp: "",
        form_rendered_at: (Date.now() - 5000).toString()
      }
    },
    (status, data) => status === 200 && data.success === true
  );

  // 2. Missing consent
  await testCase(
    "2. Missing consent rejection",
    {
      headers: { "x-forwarded-for": "192.168.1.102" },
      body: {
        name: "Dr Amit Patel",
        organisation: "Apex Eye Clinic",
        entityType: "Clinic",
        city: "Ahmedabad",
        instagram: "@apexeye",
        whatsapp: "9876543210",
        consent: false,
        website_url_hp: "",
        form_rendered_at: (Date.now() - 5000).toString()
      }
    },
    (status, data) => status === 422 && data.success === false
  );

  // 3. Invalid phone format
  await testCase(
    "3. Invalid phone format rejection",
    {
      headers: { "x-forwarded-for": "192.168.1.103" },
      body: {
        name: "Dr Amit Patel",
        organisation: "Apex Eye Clinic",
        entityType: "Clinic",
        city: "Ahmedabad",
        instagram: "@apexeye",
        whatsapp: "123456",
        consent: true,
        website_url_hp: "",
        form_rendered_at: (Date.now() - 5000).toString()
      }
    },
    (status, data) => status === 422 && data.fields?.whatsapp
  );

  // 4. Script injection in name
  await testCase(
    "4. Script injection attack in Name rejected",
    {
      headers: { "x-forwarded-for": "192.168.1.104" },
      body: {
        name: "<script>alert('xss')</script>",
        organisation: "Apex Eye Clinic",
        entityType: "Clinic",
        city: "Ahmedabad",
        instagram: "@apexeye",
        whatsapp: "9876543210",
        consent: true,
        website_url_hp: "",
        form_rendered_at: (Date.now() - 5000).toString()
      }
    },
    (status, data) => status === 422 && data.fields?.name
  );

  // 5. Honeypot trap (Filled honeypot field)
  await testCase(
    "5. Honeypot trap detection (silent drop to mislead bot)",
    {
      headers: { "x-forwarded-for": "192.168.1.105" },
      body: {
        name: "Bot Name",
        organisation: "Spam Org",
        entityType: "Other",
        city: "Ahmedabad",
        instagram: "@spam",
        whatsapp: "9876543210",
        consent: true,
        website_url_hp: "http://spambot.com",
        form_rendered_at: (Date.now() - 5000).toString()
      }
    },
    (status, data) => status === 200 && data.success === true
  );

  // 6. Sub-second bot submission (Time-to-submit gate)
  await testCase(
    "6. Sub-second submission gate rejection",
    {
      headers: { "x-forwarded-for": "192.168.1.106" },
      body: {
        name: "Fast Bot",
        organisation: "Speed Clinic",
        entityType: "Clinic",
        city: "Ahmedabad",
        instagram: "@fast",
        whatsapp: "9876543210",
        consent: true,
        website_url_hp: "",
        form_rendered_at: (Date.now() - 200).toString() // only 200ms ago
      }
    },
    (status, data) => status === 422 && data.fields?.form_rendered_at
  );

  // 7. Oversized payload (>10 KB)
  const largePayload = JSON.stringify({ data: "A".repeat(12 * 1024) });
  await testCase(
    "7. Oversized payload rejected (>10KB)",
    {
      headers: {
        "x-forwarded-for": "192.168.1.107",
        "Content-Length": Buffer.byteLength(largePayload).toString()
      },
      body: { data: "A".repeat(12 * 1024) }
    },
    (status, data) => status === 413
  );

  // 8. Rate limiting (triggering 429)
  console.log("\nTesting rate limiter with 6 rapid requests from IP 192.168.1.200...");
  let rateLimitHit = false;
  for (let i = 1; i <= 6; i++) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://127.0.0.1:4321",
        "x-forwarded-for": "192.168.1.200"
      },
      body: JSON.stringify({
        name: `Dr Repeat ${i}`,
        organisation: "Repeat Clinic",
        entityType: "Clinic",
        city: "Ahmedabad",
        instagram: "@repeat",
        whatsapp: "9876543210",
        consent: true,
        website_url_hp: "",
        form_rendered_at: (Date.now() - 5000).toString()
      })
    });
    if (res.status === 429) {
      rateLimitHit = true;
      console.log(`✅ [PASS] 8. Rate limit enforced on request #${i} -> HTTP 429 Too Many Requests`);
      passed++;
      break;
    }
  }
  if (!rateLimitHit) {
    console.error("❌ [FAIL] 8. Rate limiter did not return 429 after limit exceeded.");
    failed++;
  }

  console.log("\n=================================================");
  console.log(`Security Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log("=================================================\n");

  if (failed > 0) process.exit(1);
}

runTests();
