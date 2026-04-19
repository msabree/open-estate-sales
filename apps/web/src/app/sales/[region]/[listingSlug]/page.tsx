import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, CalendarRange, Clock, MapPin } from "lucide-react";

import { getPublicSale } from "@/apis/data/sales";
import { SaleBreadcrumbs } from "@/components/sale/SaleBreadcrumbs";
import { SaleContactRunner } from "@/components/sale/SaleContactRunner";
import { SaleDescriptionHtml } from "@/components/sale/SaleDescriptionHtml";
import SaleDetailMap from "@/components/sale/SaleDetailMap";
import { SaleHeroGallery } from "@/components/sale/SaleHeroGallery";
import { salePhotoPublicUrl } from "@/config/sale-photos";
import { publicSaleToExploreSale } from "@/lib/map/public-sale-to-explore-sale";
import { absoluteUrl, canonicalSaleUrl } from "@/utils/seo";
import { plainTextFromHtml } from "@/utils/html";
import { salePublicPath } from "@/utils/sales";
import type { PublicOperator } from "@oes/types";
import Image from "next/image";

type Props = {
  params: Promise<{ region: string; listingSlug: string }>;
};

function isSaleEnded(endDate: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return endDate < today;
}

function formatUsDate(isoDate: string): string {
  const d = new Date(isoDate + "T12:00:00");
  if (Number.isNaN(d.getTime())) return isoDate;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

function formatRevealAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZoneName: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region, listingSlug } = await params;
  const sale = await getPublicSale(region, listingSlug);
  if (!sale) {
    return { title: "Sale not found" };
  }

  const plain = plainTextFromHtml(sale.description ?? "");
  const description =
    plain.slice(0, 155).trim() ||
    `Estate sale in ${sale.city}, ${sale.state}. ${sale.start_date} – ${sale.end_date}.`;

  const title = `${sale.title} — ${sale.city}, ${sale.state}`;

  const photos = [...(sale.photos ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const firstSrc = photos[0]
    ? salePhotoPublicUrl(photos[0].storage_path)
    : null;

  return {
    title,
    description,
    openGraph: {
      title: sale.title,
      description,
      url: canonicalSaleUrl(region, listingSlug),
      type: "website",
      ...(firstSrc
        ? {
            images: [
              {
                url: firstSrc,
                width: 1200,
                height: 630,
                alt: sale.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: sale.title,
      description,
      ...(firstSrc ? { images: [firstSrc] } : {}),
    },
    alternates: {
      canonical: canonicalSaleUrl(region, listingSlug),
    },
  };
}

function ListedByLine({ operator }: { operator: PublicOperator | undefined }) {
  if (!operator) return null;
  const label = operator.company_name?.trim() || operator.name;
  return (
    <p className="text-xs text-muted-foreground">
      Listed by{" "}
      <span className="font-medium text-foreground/90">{label}</span>
      {operator.operator_kind === "company" ? (
        <span className="ml-1 rounded-full bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
          Company
        </span>
      ) : null}
    </p>
  );
}

export default async function SaleDetailPage({ params }: Props) {
  const { region, listingSlug } = await params;
  const sale = await getPublicSale(region, listingSlug);

  if (!sale) {
    notFound();
  }

  const explore = publicSaleToExploreSale(sale);
  const ended = isSaleEnded(sale.end_date);
  const hasMapPin =
    typeof explore.lat === "number" && typeof explore.lng === "number";
  const addressIsExact = sale.lat != null && sale.lng != null && sale.address;

  const sortedPhotos = [...(sale.photos ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const morePhotos = sortedPhotos.length > 5 ? sortedPhotos.slice(5) : [];

  const runnerLabel =
    sale.operator?.company_name?.trim() || sale.operator?.name || "the host";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: sale.title,
    startDate: sale.start_date,
    endDate: sale.end_date,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: `${sale.city}, ${sale.state}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: sale.city,
        addressRegion: sale.state,
        ...(sale.zip ? { postalCode: sale.zip } : {}),
        ...(sale.address ? { streetAddress: sale.address } : {}),
      },
    },
    url: absoluteUrl(salePublicPath(sale.region_slug, sale.listing_slug)),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <SaleBreadcrumbs
          regionSlug={sale.region_slug}
          listingTitleHint={
            sale.title.length > 48 ? `${sale.title.slice(0, 45)}…` : sale.title
          }
        />

        {sortedPhotos.length > 0 ? (
          <div className="mt-6">
            <SaleHeroGallery title={sale.title} photos={sortedPhotos} />
          </div>
        ) : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-3 lg:gap-10">
          <div className="space-y-8 lg:col-span-2">
            <header className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {sale.title}
                </h1>
                {ended ? (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive ring-1 ring-destructive/20">
                    <AlertCircle className="size-3.5" aria-hidden />
                    Sale ended
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4 shrink-0 text-accent" aria-hidden />
                  {sale.city}, {sale.state}
                  {sale.zip ? ` · ${sale.zip}` : null}
                </span>
              </div>

              <div className="space-y-2 rounded-xl border border-border bg-card/60 px-4 py-3 text-sm dark:border-zinc-800">
                <p className="flex items-start gap-2 text-foreground/90">
                  <Clock className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                  <span>
                    {ended
                      ? "This sale has ended."
                      : addressIsExact && sale.address
                        ? sale.address
                        : sale.address_reveal_at
                          ? `Address released ${formatRevealAt(sale.address_reveal_at)}`
                          : "Address is shared at the scheduled reveal time."}
                  </span>
                </p>
                <p className="flex items-center gap-2 text-foreground/90">
                  <CalendarRange className="size-4 shrink-0 text-accent" aria-hidden />
                  <span>
                    {formatUsDate(sale.start_date)}
                    {sale.start_date !== sale.end_date
                      ? ` — ${formatUsDate(sale.end_date)}`
                      : null}
                  </span>
                </p>
              </div>
            </header>

            {morePhotos.length > 0 ? (
              <section aria-labelledby="more-photos-heading">
                <h2
                  id="more-photos-heading"
                  className="mb-3 text-base font-semibold text-foreground"
                >
                  More photos
                </h2>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                  {morePhotos.map((photo, i) => {
                    const src = salePhotoPublicUrl(photo.storage_path);
                    if (!src) return null;
                    return (
                      <div
                        key={photo.id}
                        className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                      >
                        <Image
                          src={src}
                          alt={
                            photo.alt_text?.trim() ||
                            `${sale.title} — photo ${i + 6}`
                          }
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 45vw, 20vw"
                        />
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {sale.description?.trim() ? (
              <section
                className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40 sm:p-8"
                aria-labelledby="sale-about-heading"
              >
                <h2
                  id="sale-about-heading"
                  className="mb-4 font-display text-xl font-semibold text-foreground"
                >
                  About this sale
                </h2>
                <SaleDescriptionHtml html={sale.description} />
              </section>
            ) : null}
          </div>

          <aside className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Dates & hours
              </h3>
              <p className="mt-3 text-foreground">
                <span className="font-medium">{formatUsDate(sale.start_date)}</span>
                {sale.start_date !== sale.end_date ? (
                  <>
                    {" "}
                    <span className="text-muted-foreground">to</span>{" "}
                    <span className="font-medium">
                      {formatUsDate(sale.end_date)}
                    </span>
                  </>
                ) : null}
              </p>
              {sale.preview_times?.trim() ? (
                <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground dark:border-zinc-800">
                  <span className="font-medium text-foreground/90">Hours: </span>
                  {sale.preview_times}
                </p>
              ) : null}
            </div>

            <SaleContactRunner
              saleTitle={sale.title}
              runnerLabel={runnerLabel}
              contactEmail={sale.listing_contact_email ?? null}
            />

            <ListedByLine operator={sale.operator ?? undefined} />

            {hasMapPin ? (
              <section
                className="space-y-2"
                aria-labelledby="area-map-heading"
              >
                <h3
                  id="area-map-heading"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Area map
                </h3>
                <p className="text-xs text-muted-foreground">
                  Approximate location until the address is released.
                </p>
                <SaleDetailMap sale={explore} compact />
              </section>
            ) : null}

            <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-4 dark:border-zinc-800">
              <Link
                href="/"
                className="text-sm font-medium text-accent hover:underline"
              >
                ← Browse more estate sales
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
