import fs from 'node:fs';

console.log("=================================================");
console.log("🛡️ Verifying HTTP Security Headers Configuration...");
console.log("=================================================\n");

const headersFile = fs.readFileSync('public/_headers', 'utf-8');
const vercelJson = JSON.parse(fs.readFileSync('vercel.json', 'utf-8'));

const requiredHeaders = [
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Referrer-Policy',
  'Cross-Origin-Opener-Policy',
  'Permissions-Policy',
  'Content-Security-Policy'
];

let allPassed = true;

console.log("Checking Cloudflare Pages headers (public/_headers):");
for (const h of requiredHeaders) {
  const present = headersFile.includes(h);
  console.log(`  ${h}: ${present ? "✅ PASS" : "❌ MISSING"}`);
  if (!present) allPassed = false;
}

console.log("\nChecking Vercel configuration (vercel.json):");
const vercelHeaders = vercelJson.headers[0].headers.map((h) => h.key);
for (const h of requiredHeaders) {
  const present = vercelHeaders.includes(h);
  console.log(`  ${h}: ${present ? "✅ PASS" : "❌ MISSING"}`);
  if (!present) allPassed = false;
}

console.log("\nChecking RFC 9116 security.txt existence:");
const secTxtExists = fs.existsSync('public/.well-known/security.txt');
console.log(`  /.well-known/security.txt: ${secTxtExists ? "✅ PASS" : "❌ MISSING"}`);
if (!secTxtExists) allPassed = false;

if (!allPassed) {
  console.error("\n❌ Security header verification failed.");
  process.exit(1);
} else {
  console.log("\n✅ ALL HTTP security headers verified successfully across Cloudflare & Vercel targets.\n");
}
