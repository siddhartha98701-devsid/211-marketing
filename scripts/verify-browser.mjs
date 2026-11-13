import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const BASE_URL = 'http://127.0.0.1:4321';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const LOCAL_SHOTS_DIR = path.resolve('public/screenshots');
const ARTIFACT_SHOTS_DIR = '/Users/siddharthasingh/.gemini/antigravity/brain/a7429d8e-9e80-4797-8ca2-d4c042f41590/screenshots';

const PAGES = [
  { slug: '', name: 'home' },
  { slug: 'healthcare-marketing/', name: 'healthcare-marketing' },
  { slug: 'services/', name: 'services' },
  { slug: 'nmc-guidelines-2026/', name: 'nmc-guidelines-2026' },
  { slug: 'free-nmc-check/', name: 'free-nmc-check' },
  { slug: 'about/', name: 'about' },
  { slug: 'contact/', name: 'contact' },
  { slug: 'privacy/', name: 'privacy' }
];

async function runBrowserVerification() {
  console.log('======================================================');
  console.log('🚀 Starting Browser Agent Verification Suite...');
  console.log('======================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[Console Error]: ${msg.text()}`);
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(`[Page Uncaught Error]: ${err.message}`);
  });

  const results = [];

  for (const p of PAGES) {
    const targetUrl = `${BASE_URL}/${p.slug}`;
    console.log(`\nTesting page: ${p.name || 'home'} (${targetUrl})`);

    // 1. Desktop Viewport (1440x900)
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    const navStartTime = Date.now();
    await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 15000 });
    const loadTimeMs = Date.now() - navStartTime;

    const desktopShotPath = path.join(LOCAL_SHOTS_DIR, `${p.name}-desktop-1440.png`);
    const desktopArtifactPath = path.join(ARTIFACT_SHOTS_DIR, `${p.name}-desktop-1440.png`);
    await page.screenshot({ path: desktopShotPath, fullPage: true });
    fs.copyFileSync(desktopShotPath, desktopArtifactPath);
    console.log(`  📸 Desktop 1440px Screenshot captured`);

    // Verify Title & H1
    const pageTitle = await page.title();
    const h1Count = await page.$$eval('h1', (els) => els.length);
    const h1Text = await page.$eval('h1', (el) => el.textContent?.trim() || '');
    const metaDesc = await page.$eval('meta[name="description"]', (el) => el.getAttribute('content') || '').catch(() => '');

    // 2. Mobile Viewport (390x844 - iPhone 14 / modern standard mobile)
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    await page.reload({ waitUntil: 'networkidle0' });

    const mobileShotPath = path.join(LOCAL_SHOTS_DIR, `${p.name}-mobile-390.png`);
    const mobileArtifactPath = path.join(ARTIFACT_SHOTS_DIR, `${p.name}-mobile-390.png`);
    await page.screenshot({ path: mobileShotPath, fullPage: true });
    console.log(`  📸 Mobile 390px Screenshot captured`);
    fs.copyFileSync(mobileShotPath, mobileArtifactPath);

    // Check sticky bar on mobile
    const hasFloatingBar = await page.$eval('aside[aria-label="Quick contact shortcuts"]', (el) => !!el).catch(() => false);

    results.push({
      page: p.name,
      url: targetUrl,
      title: pageTitle,
      titleLength: pageTitle.length,
      metaDescLength: metaDesc.length,
      h1Count,
      h1Text,
      loadTimeMs,
      hasFloatingBar
    });
  }

  // 3. Test Form Submit Flow on /free-nmc-check/
  console.log('\n------------------------------------------------------');
  console.log('📝 Testing Form Submit Flow interactively on /free-nmc-check/...');
  console.log('------------------------------------------------------');

  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/free-nmc-check/`, { waitUntil: 'networkidle0' });

  // Wait 3.5 seconds to pass the client time-gate (>2.5s)
  console.log('  ⏳ Waiting 3 seconds for human time-gate threshold...');
  await new Promise((r) => setTimeout(r, 3200));

  // Fill form
  await page.type('#name', 'Dr. Siddharth Sharma');
  await page.type('#organisation', 'Gujarat Dental & Maxillofacial Care');
  await page.select('#entityType', 'Clinic');
  await page.type('#city', 'Ahmedabad');
  await page.type('#instagram', 'gujarathospital_care');
  await page.type('#website', 'https://gujarathospitalcare.com');
  await page.type('#whatsapp', '9099097585');
  await page.click('#consent');

  console.log('  Filled form fields. Submitting form...');

  page.on('response', async (res) => {
    if (res.url().includes('/api/free-nmc-check')) {
      try {
        const text = await res.text();
        console.log(`  [Form API Response ${res.status()}]:`, text);
      } catch (e) {}
    }
  });

  await page.click('#submit-btn');

  // Wait for success alert to appear
  await page.waitForSelector('#form-success-box:not(.hidden)', { timeout: 8000 });
  const successText = await page.$eval('#form-success-box', (el) => el.textContent?.trim() || '');
  console.log(`  🎉 Form submitted successfully! Message: "${successText.replace(/\s+/g, ' ')}"`);

  // Take screenshot of success confirmation
  const successShotPath = path.join(LOCAL_SHOTS_DIR, 'form-success-state.png');
  const successArtifactPath = path.join(ARTIFACT_SHOTS_DIR, 'form-success-state.png');
  await page.screenshot({ path: successShotPath });
  fs.copyFileSync(successShotPath, successArtifactPath);
  console.log('  📸 Form success state screenshot captured');

  await browser.close();

  console.log('\n======================================================');
  console.log('📋 Browser Verification Summary:');
  console.log('======================================================');
  console.table(results);

  if (consoleErrors.length > 0) {
    console.error('\n⚠️ Console warnings/errors detected:');
    consoleErrors.forEach((e) => console.error(e));
  } else {
    console.log('\n✨ Console is 100% CLEAN. Zero errors or CSP violations recorded.');
  }

  // Save verification results to json for Walkthrough
  fs.writeFileSync('browser-verification-results.json', JSON.stringify({ results, consoleErrors }, null, 2));
  console.log('\n✅ Browser verification suite completed successfully.');
}

runBrowserVerification().catch((err) => {
  console.error('Fatal browser verification error:', err);
  process.exit(1);
});
