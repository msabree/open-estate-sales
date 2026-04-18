import imageCompression from "browser-image-compression";

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: "jpeg" | "webp";
  convertHeic?: boolean;
}

export interface CompressedImage {
  file: File;
  fileName: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

async function convertHeicToJpeg(file: File): Promise<File> {
  if (typeof window === "undefined") {
    return file;
  }

  try {
    const heic2any = (await import("heic2any")).default;
    const heicBlob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.92,
    });
    const blob = Array.isArray(heicBlob) ? heicBlob[0]! : heicBlob;
    return new File([blob], file.name.replace(/\.heic$/i, ".jpg"), {
      type: "image/jpeg",
    });
  } catch (error) {
    console.error("HEIC conversion failed:", error);
    return file;
  }
}

function isHeicFile(file: File): boolean {
  return (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif")
  );
}

/** GIF uploads are passed through so animation is preserved. */
function isGifFile(file: File): boolean {
  return file.type === "image/gif" || file.name.toLowerCase().endsWith(".gif");
}

/**
 * Compress listing photos for web: capped dimensions, WebP/JPEG, CDN-friendly small payloads.
 * HEIC/HEIF is converted first (bucket only allows jpeg/png/webp/gif).
 */
export async function compressListingPhoto(
  file: File,
  options: CompressionOptions = {},
): Promise<CompressedImage> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    format = "webp",
    convertHeic = true,
  } = options;

  const maxSide = Math.max(maxWidth, maxHeight);
  const originalSize = file.size;

  if (isGifFile(file)) {
    return {
      file,
      fileName: file.name,
      originalSize,
      compressedSize: file.size,
      compressionRatio: 0,
    };
  }

  try {
    let processedFile = file;

    if (convertHeic && isHeicFile(file)) {
      processedFile = await convertHeicToJpeg(file);
    }

    const fileType =
      format === "webp" ? "image/webp" : "image/jpeg";

    const compressed = await imageCompression(processedFile, {
      maxWidthOrHeight: maxSide,
      useWebWorker: true,
      maxSizeMB: 2,
      maxIteration: 12,
      fileType,
      initialQuality: format === "webp" ? 0.82 : 0.88,
    });

    const originalName = processedFile.name;
    const dot = originalName.lastIndexOf(".");
    const nameWithoutExt =
      dot > 0 ? originalName.slice(0, dot) : originalName;
    const extension = format === "webp" ? "webp" : "jpg";
    const fileName = `${nameWithoutExt}.${extension}`;

    const out = new File([compressed], fileName, {
      type: compressed.type || fileType,
      lastModified: Date.now(),
    });

    const compressedSize = out.size;
    const compressionRatio =
      originalSize > 0
        ? ((originalSize - compressedSize) / originalSize) * 100
        : 0;

    return {
      file: out,
      fileName,
      originalSize,
      compressedSize,
      compressionRatio,
    };
  } catch (error) {
    console.error("Image compression failed:", error);
    throw new Error("Failed to compress image");
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}
