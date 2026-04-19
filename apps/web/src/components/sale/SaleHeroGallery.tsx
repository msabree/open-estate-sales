import Image from "next/image";

import { salePhotoPublicUrl } from "@/config/sale-photos";
import type { PublicSalePhoto } from "@oes/types";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  photos: PublicSalePhoto[];
};

/**
 * Listing cover = first photo by `sort_order` (operators control order on the Pictures step).
 * Hero + 2×2 grid when enough images; single hero only when one image.
 */
export function SaleHeroGallery({ title, photos }: Props) {
  const sorted = [...photos].sort((a, b) => a.sort_order - b.sort_order);
  if (sorted.length === 0) return null;

  const hero = sorted[0]!;
  const rest = sorted.slice(1);
  const heroSrc = salePhotoPublicUrl(hero.storage_path);
  if (!heroSrc) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40">
      <div
        className={cn(
          "grid gap-1.5 p-1.5 sm:gap-2 sm:p-2",
          rest.length > 0 ? "lg:grid-cols-[1.2fr_1fr]" : "grid-cols-1",
        )}
      >
        <div className="relative aspect-[16/10] min-h-[200px] overflow-hidden rounded-xl bg-muted lg:min-h-[280px]">
          <Image
            src={heroSrc}
            alt={hero.alt_text?.trim() || `${title} — listing photo`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 65vw"
            priority
          />
          <span className="absolute right-2 top-2 rounded-md bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm sm:text-xs">
            Cover
          </span>
        </div>

        {rest.length > 0 ? (
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {rest.length === 1 ? (
              <div className="relative col-span-2 aspect-[2/1] overflow-hidden rounded-lg bg-muted">
                {(() => {
                  const src = salePhotoPublicUrl(rest[0]!.storage_path);
                  if (!src) return null;
                  return (
                    <>
                      <Image
                        src={src}
                        alt={
                          rest[0]!.alt_text?.trim() || `${title} — photo 2`
                        }
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 35vw"
                      />
                      <span className="absolute right-1.5 top-1.5 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white">
                        2
                      </span>
                    </>
                  );
                })()}
              </div>
            ) : (
              rest.slice(0, 4).map((photo, i) => {
                const src = salePhotoPublicUrl(photo.storage_path);
                if (!src) return null;
                return (
                  <div
                    key={photo.id}
                    className="relative aspect-square overflow-hidden rounded-lg bg-muted"
                  >
                    <Image
                      src={src}
                      alt={
                        photo.alt_text?.trim() || `${title} — photo ${i + 2}`
                      }
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 45vw, 18vw"
                    />
                    <span className="absolute right-1.5 top-1.5 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      {i + 2}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        ) : null}
      </div>
      {sorted.length > 5 ? (
        <p className="border-t border-border px-3 py-2 text-center text-xs text-muted-foreground dark:border-zinc-800">
          +{sorted.length - 5} more in gallery below
        </p>
      ) : null}
    </section>
  );
}
