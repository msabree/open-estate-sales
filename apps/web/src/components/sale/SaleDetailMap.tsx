"use client";

import SalesMap from "@/components/SalesMap";
import type { ExploreSale } from "@/components/explore-sales/SaleCard";

type Props = {
  sale: ExploreSale;
};

export default function SaleDetailMap({ sale }: Props) {
  const lat = sale.lat;
  const lng = sale.lng;
  if (typeof lat !== "number" || typeof lng !== "number") {
    return null;
  }

  const center: [number, number] = [lat, lng];

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-muted/20 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40">
      <div className="h-[min(420px,55vh)] min-h-[260px] w-full">
        <SalesMap sales={[sale]} center={center} distance={12} />
      </div>
    </div>
  );
}
