import Image from "next/image";
import Link from "next/link";
import { Building2, CalendarRange, ChevronRight, MapPin, User } from "lucide-react";

import type { MapSale } from "@/components/SalesMap";
import { salePublicPath } from "@/utils/sales";
import { cn } from "@/lib/utils";

/** Sale row used on /sales explore list + map markers */
export type ExploreSale = MapSale & {
  region_slug: string;
  listing_slug: string;
  city: string;
  state: string;
};

function isCompanySale(sale: MapSale): boolean {
  if (sale.operator_kind === "company") return true;
  if (sale.operator_kind === "individual") return false;
  return Boolean(sale.workspace_id && sale.workspace_id !== sale.created_by);
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

function formatSaleDateSummary(dates?: { sale_date: string }[]): string | null {
  if (!dates?.length) return null;
  const sorted = [...dates].sort((a, b) => a.sale_date.localeCompare(b.sale_date));
  const first = sorted[0]!;
  const last = sorted[sorted.length - 1]!;
  const a = formatShortDate(first.sale_date);
  const b = formatShortDate(last.sale_date);
  return a === b ? a : `${a} – ${b}`;
}

type SaleCardProps = {
  sale: ExploreSale;
  /** First cards in the list: pass true for slightly faster image loading */
  priority?: boolean;
  className?: string;
  /** `grid` = compact tile for map+browse split (2 columns). `default` = full-width row card. */
  variant?: "default" | "grid";
};

export default function SaleCard({
  sale,
  priority,
  className,
  variant = "default",
}: SaleCardProps) {
  const href = sale.href ?? salePublicPath(sale.region_slug, sale.listing_slug);
  const company = isCompanySale(sale);
  const dateSummary = formatSaleDateSummary(sale.sale_dates);
  const imageSrc = sale.main_display_image?.trim() || "/placeholder.svg";

  if (variant === "grid") {
    return (
      <Link
        href={href}
        className={cn(
          "group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition",
          "hover:border-accent/40 hover:shadow-md",
          "dark:border-zinc-800 dark:bg-zinc-950/60 dark:hover:border-accent/35",
          className,
        )}
      >
        <div className="relative aspect-[4/3] bg-muted">
          <Image
            src={imageSrc}
            alt={sale.title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1280px) 22vw, 200px"
            className="object-cover transition duration-300 group-hover:opacity-95"
            priority={priority}
          />
          <span
            className={cn(
              "absolute left-2 top-2 inline-flex max-w-[calc(100%-1rem)] items-center gap-0.5 truncate rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-black/10 sm:text-xs",
              company
                ? "bg-zinc-900/90 text-accent"
                : "bg-white/95 text-zinc-800 dark:bg-zinc-950/90 dark:text-zinc-100",
            )}
          >
            {company ? (
              <Building2 className="size-3 shrink-0" aria-hidden />
            ) : (
              <User className="size-3 shrink-0" aria-hidden />
            )}
            <span className="truncate">{company ? "Company" : "Private"}</span>
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-2.5 sm:p-3">
          <h3 className="line-clamp-2 text-left text-sm font-semibold leading-snug tracking-tight text-foreground">
            {sale.title}
          </h3>
          <p className="flex items-start gap-1 text-[11px] text-muted-foreground sm:text-xs">
            <MapPin className="mt-0.5 size-3 shrink-0 text-accent" aria-hidden />
            <span className="line-clamp-2">
              {sale.city}, {sale.state}
            </span>
          </p>
          {dateSummary ? (
            <p className="mt-auto flex items-center gap-1 text-[11px] text-foreground/80 dark:text-zinc-300 sm:text-xs">
              <CalendarRange className="size-3 shrink-0 text-accent" aria-hidden />
              <span className="line-clamp-1">{dateSummary}</span>
            </p>
          ) : null}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "group block overflow-hidden rounded-2xl border border-border bg-white/80 shadow-sm transition",
        "hover:border-accent/35 hover:bg-accent/[0.03]",
        "dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:border-accent/40 dark:hover:bg-zinc-950/70",
        className,
      )}
    >
      <div className="grid gap-0 lg:grid-cols-[minmax(0,280px)_1fr]">
        <div className="relative aspect-[16/10] bg-zinc-200 dark:bg-zinc-900 lg:aspect-auto lg:min-h-[200px]">
          <Image
            src={imageSrc}
            alt={sale.title}
            fill
            sizes="(min-width: 1024px) 280px, 100vw"
            className="object-cover transition duration-300 group-hover:opacity-95"
            priority={priority}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r" />
          <span
            className={cn(
              "absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-black/10 dark:ring-black/20",
              company
                ? "bg-zinc-900/90 text-accent dark:bg-zinc-950/90"
                : "bg-white/95 text-zinc-800 dark:bg-zinc-950/90 dark:text-zinc-100",
            )}
          >
            {company ? (
              <>
                <Building2 className="size-3.5" aria-hidden />
                Company
              </>
            ) : (
              <>
                <User className="size-3.5" aria-hidden />
                Private seller
              </>
            )}
          </span>
        </div>

        <div className="flex flex-col justify-between gap-4 p-5 sm:p-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-xl">
                {sale.title}
              </h3>
            </div>

            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0 text-accent" aria-hidden />
              <span>
                {sale.city}, {sale.state}
              </span>
            </p>

            {sale.addressVisible === false ? (
              <p className="text-xs text-muted-foreground">
                Street address is hidden until the scheduled reveal time.
              </p>
            ) : null}

            {dateSummary ? (
              <p className="flex items-center gap-2 text-sm text-foreground/85 dark:text-zinc-300">
                <CalendarRange className="size-4 shrink-0 text-accent" aria-hidden />
                <span>{dateSummary}</span>
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border pt-4 dark:border-zinc-800/80">
            <span className="text-xs text-muted-foreground">Open estate sale listing</span>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
              View details
              <ChevronRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
