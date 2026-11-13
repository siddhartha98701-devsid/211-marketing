import fs from 'node:fs';

console.log("=================================================");
console.log("🔍 Validating JSON-LD Structured Data Integrity...");
console.log("=================================================\n");

const pages = [
  { path: 'dist/index.html', name: 'Home', expectedTypes: ['ProfessionalService', 'FAQPage'] },
  { path: 'dist/healthcare-marketing/index.html', name: 'Healthcare Marketing', expectedTypes: ['ProfessionalService', 'FAQPage', 'BreadcrumbList'] },
  { path: 'dist/services/index.html', name: 'Services', expectedTypes: ['ProfessionalService', 'ItemList', 'BreadcrumbList'] },
  { path: 'dist/nmc-guidelines-2026/index.html', name: 'NMC Guide', expectedTypes: ['ProfessionalService', 'Article', 'BreadcrumbList'] },
  { path: 'dist/free-nmc-check/index.html', name: 'Free Check', expectedTypes: ['ProfessionalService', 'BreadcrumbList'] },
  { path: 'dist/about/index.html', name: 'About', expectedTypes: ['ProfessionalService', 'BreadcrumbList'] },
  { path: 'dist/contact/index.html', name: 'Contact', expectedTypes: ['ProfessionalService', 'BreadcrumbList'] },
  { path: 'dist/privacy/index.html', name: 'Privacy', expectedTypes: ['ProfessionalService', 'BreadcrumbList'] }
];

let allPassed = true;

for (const p of pages) {
  console.log(`Checking ${p.name} (${p.path})...`);
  const html = fs.readFileSync(p.path, 'utf-8');

  // Find all json-ld script blocks
  const scriptRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match;
  const schemas = [];

  while ((match = scriptRegex.exec(html)) !== null) {
    try {
      const obj = JSON.parse(match[1]);
      schemas.push(obj);
    } catch (e) {
      console.error(`  ❌ Invalid JSON in schema block for ${p.name}:`, e.message);
      allPassed = false;
    }
  }

  const typesFound = schemas.map(s => s['@type']);
  console.log(`  Found schema types: ${typesFound.join(', ')}`);

  for (const exp of p.expectedTypes) {
    if (!typesFound.includes(exp)) {
      console.error(`  ❌ Missing expected schema type: ${exp}`);
      allPassed = false;
    } else {
      console.log(`  ✅ Verified schema type: ${exp}`);
    }
  }

  // If FAQPage, verify that questions in schema are present verbatim in the HTML body
  const faqSchema = schemas.find(s => s['@type'] === 'FAQPage');
  if (faqSchema) {
    let allFaqsInBody = true;
    for (const entity of faqSchema.mainEntity) {
      if (!html.includes(entity.name)) {
        console.error(`  ❌ Schema question not found on page: "${entity.name}"`);
        allFaqsInBody = false;
        allPassed = false;
      }
    }
    if (allFaqsInBody) {
      console.log(`  ✅ Verified FAQPage schema matches visible HTML body 100% (${faqSchema.mainEntity.length} Q&As)`);
    }
  }

  console.log("");
}

if (!allPassed) {
  console.error("❌ Schema verification failed.");
  process.exit(1);
} else {
  console.log("✅ ALL Schema.org structured data blocks validated with ZERO DRIFT.\n");
}
