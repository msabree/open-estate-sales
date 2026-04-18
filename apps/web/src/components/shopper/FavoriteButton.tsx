"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type Props = {
  itemId: string;
  saleId?: string;
  itemTitle?: string;
  saleTitle?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const iconSize = { sm: "size-4", md: "size-5", lg: "size-7" };

/**
 * Client-side favorite toggle. Wire to Supabase / API when favorites ship.
 */
export default function FavoriteButton({
  itemId,
  size = "md",
  className,
}: Props) {
  const [favorited, setFavorited] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={favorited}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      title={favorited ? "Remove from favorites" : "Save to favorites"}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-background/90 p-1.5 text-muted-foreground shadow-sm transition-colors hover:border-accent/50 hover:text-accent",
        favorited && "border-accent/40 text-accent",
        className,
      )}
      onClick={() => setFavorited((v) => !v)}
      data-item-id={itemId}
    >
      <Heart
        className={cn(iconSize[size], favorited && "fill-current")}
        aria-hidden
      />
    </button>
  );
}
