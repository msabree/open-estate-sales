import Link from "next/link";

import SalesMap, { type MapSale } from "@/components/SalesMap";
import { salePublicPath } from "@/utils/sales";

export default async function SalesIndexPage() {
  const sales: (MapSale & {
    region_slug: string;
    listing_slug: string;
    city: string;
    state: string;
  })[] = [
    {
      id: "demo-atl-1",
      title: "Smith Family Estate",
      lat: 33.749,
      lng: -84.388,
      addressVisible: false,
      main_display_image: "/placeholder.jpg",
      sale_dates: [{ sale_date: "2026-05-01" }, { sale_date: "2026-05-03" }],
      region_slug: "atlanta-ga",
      listing_slug: "smith-family-estate-2026",
      city: "Atlanta",
      state: "GA",
      href: "/sales/atlanta-ga/smith-family-estate-2026",
    },
    {
      id: "demo-atl-2",
      title: "Midtown Vintage & Art",
      lat: 33.783,
      lng: -84.383,
      addressVisible: true,
      main_display_image: "/placeholder.jpg",
      sale_dates: [{ sale_date: "2026-05-10" }, { sale_date: "2026-05-11" }],
      region_slug: "atlanta-ga",
      listing_slug: "midtown-vintage-art-2026",
      city: "Atlanta",
      state: "GA",
      href: "/sales/atlanta-ga/midtown-vintage-art-2026",
    },
    {
      id: "demo-bkn-1",
      title: "Park Slope Moving Sale",
      lat: 40.672,
      lng: -73.978,
      addressVisible: false,
      main_display_image: "/placeholder.jpg",
      sale_dates: [{ sale_date: "2026-06-06" }, { sale_date: "2026-06-07" }],
      region_slug: "brooklyn-ny",
      listing_slug: "park-slope-moving-sale-2026",
      city: "Brooklyn",
      state: "NY",
      href: "/sales/brooklyn-ny/park-slope-moving-sale-2026",
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl uppercase text-zinc-100">
        Estate sales
      </h1>
      <p className="mt-2 text-zinc-400">
        Browse upcoming sales by city. URLs use{" "}
        <code className="text-zinc-300">/sales/region/title-year</code> for SEO.
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">
        <div className="h-[420px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/40">
          <SalesMap
            sales={sales}
            center={[33.749, -84.388]}
            distance={25}
          />
        </div>
        <div>
          <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
            Test data
          </h2>
          <ul className="mt-4 space-y-3">
        {sales.map((s) => (
          <li key={s.id}>
            <Link
              href={salePublicPath(s.region_slug, s.listing_slug)}
              className="text-accent hover:underline"
            >
              {s.title}
            </Link>
            <span className="ml-2 text-sm text-zinc-500">
              {s.city}, {s.state}
            </span>
          </li>
        ))}
          </ul>
          <p className="mt-4 text-xs text-zinc-500">
            To enable the map, set{" "}
            <code className="text-zinc-300">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{" "}
            in <code className="text-zinc-300">.env.local</code>.
          </p>
        </div>
      </div>
    </main>
  );
}
