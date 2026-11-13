/**
 * Security & Sanitization Utilities
 * 
 * - Prevents email header injection (strips \r and \n)
 * - Escapes user input for HTML email bodies
 * - Masks PII for secure operational logging
 */

/**
 * Strips carriage returns and newlines to prevent email header injection
 */
export function sanitizeHeader(input: string): string {
  if (!input) return "";
  return input.replace(/[\r\n\t]/g, " ").trim();
}

/**
 * Escapes special HTML characters to prevent XSS / HTML injection in email templates
 */
export function escapeHtml(str: string): string {
  if (!str) return "";
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  return str.replace(/[&<>"']/g, (match) => htmlEntities[match] || match);
}

/**
 * Strips all characters except digits, plus, and spaces for phone formatting
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

/**
 * Redacts PII for server logs so no personal data is leaked to log sinks
 */
export function redactPII(text: string): string {
  if (!text) return "";
  if (text.length <= 4) return "****";
  return text.slice(0, 2) + "****" + text.slice(-2);
}
