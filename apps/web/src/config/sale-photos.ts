/** Supabase Storage bucket for listing images (see migration `sale-photos`). */
export const SALE_PHOTOS_BUCKET = "sale-photos";

/**
 * Object key inside the bucket: `sales/{operatorUserId}/{saleId}/{fileName}`.
 * Public URL: `/storage/v1/object/public/sale-photos/{key}`
 */
export function buildSalePhotoObjectKey(
  operatorUserId: string,
  saleId: string,
  fileName: string,
): string {
  const safe = fileName.replace(/[/\\]/g, "").trim() || "photo.jpg";
  return `sales/${operatorUserId}/${saleId}/${safe}`;
}

/** Free tier: max photos per sale. Pro has no app-enforced cap (fair use / infra limits still apply). */
export const FREE_TIER_MAX_PHOTOS_PER_SALE = 200;

/** Pro tier: unlimited per-sale photos in app (`Infinity`). Free (and anything else): capped. */
export function maxPhotosForOperatorTier(tier: string | null | undefined): number {
  return tier === "pro"
    ? Number.POSITIVE_INFINITY
    : FREE_TIER_MAX_PHOTOS_PER_SALE;
}

/** Build a unique object key for an upload (client-safe). */
export function makeUploadObjectKey(
  operatorUserId: string,
  saleId: string,
  file: Pick<File, "name">,
): string {
  const ext =
    file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext)
    ? ext === "jpeg"
      ? "jpg"
      : ext
    : "jpg";
  const base = `${globalThis.crypto.randomUUID()}.${safeExt}`;
  return buildSalePhotoObjectKey(operatorUserId, saleId, base);
}

export function salePhotoPublicUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return "";
  const encoded = storagePath
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return `${base}/storage/v1/object/public/${SALE_PHOTOS_BUCKET}/${encoded}`;
}
