/**
 * NMC Guidelines 2026 Guide Data
 * 
 * Verbatim text from Brief (Page 6 & 7).
 * Follows answer-first format for AI search quotation.
 */

export interface NMCQuestionAnswer {
  question: string;
  answer: string;
}

export const NMC_GUIDE_DATA = {
  h1: "NMC advertising guidelines 2026, explained in plain English",
  answerBox: "On 6 October 2026, the National Medical Commission published guidelines on ethical advertising and public communication by hospitals, medical institutions and registered medical practitioners, effective immediately. They allow education and factual information, and prohibit patient solicitation, testimonials, before/after promotion and unverifiable superiority claims.",
  officialNoticeUrl: "https://nmc.org.in/whats-new/download/1874",
  officialNoticeLabel: "Read the official notice",
  disclaimer: "General information, not legal advice",
  questions: [
    {
      question: "Does social media count as advertising?",
      answer: "Yes. Posts, reels, websites, influencers, messaging apps and AI-assisted content are covered, whoever publishes them."
    },
    {
      question: "Can clinics post patient testimonials?",
      answer: "No, not for promotion, and patient consent does not make it acceptable."
    },
    {
      question: "Are before/after photos allowed?",
      answer: "Not for promotion. Scientific or educational use follows strict consent and anonymity conditions."
    },
    {
      question: "Can we say \"best\" or \"No. 1\"?",
      answer: "Only if it is objectively verifiable, with the source and method disclosed. Individual doctors may not advertise success rates."
    },
    {
      question: "What can hospitals say?",
      answer: "Factual, verifiable information: name, location, contacts, departments, facilities, equipment, services, emergency care, accreditation and charges."
    },
    {
      question: "What should a doctor's post include?",
      answer: "The doctor's name, qualifications, registration status and registration number."
    },
    {
      question: "Does using an agency shift the responsibility?",
      answer: "No. The doctor or hospital stays responsible for content they commission."
    },
    {
      question: "Can an agency charge per patient lead?",
      answer: "No. Fees cannot be linked to procuring or referring individual patients."
    }
  ] as NMCQuestionAnswer[]
};
