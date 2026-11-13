/**
 * Schema.org JSON-LD Generators
 * 
 * Generates verified structured data matching the Brief verbatim:
 * - ProfessionalService (injected on every page)
 * - FAQPage (Home and Healthcare pages, identical to visible copy)
 * - Article (NMC guidelines page with dateModified)
 * - BreadcrumbList (Inner pages)
 * - Service (Services page)
 */

import { SITE_CONFIG } from "../config/site";
import type { FAQItem } from "../config/faq";

/**
 * ProfessionalService schema injected on every page
 */
export function getProfessionalServiceSchema(baseUrl: string) {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${cleanBase}/#organization`,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: `${cleanBase}/`,
    logo: `${cleanBase}/assets/211-marketing-logo.png`,
    telephone: SITE_CONFIG.contact.telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.streetAddress,
      addressLocality: SITE_CONFIG.address.addressLocality,
      addressRegion: SITE_CONFIG.address.addressRegion,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.addressCountry
    },
    areaServed: [
      { "@type": "City", name: "Ahmedabad" },
      { "@type": "City", name: "Gandhinagar" },
      { "@type": "State", name: "Gujarat" }
    ],
    founder: {
      "@type": "Person",
      name: SITE_CONFIG.founder.name,
      honorificSuffix: SITE_CONFIG.founder.honorificSuffix
    },
    knowsAbout: [
      "Healthcare marketing",
      "Hospital marketing",
      "NMC advertising guidelines",
      "Google Business Profile",
      "Healthcare websites"
    ],
    sameAs: [
      SITE_CONFIG.contact.instagramHref
    ],
    slogan: SITE_CONFIG.slogan
  };
}

/**
 * FAQPage schema generated directly from FAQ items
 */
export function getFAQPageSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

/**
 * Article schema for NMC guidelines page
 */
export function getNMCArticleSchema(baseUrl: string) {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "NMC advertising guidelines 2026, explained in plain English",
    description: "What doctors and hospitals can and can't post under the NMC guidelines dated 6 October 2026, in plain English. Updated by 211 Marketing.",
    author: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: `${cleanBase}/`
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: `${cleanBase}/`,
      logo: {
        "@type": "ImageObject",
        url: `${cleanBase}/assets/211-marketing-logo.png`
      }
    },
    datePublished: "2026-10-06T00:00:00+05:30",
    dateModified: "2026-11-06T00:00:00+05:30",
    mainEntityOfPage: `${cleanBase}/nmc-guidelines-2026/`
  };
}

/**
 * BreadcrumbList schema for inner pages
 */
export function getBreadcrumbSchema(
  baseUrl: string,
  items: { name: string; path: string }[]
) {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${cleanBase}/`
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: `${cleanBase}${item.path}`
      }))
    ]
  };
}

/**
 * Service schemas for /services/
 */
export function getServicesSchema(baseUrl: string, services: { title: string; copy: string }[]) {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Healthcare Marketing Services",
    itemListElement: services.map((service, index) => ({
      "@type": "Service",
      position: index + 1,
      name: service.title,
      description: service.copy,
      provider: {
        "@type": "Organization",
        name: SITE_CONFIG.name,
        url: `${cleanBase}/`
      }
    }))
  };
}
