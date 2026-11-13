/**
 * Build-time Technical SEO Validation Script
 * 
 * Verifies that all page titles are <= 60 characters and all meta descriptions
 * are <= 145 characters according to the sitemap & SEO map in the brief.
 * Fails the build process with code 1 if any limit is exceeded.
 */

const pages = [
  {
    route: "/",
    name: "Home",
    title: "Healthcare Marketing Agency in Ahmedabad | 211 Marketing",
    description: "Doctor-founded, NMC-aware marketing for hospitals, clinics and diagnostic centres in Ahmedabad. Social media, Google, websites. Get a free check."
  },
  {
    route: "/healthcare-marketing/",
    name: "Healthcare Marketing",
    title: "Hospital & Clinic Marketing in Ahmedabad | 211 Marketing",
    description: "Ethical, premium marketing for hospitals, clinics, diagnostics and specialists, built around the NMC guidelines of 6 October 2026."
  },
  {
    route: "/services/",
    name: "Services",
    title: "Healthcare Social Media, Google & Websites | 211 Marketing",
    description: "Healthcare social media, Google Business Profile, local SEO, websites and communication audits for Ahmedabad clinics and hospitals."
  },
  {
    route: "/nmc-guidelines-2026/",
    name: "NMC Guidelines Guide",
    title: "NMC Advertising Guidelines 2026, Explained | 211 Marketing",
    description: "What doctors and hospitals can and can't post under the NMC guidelines dated 6 October 2026, in plain English. Updated by 211 Marketing."
  },
  {
    route: "/free-nmc-check/",
    name: "Free NMC Check",
    title: "Free NMC-Aware Check for Clinics & Hospitals | 211 Marketing",
    description: "A free 15-point review of your clinic's Instagram, Google profile and website against the new NMC rules. One page, within 48 hours."
  },
  {
    route: "/about/",
    name: "About",
    title: "About 211 Marketing | Doctor-Founded Healthcare Marketing",
    description: "211 Marketing is a doctor-founded healthcare communication firm in Ahmedabad, led by Dr Mrugesh, MD Anaesthesiology, FPCI."
  },
  {
    route: "/contact/",
    name: "Contact",
    title: "Contact 211 Marketing | Science City Road, Sola, Ahmedabad",
    description: "Visit or call 211 Marketing at B-1405, The Capital, Science City Road, Sola, Ahmedabad 380060. Call or WhatsApp +91 90990 97585."
  },
  {
    route: "/privacy/",
    name: "Privacy Policy",
    title: "Privacy Policy | 211 Marketing Ahmedabad",
    description: "How 211 Marketing collects and processes free NMC-check requests in accordance with Indian DPDP Act 2023 principles."
  }
];

const MAX_TITLE_LENGTH = 60;
const MAX_DESC_LENGTH = 145;

let hasErrors = false;

console.log("\n========================================================");
console.log("🔍 Checking Technical SEO Title & Description Limits...");
console.log("========================================================\n");

pages.forEach((page) => {
  const titleLen = page.title.length;
  const descLen = page.description.length;

  const titleOk = titleLen <= MAX_TITLE_LENGTH;
  const descOk = descLen <= MAX_DESC_LENGTH;

  console.log(`Page: ${page.name} (${page.route})`);
  console.log(`  Title [${titleLen}/${MAX_TITLE_LENGTH}]: ${titleOk ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`    "${page.title}"`);
  console.log(`  Desc  [${descLen}/${MAX_DESC_LENGTH}]: ${descOk ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`    "${page.description}"`);

  if (!titleOk) {
    console.error(`  🚨 ERROR: Title exceeds limit by ${titleLen - MAX_TITLE_LENGTH} chars!`);
    hasErrors = true;
  }
  if (!descOk) {
    console.error(`  🚨 ERROR: Description exceeds limit by ${descLen - MAX_DESC_LENGTH} chars!`);
    hasErrors = true;
  }
  console.log("");
});

if (hasErrors) {
  console.error("❌ Technical SEO validation FAILED. Build aborted.");
  process.exit(1);
} else {
  console.log("✅ All titles (≤60) and meta descriptions (≤145) PASSED technical SEO bounds.\n");
}
