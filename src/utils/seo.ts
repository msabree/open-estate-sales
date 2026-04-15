import { salePublicPath } from "@/utils/sales";

const SITE_URL = "https://openestatesales.com";

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

export function canonicalSaleUrl(regionSlug: string, listingSlug: string): string {
  return absoluteUrl(salePublicPath(regionSlug, listingSlug));
}