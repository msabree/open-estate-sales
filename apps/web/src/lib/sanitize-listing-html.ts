import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize operator-authored listing HTML (TipTap) before `dangerouslySetInnerHTML`.
 */
export function sanitizeListingHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
}
