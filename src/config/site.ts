/**
 * 211 Marketing — Single Source of Truth Configuration
 * 
 * ALL business contact information, placeholders, SEO limits, and feature flags
 * are centralized here. DO NOT hardcode these values anywhere else.
 */

export interface SiteConfig {
  name: string;
  legalName: string;
  slogan: string;
  description: string;
  founder: {
    name: string;
    qualifications: string;
    honorificSuffix: string;
    experienceYears: number;
    city: string;
    bio: string;
  };
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
    formatted: string;
  };
  contact: {
    telephone: string;
    phoneHref: string;
    whatsapp: string;
    whatsappHref: string;
    instagram: string;
    instagramHref: string;
  };
  placeholders: {
    siteUrl: string;
    businessEmail: string;
    hours: string;
    nmcLastReviewedDate: string;
  };
  flags: {
    showPricingFaq: boolean;
    analyticsEnabled: boolean;
  };
}

export const SITE_CONFIG: SiteConfig = {
  name: "211 Marketing",
  legalName: "211 Marketing",
  slogan: "Creative thinking. Strategic execution.",
  description: "Doctor-founded, NMC-aware healthcare marketing agency for hospitals, clinics, diagnostic centres and specialists in Ahmedabad.",
  
  founder: {
    name: "Dr Mrugesh",
    qualifications: "MD Anaesthesiology, FPCI",
    honorificSuffix: "MD Anaesthesiology, FPCI",
    experienceYears: 9,
    city: "Ahmedabad",
    bio: "211 Marketing was founded by Dr Mrugesh, MD Anaesthesiology, FPCI, who has been active professionally in Ahmedabad for nine years. Having worked inside healthcare, he saw the same problem again and again: good clinics marketed like shops, or not at all. 211 exists to fix that, with communication that is accurate, useful and quietly premium."
  },

  address: {
    streetAddress: "B-1405, The Capital, Science City Road, Sola",
    addressLocality: "Ahmedabad",
    addressRegion: "Gujarat",
    postalCode: "380060",
    addressCountry: "IN",
    // Standard formatted string used across footer, contact page, schemas, etc.
    formatted: "B-1405, The Capital, Science City Road, Sola, Ahmedabad, Gujarat 380060"
  },

  contact: {
    telephone: "+91-9099097585",
    phoneHref: "tel:+919099097585",
    whatsapp: "+91 90990 97585",
    whatsappHref: "https://wa.me/919099097585",
    instagram: "@211marketing_",
    instagramHref: "https://www.instagram.com/211marketing_/"
  },

  // PLACEHOLDERS: Configured via environment variables or confirmed before launch
  placeholders: {
    // TODO: Confirm final production domain with client
    siteUrl: (typeof process !== "undefined" && process.env?.SITE_URL) || "https://211marketing.in",
    // TODO: Confirm official business email with client
    businessEmail: (typeof process !== "undefined" && process.env?.BUSINESS_EMAIL) || "contact@211marketing.in",
    // TODO: Confirm clinic operating / consultation hours with client
    hours: "Mon–Sat, 10:00 am–7:00 pm",
    // TODO: Update whenever NMC guidance is revised
    nmcLastReviewedDate: "November 2026"
  },

  flags: {
    // Toggle whether pricing row appears in FAQ on page and in FAQPage JSON-LD schema
    showPricingFaq: true,
    // Analytics disabled by default; only loads when user provides consent
    analyticsEnabled: (typeof process !== "undefined" && process.env?.ANALYTICS_ENABLED === "true") || false
  }
};

/**
 * Returns any unresolved or unconfirmed placeholders for build warnings or audits
 */
export function getUnresolvedPlaceholders(): string[] {
  const unresolved: string[] = [];
  if (!process.env.SITE_URL) {
    unresolved.push("SITE_URL is using placeholder fallback (https://211marketing.in). Set SITE_URL in .env");
  }
  if (!process.env.BUSINESS_EMAIL) {
    unresolved.push("BUSINESS_EMAIL is using placeholder fallback (contact@211marketing.in). Set BUSINESS_EMAIL in .env");
  }
  return unresolved;
}
