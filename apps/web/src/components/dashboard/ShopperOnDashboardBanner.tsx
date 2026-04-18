"use client";

import { usePersona } from "@/components/persona/PersonaProvider";

/** Reminds shoppers that listing tools stay behind “Listing” mode so we don’t mix two UXes on one surface. */
export function ShopperOnDashboardBanner() {
  const { user, persona, loading } = usePersona();

  if (loading || !user || persona !== "shopper") {
    return null;
  }

  return (
    <div
      className="border-b border-amber-500/35 bg-amber-500/10 px-4 py-2.5 text-center text-sm text-amber-950 dark:text-amber-100"
      role="status"
    >
      You’re in{" "}
      <span className="font-semibold">shopping</span> mode. Use the{" "}
      <span className="font-semibold">Listing</span> toggle in the header to manage
      drafts and publish sales.
    </div>
  );
}
