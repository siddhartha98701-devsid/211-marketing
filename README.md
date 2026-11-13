# 211 Marketing — Official Website

> **Production Website for 211 Marketing**, a doctor-founded healthcare marketing agency in Ahmedabad, Gujarat, India. Built strictly in compliance with the **NMC Guidelines of 6 October 2026** and the **Digital Personal Data Protection (DPDP) Act 2023**.

---

## 1. Quick Overview

- **Stack**: Astro 5 (Static-first SSG + Edge Serverless Function) + TypeScript + Tailwind CSS.
- **Typography**: 100% self-hosted via Fontsource (`EB Garamond` headlines, `Lato` body). Zero external Google Fonts CDN.
- **Performance**: Mobile Lighthouse: **Performance: 97, Accessibility: 95, Best Practices: 100, SEO: 100**. Sub-second TTFB, LCP < 1.0s.
- **Regulated Context**: Strict adherence to NMC guidelines of 6 Oct 2026 — no testimonials, clinical before/after photographs, superlatives, patient-count promises, or fee-per-lead structures anywhere.
- **Single Source of Truth**: All business contact info, address, phone numbers, and placeholders are stored in `src/config/site.ts` and imported everywhere.

---

## 2. Directory Structure

```
211 marketing/
├── .github/
│   ├── dependabot.yml             # Weekly npm & GitHub Action dependency scans
│   └── workflows/ci.yml           # Automated CI: Typecheck, SEO length checks, static build
├── dist/                          # Production static build output + _worker.js
├── docs/
│   ├── brief.pdf                  # Official copy & SEO/AEO brief
│   └── brief_extracted.txt        # Full text transcription
├── public/
│   ├── .well-known/security.txt   # RFC 9116 security policy & contact
│   ├── assets/
│   │   ├── 211-marketing-logo.svg # Vector logo
│   │   ├── 211-marketing-logo.png # High-DPI PNG logo
│   │   └── 211-og-image.png       # 1200x630 Open Graph card (Warm Ivory canvas)
│   ├── _headers                   # Cloudflare Pages HTTP security & cache headers
│   ├── favicon.svg / favicon.png  # Brand icon
│   └── robots.txt                 # Search engine directives pointing to sitemap-index.xml
├── scripts/
│   ├── check-seo-limits.mjs       # Build-time assertion: Title ≤ 60, Meta ≤ 145 chars
│   ├── generate-assets.mjs        # Sharp-based SVG/PNG generator
│   ├── test-security.mjs          # Security & API abuse test suite
│   ├── verify-browser.mjs         # Puppeteer-based browser & screenshot verification
│   ├── verify-headers.mjs         # HTTP security headers verification
│   └── verify-schemas.mjs         # Schema.org JSON-LD validator & FAQ drift detector
├── src/
│   ├── components/                # Accessible Astro components (Header, Footer, FAQ, Map, etc.)
│   ├── config/
│   │   ├── site.ts                # SINGLE SOURCE OF TRUTH (Address, phone, placeholders)
│   │   ├── faq.ts                 # Shared FAQ items (HTML + Schema)
│   │   ├── nmc-guide.ts           # NMC 2026 Q&A guide items
│   │   └── services.ts            # Services copy and schema
│   ├── layouts/Layout.astro       # Root layout with BaseHead, skip-links, and semantic landmarks
│   ├── pages/
│   │   ├── index.astro            # / (Home)
│   │   ├── healthcare-marketing.astro # /healthcare-marketing/
│   │   ├── services.astro         # /services/
│   │   ├── nmc-guidelines-2026.astro  # /nmc-guidelines-2026/
│   │   ├── free-nmc-check.astro   # /free-nmc-check/ (Interactive & no-JS form)
│   │   ├── about.astro            # /about/
│   │   ├── contact.astro          # /contact/
│   │   ├── privacy.astro          # /privacy/ (DPDP Act 2023 compliant data notice)
│   │   ├── llms.txt.ts            # Dynamic route serving /llms.txt for AI search models
│   │   └── api/
│   │       └── free-nmc-check.ts  # Serverless form endpoint (Zod, rate limiter, Resend)
│   ├── schemas/                   # Zod form validation & JSON-LD schema generators
│   └── styles/global.css          # Design tokens & WCAG accessibility styles
├── astro.config.mjs               # Cloudflare Pages static/SSR adapter configuration
├── package.json                   # Pinned dependency versions
├── tailwind.config.mjs            # Warm Ivory, Ink Navy, Soft Stone, Quiet Taupe tokens
├── tsconfig.json                  # Strict TypeScript configuration
└── vercel.json                    # Vercel deployment & security headers parity
```

