import { sanitizeListingHtml } from "@/lib/sanitize-listing-html";

type Props = {
  html: string;
  className?: string;
};

/**
 * Renders stored TipTap HTML with sanitization and readable typography.
 */
export function SaleDescriptionHtml({ html, className = "" }: Props) {
  const safe = sanitizeListingHtml(html);
  if (!safe.trim()) return null;

  return (
    <div
      className={`sale-description max-w-none text-[0.95rem] leading-relaxed text-foreground/90 [&_a]:text-accent [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 ${className}`}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
