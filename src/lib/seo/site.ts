import { salePublicPath } from "@/utils/sales";

/** Public GitHub repository (override via NEXT_PUBLIC_GITHUB_REPO_URL). */
export function githubRepoUrl(): string {
  return (
    process.env.NEXT_PUBLIC_GITHUB_REPO_URL ??
    "https://github.com/msabree/open-estate-sales"
  ).replace(/\/$/, "");
}

/** Canonical site origin, no trailing slash. */
export function siteOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://openestatesales.com"
  ).replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${siteOrigin()}${p}`;
}

export function canonicalSaleUrl(regionSlug: string, listingSlug: string): string {
  return absoluteUrl(salePublicPath(regionSlug, listingSlug));
}
