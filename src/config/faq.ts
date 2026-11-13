/**
 * 211 Marketing — FAQ Data (Shared between HTML views and FAQPage JSON-LD schema)
 * 
 * Verbatim text from Brief (Pages 7 & 8).
 * Note: Pricing row is controlled by `isPricing: true`. If SHOW_PRICING_FAQ is false,
 * it will be excluded from both visible HTML and the schema.org FAQPage object.
 */

export interface FAQItem {
  question: string;
  answer: string;
  isPricing?: boolean;
}

export const FAQ_DATA: FAQItem[] = [
  {
    question: "What does 211 Marketing do?",
    answer: "211 Marketing is a doctor-founded healthcare marketing agency in Ahmedabad. We run social media, Google Business Profile, local SEO and websites for hospitals, clinics, diagnostic centres and specialists."
  },
  {
    question: "Who founded 211 Marketing?",
    answer: "Dr Mrugesh, MD Anaesthesiology, FPCI, who has been active professionally in Ahmedabad for nine years."
  },
  {
    question: "Is your marketing compliant with the NMC guidelines?",
    answer: "Every asset passes an 8-point review built around the NMC guidelines dated 6 October 2026, covering credentials, claims, patient privacy, AI use and fees. It is a marketing review, not legal advice."
  },
  {
    question: "Do you guarantee more patients?",
    answer: "No. We improve how clearly and credibly you can be found. Patient numbers are never promised, and our fees are never linked to patient referrals."
  },
  {
    question: "Do you work only with healthcare?",
    answer: "Healthcare is our focus: hospitals, clinics, diagnostics and individual doctors in Ahmedabad and Gujarat."
  },
  {
    question: "How much does healthcare marketing cost?",
    answer: "Monthly partnerships start at ₹29,000 + GST for individual doctors and ₹99,000 + GST for institutions. Scope depends on your entity type.",
    isPricing: true
  },
  {
    question: "How do I get started?",
    answer: "Request a free NMC-aware check. You'll receive a one-page review within 48 hours, then a short call if you'd like one."
  },
  {
    question: "Where is 211 Marketing located?",
    answer: "B-1405, The Capital, Science City Road, Sola, Ahmedabad 380060."
  }
];

export function getActiveFaqs(showPricing: boolean = true): FAQItem[] {
  if (showPricing) return FAQ_DATA;
  return FAQ_DATA.filter((item) => !item.isPricing);
}
