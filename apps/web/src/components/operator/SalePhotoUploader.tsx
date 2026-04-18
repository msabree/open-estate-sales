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
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

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

  const previewUrls = photos.map((p) => salePhotoPublicUrl(p.storage_path));
  const capped = Number.isFinite(photoLimit);
  const atLimit = capped && photos.length >= photoLimit;

  const processFiles = useCallback(
    async (fileList: FileList | File[] | null) => {
      if (!fileList?.length) return;
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

      const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
      let room = capped ? photoLimit - photos.length : Number.POSITIVE_INFINITY;
      if (capped && room <= 0) {
        setError(
          `Photo limit reached (${FREE_TIER_MAX_PHOTOS_PER_SALE} on the free plan).`,
        );
        return;
      }

      setBusy(true);
      try {
        for (const file of files) {
          if (room <= 0) break;
          if (file.size > MAX_FILE_BYTES) {
            setError(`"${file.name}" is over 10MB.`);
            continue;
          }
          const objectKey = makeUploadObjectKey(operatorUserId, saleId, file);
          const { error: upErr } = await supabase.storage
            .from(SALE_PHOTOS_BUCKET)
            .upload(objectKey, file, {
              cacheControl: "3600",
              upsert: false,
              contentType: file.type || "image/jpeg",
            });
          if (upErr) {
            setError(upErr.message);
            break;
          }
          const reg = await registerSalePhotoAfterUpload(saleId, objectKey);
          if (!reg.ok || !reg.data) {
            setError(reg.ok ? "Could not save photo." : reg.message);
            await supabase.storage.from(SALE_PHOTOS_BUCKET).remove([objectKey]);
            break;
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
        }
      } finally {
        setBusy(false);
      }
    },
    [capped, operatorUserId, photoLimit, photos.length, saleId],
  );

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
                  void processFiles(e.dataTransfer.files);
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
              void processFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <div className="space-y-3">
            {busy ? (
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
                    PNG, JPG, WebP, GIF up to 10MB each
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
    </div>
  );
}
