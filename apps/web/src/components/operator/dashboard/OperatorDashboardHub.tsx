"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarRange,
  LayoutGrid,
  MapPin,
  Search,
} from "lucide-react";

import { CreateDraftSaleButton } from "@/components/operator/CreateDraftSaleButton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { salePublicPath } from "@/utils/sales";

export type DashboardSaleRow = {
  id: string;
  title: string;
  status: string;
  city: string;
  state: string;
  created_at: string;
  start_date: string;
  end_date: string;
  region_slug: string;
  listing_slug: string;
};

type StatusFilter = "all" | "draft" | "published" | "ended";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Drafts" },
  { value: "published", label: "Live" },
  { value: "ended", label: "Ended" },
];

function formatRange(start: string, end: string): string {
  const a = new Date(start + "T12:00:00");
  const b = new Date(end + "T12:00:00");
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return "";
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  const y = { year: "numeric" as const };
  if (start === end) {
    return a.toLocaleDateString("en-US", { ...opts, ...y });
  }
  return `${a.toLocaleDateString("en-US", opts)} – ${b.toLocaleDateString("en-US", { ...opts, ...y })}`;
}

function statusStyle(status: string): string {
  switch (status) {
    case "published":
      return "bg-emerald-500/15 text-emerald-800 ring-emerald-500/25 dark:text-emerald-200";
    case "draft":
      return "bg-amber-500/15 text-amber-900 ring-amber-500/25 dark:text-amber-100";
    case "ended":
      return "bg-zinc-500/15 text-zinc-700 ring-zinc-500/20 dark:text-zinc-300";
    default:
      return "bg-muted text-muted-foreground ring-border";
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case "published":
      return "Live";
    case "draft":
      return "Draft";
    case "ended":
      return "Ended";
    default:
      return status;
  }
}

type Props = {
  sales: DashboardSaleRow[];
  showOperatorProfileLink: boolean;
};

export function OperatorDashboardHub({
  sales,
  showOperatorProfileLink,
}: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const totals = useMemo(
    () => ({
      total: sales.length,
      published: sales.filter((s) => s.status === "published").length,
      drafts: sales.filter((s) => s.status === "draft").length,
      ended: sales.filter((s) => s.status === "ended").length,
    }),
    [sales],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sales.filter((s) => {
      const okStatus = status === "all" || s.status === status;
      const okSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q);
      return okStatus && okSearch;
    });
  }, [sales, status, search]);

  return (
    <div className="relative min-h-full flex-1 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.18),transparent),radial-gradient(ellipse_60%_40%_at_100%_50%,rgba(16,185,129,0.12),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.12),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <CreateDraftSaleButton
            size="lg"
            label="Create new sale"
            className="h-12 shrink-0 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 px-8 text-base shadow-lg transition hover:from-emerald-500 hover:to-indigo-500 hover:shadow-xl"
          />
        </header>
        {/* Filters */}
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/50 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="relative max-w-md flex-1">
            <Search
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, city, or state…"
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 dark:border-zinc-800 dark:bg-zinc-950/50"
              aria-label="Search sales"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
                  status === opt.value
                    ? "border-accent bg-accent text-white shadow-sm"
                    : "border-border bg-background/80 text-muted-foreground hover:border-accent/40 hover:text-foreground dark:border-zinc-800 dark:bg-zinc-950/40",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <EmptyState hasAnySales={sales.length > 0} />
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((sale) => (
              <li key={sale.id}>
                <SaleHubCard sale={sale} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
  highlight,
}: {
  label: string;
  value: number;
  accent: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br p-5 shadow-sm dark:border-zinc-800",
        accent,
        highlight && "ring-2 ring-emerald-500/30 dark:ring-emerald-500/20",
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-bold tabular-nums text-foreground">
        {value}
      </p>
      <LayoutGrid
        className="absolute bottom-3 right-3 size-10 text-foreground/[0.06] dark:text-white/[0.06]"
        aria-hidden
      />
    </div>
  );
}

function SaleHubCard({ sale }: { sale: DashboardSaleRow }) {
  const dates = formatRange(sale.start_date, sale.end_date);
  const publicHref = salePublicPath(sale.region_slug, sale.listing_slug);
  const editHref = `/dashboard/sales/${sale.id}/location`;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-card/90 shadow-sm transition hover:border-accent/35 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/60 dark:hover:border-accent/30">
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="line-clamp-2 min-w-0 text-lg font-semibold leading-snug text-foreground">
            {sale.title}
          </h2>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1",
              statusStyle(sale.status),
            )}
          >
            {statusLabel(sale.status)}
          </span>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-accent" aria-hidden />
          <span className="truncate">
            {sale.city}, {sale.state}
          </span>
        </p>

        {dates ? (
          <p className="flex items-center gap-1.5 text-sm text-foreground/85">
            <CalendarRange className="size-4 shrink-0 text-accent" aria-hidden />
            {dates}
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-4 dark:border-zinc-800">
          <Link
            href={editHref}
            className={cn(
              buttonVariants({ size: "sm", variant: "default" }),
              "gap-1 rounded-lg",
            )}
          >
            Continue
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
          {sale.status === "published" ? (
            <Link
              href={publicHref}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "sm", variant: "outline" }), "rounded-lg")}
            >
              View listing
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function EmptyState({ hasAnySales }: { hasAnySales: boolean }) {
  return (
    <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center dark:border-zinc-800 dark:bg-zinc-950/30">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 ring-1 ring-border">
        <LayoutGrid className="size-7 text-accent" aria-hidden />
      </div>
      <h2 className="text-lg font-semibold text-foreground">
        {hasAnySales ? "No sales match filters" : "No sales yet"}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {hasAnySales
          ? "Try clearing search or switching the status filter."
          : "Create your first draft and we’ll walk you through location, copy, dates, and photos."}
      </p>
      {!hasAnySales ? (
        <div className="mt-6">
          <CreateDraftSaleButton
            label="Create your first sale"
            className="rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 px-6 shadow-md hover:from-emerald-500 hover:to-indigo-500"
          />
        </div>
      ) : null}
    </div>
  );
}