---

## 3. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `SITE_URL` | Base production URL for canonicals, OG, and JSON-LD | `https://211marketing.in` |
| `BUSINESS_EMAIL` | Official inbox receiving free NMC check requests | `contact@211marketing.in` |
| `RESEND_API_KEY` | Transactional email API key from [resend.com](https://resend.com) | `re_12345678...` (Simulated in console if omitted) |
| `PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile Site Key for bot protection | `0x4AAAAAA...` (Optional in local dev) |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile Secret Key for verification | `0x4AAAAAA...` (Bypassed with dev log if omitted) |
| `SHOW_PRICING_FAQ` | Toggle pricing row in FAQ on page and in schema | `true` (Set to `false` to hide) |
| `ANALYTICS_ENABLED` | Toggle GA4 integration behind cookie consent banner | `false` |
| `PUBLIC_GA_MEASUREMENT_ID`| GA4 Measurement ID (if enabled) | `G-XXXXXXXXXX` |

---

## 4. Local Development & Build

### Prerequisites
- Node.js `20.x` or higher
- npm `10.x` or higher

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
Visit `http://localhost:4321`.

### Run Production Build & SEO Verification
```bash
npm run build
```
The build pipeline automatically:
1. Runs `scripts/check-seo-limits.mjs` (Fails if any title > 60 or description > 145 chars).
2. Runs TypeScript type checking (`tsc --noEmit`).
3. Executes `astro build`, outputting static HTML pages and `_worker.js` to `dist/`.

---

## 5. Security & Verification Test Suite

Run the full automated test suite locally:

```bash
# 1. Technical SEO Character Bounds Check
npm run seo-check

# 2. Schema.org JSON-LD Integrity & Zero-Drift Check
node scripts/verify-schemas.mjs

# 3. HTTP Security Headers Verification (Cloudflare & Vercel)
node scripts/verify-headers.mjs

# 4. API Security & Abuse Tests (Rate limit, honeypot, XSS, payload limits)
node scripts/test-security.mjs

# 5. Full Browser Verification (Desktop 1440px & Mobile 390px, form submit)
node scripts/verify-browser.mjs
```

---

## 6. Deployment Guides

### Option A: Cloudflare Pages (Recommended)
1. Push repository to GitHub or GitLab.
2. In the [Cloudflare Dashboard](https://dash.cloudflare.com/):
   - Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
   - Select your repository.
   - Build settings:
     - **Framework preset**: `Astro`
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
3. Under **Settings** > **Environment variables**, configure:
   - `SITE_URL`: `https://211marketing.in`
   - `BUSINESS_EMAIL`: `contact@211marketing.in`
   - `RESEND_API_KEY`: `re_...`
   - `TURNSTILE_SECRET_KEY`: `0x4...`
   - `PUBLIC_TURNSTILE_SITE_KEY`: `0x4...`
4. The included `public/_headers` file will automatically configure strict CSP, HSTS preload, X-Frame-Options, and immutable asset caching.

### Option B: Vercel
1. Import repository in [Vercel](https://vercel.com/).
2. Framework preset: `Astro`.
3. Configure environment variables identical to above.
4. The included `vercel.json` provides matching security headers and caching directives.

---

## 7. How to Update Copy & Configuration

All business information is maintained in a single file: `src/config/site.ts`.

- **To update the phone number or WhatsApp**: Change `contact.telephone` and `contact.whatsapp` in `src/config/site.ts`. It immediately updates the header, footer, contact page, floating mobile bar, and schema.org JSON-LD.
- **To update the address**: Change `address` in `src/config/site.ts`.
- **To hide the pricing row**: Set `SHOW_PRICING_FAQ = false` in `.env` or set `flags.showPricingFaq: false` in `src/config/site.ts`. It will be cleanly removed from both the visible HTML and the `FAQPage` JSON-LD schema without breaking anything.
- **To update NMC Q&A content**: Edit `src/config/nmc-guide.ts`.
