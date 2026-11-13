/**
 * Services Data
 * 
 * Verbatim text from Brief (Pages 4 & 5).
 */

export interface ServiceItem {
  id: string;
  title: string;
  copy: string;
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "healthcare-social-media",
    title: "Healthcare social media",
    copy: "Monthly content plans, reels and carousels for Instagram and Facebook, written for patients and reviewed against the NMC guidelines."
  },
  {
    id: "google-business-profile-local-seo",
    title: "Google Business Profile & local SEO",
    copy: "Accurate listings, services, photos and Q&A, so people searching nearby find correct, factual information first."
  },
  {
    id: "healthcare-websites",
    title: "Healthcare websites",
    copy: "Fast, mobile-first sites with service pages, a doctor directory and answer-first FAQs that search engines and AI assistants can quote."
  },
  {
    id: "brand-content",
    title: "Brand & content",
    copy: "Positioning, visual identity and medical copywriting that feel premium because they are restrained."
  },
  {
    id: "nmc-aware-communication-audit",
    title: "NMC-aware communication audit",
    copy: "A structured review of your website, social media and campaigns, with a prioritised list of what to fix."
  },
  {
    id: "institutional-media",
    title: "Institutional media",
    copy: "Paid campaigns for eligible hospitals and institutions, only where the law and NMC guidance allow."
  }
];

export const SERVICES_CLOSING_LINE = "Not sure what you need? We'll tell you honestly, even if it's less.";
