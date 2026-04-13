/**
 * SEO path: `/sales/{regionSlug}/{listingSlug}`
 * Example region: `atlanta-ga`, listing: `smith-family-estate-2026`
 *
 * Use 2-letter USPS state codes in `state` (e.g. `GA`) for stable URLs.
 */

const SALES_BASE = "/sales";

function slugifySegment(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .trim();
}

/** `{city}-{state}` in lowercase, e.g. `atlanta-ga` */
export function buildRegionSlug(city: string, state: string): string {
  const cityPart = city
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  const statePart = state.toLowerCase().trim();
  return `${cityPart}-${statePart}`;
}

/** `{title-slug}-{year}` */
export function buildListingSlug(title: string, startDate: string): string {
  const titleSlug = slugifySegment(title) || "sale";
  const parsed = new Date(startDate);
  const year = Number.isNaN(parsed.getTime())
    ? new Date().getFullYear()
    : parsed.getFullYear();
  return `${titleSlug}-${year}`;
}

export function generateSaleSeoSegments(input: {
  title: string;
  city: string;
  state: string;
  startDate: string;
}): { regionSlug: string; listingSlug: string } {
  return {
    regionSlug: buildRegionSlug(input.city, input.state),
    listingSlug: buildListingSlug(input.title, input.startDate),
  };
}

/** Absolute path on this site (no domain). */
export function salePublicPath(regionSlug: string, listingSlug: string): string {
  return `${SALES_BASE}/${regionSlug}/${listingSlug}`;
}

/**
 * Legacy composite slug `region/listing` (e.g. for stored redirects).
 * Prefer `generateSaleSeoSegments` + `salePublicPath`.
 */
export function generateSaleSlugLegacy(input: {
  title: string;
  city: string;
  state: string;
  startDate: string;
}): string {
  const { regionSlug, listingSlug } = generateSaleSeoSegments(input);
  return `${regionSlug}/${listingSlug}`;
}

/** ~0.5 mile offset in degrees (rough; varies slightly by latitude). */
const FUZZ_OFFSET_DEG = 0.007;

/**
 * Offset coordinates by ~0.5 miles for approximate map display before address reveal.
 * Uses random offsets (not deterministic).
 */
export function fuzzCoordinates(
  lat: number,
  lng: number,
): { lat_fuzzy: number; lng_fuzzy: number } {
  const latOffset = (Math.random() - 0.5) * FUZZ_OFFSET_DEG * 2;
  const lngOffset = (Math.random() - 0.5) * FUZZ_OFFSET_DEG * 2;

  return {
    lat_fuzzy: Math.round((lat + latOffset) * 1_000_000) / 1_000_000,
    lng_fuzzy: Math.round((lng + lngOffset) * 1_000_000) / 1_000_000,
  };
}
