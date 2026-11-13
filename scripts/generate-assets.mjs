import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const assetsDir = path.resolve('public/assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. Vector Logo SVG (horizontal lockup for nav & header)
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 80" width="360" height="80">
  <defs>
    <style>
      .num2 { font-family: 'EB Garamond', Georgia, serif; font-size: 52px; font-weight: 600; fill: #263947; }
      .num11 { font-family: 'EB Garamond', Georgia, serif; font-size: 52px; font-weight: 500; fill: #9A8A72; letter-spacing: -1px; }
      .brand-title { font-family: 'Lato', -apple-system, sans-serif; font-size: 19px; font-weight: 700; fill: #263947; letter-spacing: 3px; }
      .brand-sub { font-family: 'Lato', -apple-system, sans-serif; font-size: 9.5px; font-weight: 600; fill: #9A8A72; letter-spacing: 2px; }
      .pillar { fill: #9A8A72; }
      .rule { stroke: #D8D1C6; stroke-width: 1; }
    </style>
  </defs>
  <!-- Mark -->
  <g transform="translate(10, 12)">
    <text x="0" y="44" class="num2">2</text>
    <rect x="29" y="8" width="5.5" height="40" rx="1.5" class="pillar" />
    <rect x="40" y="8" width="5.5" height="40" rx="1.5" class="pillar" />
  </g>
  <!-- Divider -->
  <line x1="72" y1="18" x2="72" y2="58" class="rule" />
  <!-- Typography -->
  <g transform="translate(86, 12)">
    <text x="0" y="27" class="brand-title">MARKETING</text>
    <text x="1" y="45" class="brand-sub">HEALTHCARE · AHMEDABAD</text>
  </g>
</svg>`;

// 2. Favicon SVG
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="12" fill="#263947" />
  <text x="9" y="46" font-family="'EB Garamond', Georgia, serif" font-size="40" font-weight="600" fill="#F6F2EA">2</text>
  <rect x="34" y="16" width="5" height="32" rx="1.5" fill="#D8D1C6" />
  <rect x="44" y="16" width="5" height="32" rx="1.5" fill="#D8D1C6" />
</svg>`;

// 3. Open Graph 1200x630 Card SVG (211 logo on Warm Ivory #F6F2EA)
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <style>
      .og-bg { fill: #F6F2EA; }
      .og-card { fill: #FFFFFF; stroke: #D8D1C6; stroke-width: 1.5; }
      .og-num2 { font-family: 'EB Garamond', Georgia, serif; font-size: 110px; font-weight: 600; fill: #263947; }
      .og-pillar { fill: #9A8A72; }
      .og-eyebrow { font-family: 'Lato', sans-serif; font-size: 15px; font-weight: 700; fill: #9A8A72; letter-spacing: 4px; }
      .og-h1 { font-family: 'EB Garamond', Georgia, serif; font-size: 54px; font-weight: 600; fill: #263947; letter-spacing: -0.5px; }
      .og-sub { font-family: 'Lato', sans-serif; font-size: 22px; font-weight: 400; fill: #485A67; line-height: 1.5; }
      .og-tag { font-family: 'Lato', sans-serif; font-size: 14px; font-weight: 600; fill: #263947; }
      .og-rule { stroke: #D8D1C6; stroke-width: 1; }
      .og-badge { fill: #263947; }
      .og-badge-text { font-family: 'Lato', sans-serif; font-size: 13px; font-weight: 700; fill: #F6F2EA; letter-spacing: 2px; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" class="og-bg" />

  <!-- Outer frame -->
  <rect x="40" y="40" width="1120" height="550" rx="16" fill="none" stroke="#D8D1C6" stroke-width="1.5" />
  <rect x="48" y="48" width="1104" height="534" rx="12" fill="none" stroke="#E5DEC3" stroke-width="0.75" />

  <!-- Content Container -->
  <g transform="translate(100, 110)">
    <!-- Eyebrow -->
    <text x="0" y="20" class="og-eyebrow">DOCTOR-FOUNDED · NMC-AWARE · AHMEDABAD</text>
    
    <!-- Emblem & Name -->
    <g transform="translate(0, 50)">
      <text x="0" y="85" class="og-num2">2</text>
      <rect x="62" y="16" width="11" height="76" rx="3" class="og-pillar" />
      <rect x="84" y="16" width="11" height="76" rx="3" class="og-pillar" />
      <line x1="124" y1="20" x2="124" y2="92" class="og-rule" />
      <text x="150" y="55" font-family="'Lato', sans-serif" font-size="34" font-weight="700" fill="#263947" letter-spacing="5px">211 MARKETING</text>
      <text x="152" y="86" font-family="'Lato', sans-serif" font-size="18" font-weight="600" fill="#9A8A72" letter-spacing="3px">HEALTHCARE COMMUNICATION</text>
    </g>

    <!-- Main Headline -->
    <text x="0" y="235" class="og-h1">Healthcare marketing, held to a clinical standard.</text>

    <!-- Subtitle / Positioning -->
    <text x="0" y="285" class="og-sub">Ethical, NMC-compliant communication for hospitals, clinics &amp; diagnostic centres.</text>
    <text x="0" y="320" class="og-sub">Social media · Google Business Profile · Websites · Local SEO</text>

    <!-- Footer within card -->
    <line x1="0" y1="365" x2="1000" y2="365" class="og-rule" />
    <g transform="translate(0, 395)">
      <text x="0" y="15" class="og-tag">B-1405, The Capital, Science City Road, Sola, Ahmedabad</text>
      <text x="750" y="15" class="og-tag">+91 90990 97585 · wa.me/919099097585</text>
    </g>
  </g>
</svg>`;

// Write SVGs
fs.writeFileSync(path.join(assetsDir, '211-marketing-logo.svg'), logoSvg);
fs.writeFileSync(path.join(assetsDir, '211-marketing-logo.png.svg'), logoSvg);
fs.writeFileSync(path.resolve('public/favicon.svg'), faviconSvg);

// Render high-res PNG logo and 1200x630 OG image using Sharp
async function buildImages() {
  // Logo PNG (800x178 for sharp high-DPI display)
  await sharp(Buffer.from(logoSvg))
    .resize(800, 178)
    .png({ quality: 100 })
    .toFile(path.join(assetsDir, '211-marketing-logo.png'));
  console.log('✅ Generated public/assets/211-marketing-logo.png');

  // OG Image PNG (exact 1200x630)
  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .png({ quality: 95 })
    .toFile(path.join(assetsDir, '211-og-image.png'));
  console.log('✅ Generated public/assets/211-og-image.png (1200x630)');

  // Favicon PNG fallback (32x32)
  await sharp(Buffer.from(faviconSvg))
    .resize(32, 32)
    .png()
    .toFile(path.resolve('public/favicon.png'));
  console.log('✅ Generated public/favicon.png');
}

buildImages().catch((err) => {
  console.error('Image generation error:', err);
  process.exit(1);
});
