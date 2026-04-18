import * as React from "react";

import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="avatar"
    className={cn(
      "relative flex size-8 shrink-0 overflow-hidden rounded-full border border-border",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, src, alt = "", onError, ...props }, ref) => {
  const [hidden, setHidden] = React.useState(!src);

  React.useEffect(() => {
    setHidden(!src);
  }, [src]);

  if (hidden) {
    return null;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary operator logo URLs
    <img
      ref={ref}
      data-slot="avatar-image"
      src={src}
      alt={alt}
      className={cn(
        "absolute inset-0 z-[1] aspect-square size-full object-cover",
        className,
      )}
      onError={(e) => {
        setHidden(true);
        onError?.(e);
      }}
      {...props}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="avatar-fallback"
    className={cn(
      "absolute inset-0 z-0 flex size-full items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
