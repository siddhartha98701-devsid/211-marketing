import type { APIRoute } from "astro";
import { SITE_CONFIG } from "../config/site";

export const GET: APIRoute = async () => {
  const baseUrl = SITE_CONFIG.placeholders.siteUrl.replace(/\/+$/, "");

  const content = `# 211 Marketing — Healthcare Marketing Agency (Ahmedabad)
> ${SITE_CONFIG.description}
> Slogan: ${SITE_CONFIG.slogan}
> Location: ${SITE_CONFIG.address.formatted}
> Phone/WhatsApp: ${SITE_CONFIG.contact.telephone}

## Core Website Pages

- ${baseUrl}/ : Doctor-founded, NMC-aware marketing for hospitals, clinics and diagnostic centres in Ahmedabad. Social media, Google, websites.
- ${baseUrl}/healthcare-marketing/ : Ethical, premium marketing for hospitals, clinics, diagnostics and specialists, built around the NMC guidelines of 6 October 2026.
- ${baseUrl}/services/ : Healthcare social media, Google Business Profile, local SEO, websites and communication audits for Ahmedabad clinics and hospitals.
- ${baseUrl}/nmc-guidelines-2026/ : What doctors and hospitals can and can't post under the NMC guidelines dated 6 October 2026, in plain English.
- ${baseUrl}/free-nmc-check/ : A free 15-point review of your clinic's Instagram, Google profile and website against the new NMC rules. One page, within 48 hours.
- ${baseUrl}/about/ : 211 Marketing is a doctor-founded healthcare communication firm in Ahmedabad, led by Dr Mrugesh, MD Anaesthesiology, FPCI.
- ${baseUrl}/contact/ : Visit or call 211 Marketing at B-1405, The Capital, Science City Road, Sola, Ahmedabad 380060. Call or WhatsApp ${SITE_CONFIG.contact.telephone}.
- ${baseUrl}/privacy/ : Information on how free check request details are processed under DPDP Act 2023 principles.
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400"
    }
  });
};
