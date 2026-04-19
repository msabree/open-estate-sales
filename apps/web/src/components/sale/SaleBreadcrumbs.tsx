import Link from "next/link";
import { ChevronRight } from "lucide-react";

function parseRegionSlug(slug: string): { place: string; state: string } | null {
  const parts = slug.split("-").filter(Boolean);
  if (parts.length < 2) return null;
  const st = parts[parts.length - 1]?.toUpperCase();
  if (!st || st.length !== 2) return null;
  const place = parts
    .slice(0, -1)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return { place, state: st };
}

type Props = {
  regionSlug: string;
  listingTitleHint?: string;
};

/** Minimal trail: Estate sales › State › City — no raw slug segments. */
export function SaleBreadcrumbs({ regionSlug, listingTitleHint }: Props) {
  const parsed = parseRegionSlug(regionSlug);

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1 border-b border-border/60 pb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:text-xs"
    >
      <Link
        href="/sales"
        className="text-muted-foreground transition hover:text-foreground"
      >
        Estate sales
      </Link>
      {parsed ? (
        <>
          <ChevronRight className="size-3.5 shrink-0 opacity-50" aria-hidden />
          <span className="text-muted-foreground/90">{parsed.state}</span>
          <ChevronRight className="size-3.5 shrink-0 opacity-50" aria-hidden />
          <Link
            href={`/sales/${regionSlug}`}
            className="max-w-[min(100%,12rem)] truncate text-foreground/90 transition hover:text-accent sm:max-w-none"
          >
            {parsed.place}
          </Link>
        </>
      ) : (
        <>
          <ChevronRight className="size-3.5 shrink-0 opacity-50" aria-hidden />
          <Link
            href={`/sales/${regionSlug}`}
            className="truncate text-foreground/90 transition hover:text-accent"
          >
            {regionSlug}
          </Link>
        </>
      )}
      {listingTitleHint ? (
        <>
          <ChevronRight className="size-3.5 shrink-0 opacity-50" aria-hidden />
          <span className="max-w-[min(100%,14rem)] truncate font-normal normal-case tracking-normal text-foreground/70 sm:max-w-md">
            {listingTitleHint}
          </span>
        </>
      ) : null}
    </nav>
  );
}
