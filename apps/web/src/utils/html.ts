/** Rough plain-text length for validating rich HTML (publish guards). */
export function plainTextFromHtml(html: string | null | undefined): string {
  if (!html?.trim()) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
