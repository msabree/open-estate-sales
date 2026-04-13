import Link from "next/link";

import { getSales } from "@/apis/data/sales";
import { salePublicPath } from "@/utils/sales";

export default async function SalesIndexPage() {
  const sales = await getSales({ limit: 50 });

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl uppercase text-zinc-100">
        Estate sales
      </h1>
      <p className="mt-2 text-zinc-400">
        Browse upcoming sales by city. URLs use{" "}
        <code className="text-zinc-300">/sales/region/title-year</code> for SEO.
      </p>
      <ul className="mt-8 space-y-3">
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
      {sales.length === 0 ? (
        <p className="mt-6 text-zinc-500">No published sales yet.</p>
      ) : null}
    </main>
  );
}
