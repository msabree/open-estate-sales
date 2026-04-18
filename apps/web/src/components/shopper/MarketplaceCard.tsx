"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ImageOff, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import FavoriteButton from "@/components/shopper/FavoriteButton";
import { cn } from "@/lib/utils";

export type MarketplaceCardProps = {
  saleId: string;
  itemId: string;
  regionSlug: string;
  listingSlug: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  tags?: string[] | null;
  saleTitle?: string;
  className?: string;
};

export default function MarketplaceCard({
  saleId,
  itemId,
  regionSlug,
  listingSlug,
  title,
  description,
  imageUrl,
  tags,
  saleTitle,
  className = "",
}: MarketplaceCardProps) {
  const [showEnlarged, setShowEnlarged] = useState(false);
  const tagList = tags ?? [];

  const saleHref = `/sales/${regionSlug}/${listingSlug}`;

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowEnlarged(false);
    },
    [],
  );

  useEffect(() => {
    if (!showEnlarged) return;
    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [showEnlarged, onKeyDown]);

  return (
    <>
      <div
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-card/90 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-md dark:bg-zinc-950/50",
          className,
        )}
      >
        <button
          type="button"
          className="relative aspect-square w-full cursor-pointer text-left"
          onClick={() => setShowEnlarged(true)}
          aria-label={`View ${title}`}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-200 hover:scale-[1.03]"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-gradient-to-br from-accent/15 to-muted">
              <Heart
                className="size-10 stroke-[1.5] text-muted-foreground"
                aria-hidden
              />
            </div>
          )}
        </button>

        <div className="space-y-1 p-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
            {title}
          </h3>
          {description ? (
            <p className="truncate text-[11px] text-muted-foreground">
              {description}
            </p>
          ) : null}
          {tagList.length > 0 ? (
            <div className="mt-1 flex flex-wrap gap-1">
              {tagList.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  {t}
                </span>
              ))}
              {tagList.length > 2 ? (
                <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground">
                  +{tagList.length - 2}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {showEnlarged ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`marketplace-item-${itemId}-title`}
          onClick={() => setShowEnlarged(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowEnlarged(false)}
              className="absolute top-3 right-3 z-10 flex size-10 items-center justify-center rounded-full border border-border bg-background/95 text-foreground shadow-sm transition-colors hover:bg-muted"
              aria-label="Close"
            >
              <X className="size-5" aria-hidden strokeWidth={2} />
            </button>

            <div className="relative max-h-[45vh] min-h-[200px] w-full bg-muted">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={title}
                  width={800}
                  height={500}
                  className="mx-auto max-h-[45vh] w-auto object-contain"
                />
              ) : (
                <div className="flex h-64 flex-col items-center justify-center gap-2 text-muted-foreground">
                  <ImageOff className="size-12" aria-hidden strokeWidth={1.5} />
                  <span className="text-sm">No photo</span>
                </div>
              )}
            </div>

            <div className="space-y-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3
                    id={`marketplace-item-${itemId}-title`}
                    className="mb-2 text-xl font-bold text-foreground"
                  >
                    {title}
                  </h3>
                  {description ? (
                    <p className="text-sm text-muted-foreground">{description}</p>
                  ) : null}
                  {saleTitle ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      From: {saleTitle}
                    </p>
                  ) : null}
                </div>
                <FavoriteButton
                  itemId={itemId}
                  saleId={saleId}
                  itemTitle={title}
                  saleTitle={saleTitle}
                  size="lg"
                />
              </div>

              {tagList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tagList.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              <Link
                href={saleHref}
                className="block w-full rounded-lg bg-accent py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-accent/90"
              >
                Go to sale
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
