"use client";

import {
  deleteSalePhoto,
  registerSalePhotoAfterUpload,
  type SalePhotoRow,
} from "@/app/dashboard/sale-photos-actions";
import {
  FREE_TIER_MAX_PHOTOS_PER_SALE,
  makeUploadObjectKey,
  maxPhotosForOperatorTier,
  salePhotoPublicUrl,
  SALE_PHOTOS_BUCKET,
} from "@/config/sale-photos";
import {
  compressListingPhoto,
  formatFileSize,
} from "@/lib/image-compression";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.heic,.heif";

/** Browser + CDN cache for immutable public listing photos (seconds). */
const UPLOAD_CACHE_CONTROL_SECONDS = 31_536_000; // 365d

type StagedItem = {
  id: string;
  file: File;
  previewUrl: string;
};

type Props = {
  saleId: string;
  operatorUserId: string;
  initialPhotos: SalePhotoRow[];
  tier: string;
};

export function SalePhotoUploader({
  saleId,
  operatorUserId,
  initialPhotos,
  tier,
}: Props) {
  const photoLimit = maxPhotosForOperatorTier(tier);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState(initialPhotos);
  const [isDragOver, setIsDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [staged, setStaged] = useState<StagedItem[]>([]);
  const [statusLine, setStatusLine] = useState<string | null>(null);

  const previewUrls = photos.map((p) => salePhotoPublicUrl(p.storage_path));
  const capped = Number.isFinite(photoLimit);
  const atLimit = capped && photos.length >= photoLimit;
  const remainingSlots = capped ? Math.max(0, photoLimit - photos.length) : Infinity;
  const overCap = capped && staged.length > remainingSlots;
  const canConfirmUpload =
    staged.length > 0 && !overCap && !busy && remainingSlots > 0;

  const revokeStagedUrls = useCallback((items: StagedItem[]) => {
    for (const s of items) {
      URL.revokeObjectURL(s.previewUrl);
    }
  }, []);

  const closeReview = useCallback(() => {
    setReviewOpen(false);
    setStaged((prev) => {
      revokeStagedUrls(prev);
      return [];
    });
    setStatusLine(null);
  }, [revokeStagedUrls]);

  useEffect(() => {
    if (!reviewOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) {
        e.preventDefault();
        closeReview();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reviewOpen, busy, closeReview]);

  const addFilesToReview = useCallback(
    (fileList: FileList | File[] | null) => {
      if (!fileList?.length) return;
      setError(null);

      const raw = Array.from(fileList);
      const images = raw.filter(
        (f) =>
          f.type.startsWith("image/") ||
          /\.(heic|heif)$/i.test(f.name),
      );
      if (!images.length) {
        setError("No supported images in that selection.");
        return;
      }

      const tooBig = images.find((f) => f.size > MAX_FILE_BYTES);
      if (tooBig) {
        setError(`"${tooBig.name}" is over 10MB. Choose a smaller file.`);
        return;
      }

      if (capped && remainingSlots <= 0) {
        setError(
          `Photo limit reached (${FREE_TIER_MAX_PHOTOS_PER_SALE} on the free plan).`,
        );
        return;
      }

      const next: StagedItem[] = images.map((file) => ({
        id: globalThis.crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      setStaged((prev) => {
        if (prev.length) revokeStagedUrls(prev);
        return next;
      });
      setReviewOpen(true);
    },
    [capped, remainingSlots, revokeStagedUrls],
  );

  const removeStaged = useCallback((id: string) => {
    setStaged((prev) => {
      const item = prev.find((s) => s.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((s) => s.id !== id);
    });
  }, []);

  const uploadStaged = useCallback(async () => {
    if (!staged.length || overCap || !canConfirmUpload) return;
    setError(null);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Missing Supabase configuration.");
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || user.id !== operatorUserId) {
      setError("Session expired. Refresh and try again.");
      return;
    }

    setBusy(true);
    try {
      let room =
        capped ? photoLimit - photos.length : Number.POSITIVE_INFINITY;
      const toProcess = staged.slice(0, room);

      for (let i = 0; i < toProcess.length; i++) {
        const { file } = toProcess[i]!;
        setStatusLine(
          `Optimizing ${i + 1} of ${toProcess.length}…`,
        );

        const { file: uploadFile } = await compressListingPhoto(file);
        if (uploadFile.size > MAX_FILE_BYTES) {
          setError(
            `After processing, "${file.name}" is still over 10MB. Try another photo.`,
          );
          return;
        }

        const objectKey = makeUploadObjectKey(operatorUserId, saleId, uploadFile);
        const { error: upErr } = await supabase.storage
          .from(SALE_PHOTOS_BUCKET)
          .upload(objectKey, uploadFile, {
            cacheControl: String(UPLOAD_CACHE_CONTROL_SECONDS),
            upsert: false,
            contentType: uploadFile.type || "image/jpeg",
          });
        if (upErr) {
          setError(upErr.message);
          return;
        }
        const reg = await registerSalePhotoAfterUpload(saleId, objectKey);
        if (!reg.ok || !reg.data) {
          setError(reg.ok ? "Could not save photo." : reg.message);
          await supabase.storage.from(SALE_PHOTOS_BUCKET).remove([objectKey]);
          return;
        }
        const inserted = reg.data;
        setPhotos((prev) => [
          ...prev,
          {
            id: inserted.id,
            storage_path: objectKey,
            sort_order: prev.length,
            alt_text: null,
          },
        ]);
        room -= 1;
        if (room <= 0) break;
      }

      closeReview();
    } finally {
      setBusy(false);
      setStatusLine(null);
    }
  }, [
    canConfirmUpload,
    capped,
    closeReview,
    operatorUserId,
    overCap,
    photoLimit,
    photos.length,
    saleId,
    staged,
  ]);

  async function removeAt(index: number) {
    const row = photos[index];
    if (!row) return;
    setError(null);
    setBusy(true);
    try {
      const res = await deleteSalePhoto(saleId, row.id);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      setPhotos((prev) => prev.filter((_, i) => i !== index));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Listing photos (optional)
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Upload images so shoppers can preview your sale. You can add more later
          from the dashboard.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {capped ? (
            <>
              Photos: {photos.length}/{photoLimit}
              {atLimit ? (
                <span className="ml-1 block sm:inline">
                  Free plan limit — upgrade to Pro for unlimited.
                </span>
              ) : null}
            </>
          ) : (
            <>
              Photos: {photos.length}{" "}
              <span className="text-foreground/80">(Pro · unlimited)</span>
            </>
          )}
        </p>
      </div>

      {error ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <label className="block">
        <div
          className={cn(
            "rounded-xl border-2 border-dashed p-8 text-center transition-all",
            atLimit || busy
              ? "cursor-not-allowed border-muted bg-muted/40 opacity-80"
              : isDragOver
                ? "scale-[1.01] border-primary bg-primary/5"
                : "cursor-pointer border-border hover:border-primary/50",
          )}
          onDragOver={
            atLimit || busy
              ? undefined
              : (e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }
          }
          onDragLeave={
            atLimit || busy
              ? undefined
              : () => setIsDragOver(false)
          }
          onDrop={
            atLimit || busy
              ? undefined
              : (e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  addFilesToReview(e.dataTransfer.files);
                }
          }
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPT}
            disabled={atLimit || busy}
            className="hidden"
            onChange={(e) => {
              addFilesToReview(e.target.files);
              e.target.value = "";
            }}
          />
          <div className="space-y-3">
            {busy && !reviewOpen ? (
              <Loader2 className="mx-auto size-10 animate-spin text-muted-foreground" />
            ) : (
              <svg
                className="mx-auto size-12 text-muted-foreground"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <div>
              {atLimit ? (
                <p className="text-sm font-medium text-muted-foreground">
                  Photo limit reached ({FREE_TIER_MAX_PHOTOS_PER_SALE} on free)
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    <button
                      type="button"
                      className="font-semibold text-primary hover:underline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Click to upload
                    </button>{" "}
                    or drag and drop
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    PNG, JPG, WebP, GIF, HEIC up to 10MB each — you&apos;ll
                    review before they go live; we optimize for fast loading.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </label>

      {previewUrls.length > 0 ? (
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            Photos
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {previewUrls.length}
            </span>
          </h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {previewUrls.map((url, i) => (
              <div
                key={photos[i]!.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
              >
                <Image
                  src={url}
                  alt={photos[i]?.alt_text || `Photo ${i + 1}`}
                  fill
                  className="object-cover transition group-hover:opacity-90"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void removeAt(i)}
                  className="absolute right-1.5 top-1.5 rounded-full bg-background/90 p-1.5 text-foreground shadow-sm opacity-0 transition hover:bg-background group-hover:opacity-100"
                  title="Remove photo"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {reviewOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close review"
            disabled={busy}
            onClick={() => {
              if (!busy) closeReview();
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sale-photo-review-title"
            className="relative z-10 flex max-h-[min(90vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-background shadow-lg"
          >
            <div className="border-b border-border px-4 py-3">
              <h4
                id="sale-photo-review-title"
                className="text-base font-semibold text-foreground"
              >
                Review photos
              </h4>
              <p className="mt-1 text-xs text-muted-foreground">
                {capped ? (
                  <>
                    Adding {staged.length} — room for{" "}
                    <span className="font-medium text-foreground">
                      {remainingSlots}
                    </span>{" "}
                    more on this sale.
                  </>
                ) : (
                  <>Adding {staged.length} photo(s).</>
                )}
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              {overCap ? (
                <p className="mb-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  Too many for your plan: remove{" "}
                  {staged.length - remainingSlots} or upgrade to Pro for
                  unlimited.
                </p>
              ) : null}
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {staged.map((s) => (
                  <li key={s.id} className="group">
                    <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                      <Image
                        src={s.previewUrl}
                        alt={s.file.name}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="120px"
                      />
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => removeStaged(s.id)}
                        className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-foreground shadow-sm opacity-0 transition hover:bg-background group-hover:opacity-100"
                        title="Remove from batch"
                      >
                        <X className="size-3.5" />
                      </button>
                      <div className="absolute inset-x-0 bottom-0 truncate bg-background/85 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {s.file.name} · {formatFileSize(s.file.size)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2 border-t border-border px-4 py-3 sm:flex-row sm:justify-end">
              {statusLine ? (
                <p className="mr-auto flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" />
                  {statusLine}
                </p>
              ) : null}
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={closeReview}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="gap-2"
                disabled={!canConfirmUpload}
                onClick={() => void uploadStaged()}
              >
                {busy ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Uploading…
                  </>
                ) : (
                  <>
                    Upload {staged.length} photo
                    {staged.length === 1 ? "" : "s"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
