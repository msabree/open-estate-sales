import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, CalendarRange, MapPin } from "lucide-react";

import { getPublicSale } from "@/apis/data/sales";
import { SaleDescriptionHtml } from "@/components/sale/SaleDescriptionHtml";
import SaleDetailMap from "@/components/sale/SaleDetailMap";
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

function OperatorCard({ operator }: { operator: PublicOperator | undefined }) {
  if (!operator) return null;

  const isCompany = operator.operator_kind === "company";

  return (
    <div className="rounded-2xl border border-border bg-card/90 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Listed by
      </h3>
      <p className="mt-3 text-lg font-semibold text-foreground">
        {operator.company_name?.trim() || operator.name}
      </p>
      <p
        className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
          isCompany
            ? "bg-accent/15 text-accent"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {isCompany ? "Company" : "Private seller"}
      </p>
      {operator.city && operator.state ? (
        <p className="mt-3 text-sm text-muted-foreground">
          {operator.city}, {operator.state}
        </p>
      ) : null}
    </div>
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/70 via-background to-emerald-50/60 dark:from-zinc-950 dark:via-background dark:to-zinc-900/80">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <nav className="text-sm text-muted-foreground">
          <Link href="/sales" className="hover:text-accent">
            Sales
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/sales/${sale.region_slug}`}
            className="hover:text-accent"
          >
            {sale.region_slug}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground/80">{sale.listing_slug}</span>
        </nav>

        <div className="mt-8 grid gap-8 lg:grid-cols-3 lg:gap-10">
          <div className="space-y-6 lg:col-span-2">
            <header className="rounded-2xl border border-border bg-card/90 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {sale.title}
                  </h1>
                  <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-4 shrink-0 text-accent" aria-hidden />
                      {sale.city}, {sale.state}
                      {sale.zip ? ` · ${sale.zip}` : null}
                    </span>
                  </p>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm text-foreground/90">
                    <CalendarRange className="size-4 shrink-0 text-accent" aria-hidden />
                    <span>
                      {formatUsDate(sale.start_date)}
                      {sale.start_date !== sale.end_date
                        ? ` — ${formatUsDate(sale.end_date)}`
                        : null}
                    </span>
                  </p>
                </div>
                {ended ? (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive ring-1 ring-destructive/20">
                    <AlertCircle className="size-3.5" aria-hidden />
                    Sale ended
                  </span>
                ) : null}
              </div>
            </header>

            {hasMapPin ? (
              <section className="space-y-4" aria-labelledby="sale-location-heading">
                <h2
                  id="sale-location-heading"
                  className="text-lg font-semibold text-foreground"
                >
                  Location
                </h2>
                <SaleDetailMap sale={explore} />
                <div className="rounded-2xl border border-border bg-card/80 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
                  {ended ? (
                    <p className="text-sm text-muted-foreground">
                      This sale has ended; the map shows the approximate area that
                      was advertised.
                    </p>
                  ) : addressIsExact ? (
                    <p className="text-sm font-medium text-foreground">
                      {sale.address}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Street address is hidden until the scheduled reveal time
                      {sale.address_reveal_at
                        ? ` (${formatRevealAt(sale.address_reveal_at)})`
                        : ""}
                      . The pin is approximate.
                    </p>
                  )}
                </div>
              </section>
            ) : null}

            {sortedPhotos.length > 0 ? (
              <section aria-labelledby="sale-photos-heading">
                <h2
                  id="sale-photos-heading"
                  className="mb-4 text-lg font-semibold text-foreground"
                >
                  Photos
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {sortedPhotos.map((photo, i) => {
                    const src = salePhotoPublicUrl(photo.storage_path);
                    if (!src) return null;
                    return (
                      <div
                        key={photo.id}
                        className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted shadow-sm"
                      >
                        <Image
                          src={src}
                          alt={
                            photo.alt_text?.trim() ||
                            `${sale.title} — photo ${i + 1}`
                          }
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                          priority={i === 0}
                        />
                      </div>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {sale.description?.trim() ? (
              <section
                className="rounded-2xl border border-border bg-card/90 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50 sm:p-8"
                aria-labelledby="sale-about-heading"
              >
                <h2
                  id="sale-about-heading"
                  className="mb-4 text-lg font-semibold text-foreground"
                >
                  About this sale
                </h2>
                <SaleDescriptionHtml html={sale.description} />
              </section>
            ) : null}
          </div>

          <aside className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-border bg-card/90 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Dates
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

            <OperatorCard operator={sale.operator ?? undefined} />

            <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-5 dark:border-zinc-800">
              <p className="text-sm text-muted-foreground">
                Browsing for more? Explore the map and list on the home page.
              </p>
              <Link
                href="/sales"
                className="mt-3 inline-flex text-sm font-medium text-accent hover:underline"
              >
                ← All estate sales
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
