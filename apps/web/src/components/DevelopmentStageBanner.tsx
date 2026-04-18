import {
  BadgeCheck,
  FlaskConical,
  Gauge,
  Hammer,
  Rocket,
} from "lucide-react";

import { getAppStage, type AppStage } from "@/config/app-stage";
import { cn } from "@/lib/utils";

const STAGE_COPY: Record<
  AppStage,
  {
    title: string;
    body: string;
    Icon: typeof Hammer;
    accent: "volt" | "emerald";
  }
> = {
  building: {
    title: "We're currently building.",
    body: "Feel free to poke around and break stuff. We ship fast and data might reset without warning.",
    Icon: Hammer,
    accent: "volt",
  },
  experimental: {
    title: "Experimental build.",
    body: "The core is here, but it's rough. If you find a bug, we'd love a PR or an issue report.",
    Icon: FlaskConical,
    accent: "volt",
  },
  alpha: {
    title: "Alpha testing.",
    body: "It's early days. Code is open source—come help us make this better.",
    Icon: Rocket,
    accent: "volt",
  },
  beta: {
    title: "Beta.",
    body: "Things are stabilizing. Thanks for helping us harden the product before the big launch.",
    Icon: Gauge,
    accent: "volt",
  },
  live: {
    title: "We're live.",
    body: "v1 is officially out. We're still shipping daily, but your data is safe here.",
    Icon: BadgeCheck,
    accent: "emerald",
  },
};

export function DevelopmentStageBanner() {
  const stage = getAppStage();
  const { title, body, Icon, accent } = STAGE_COPY[stage];

  return (
    <div
      role="status"
      aria-label={`Product stage: ${stage}`}
      className={cn(
        "border-b border-dashed border-border/90 bg-zinc-500/[0.06] dark:border-zinc-600/80 dark:bg-zinc-950/40",
        accent === "volt" && "border-l-[3px] border-l-volt border-dashed",
        accent === "emerald" &&
          "border-l-[3px] border-l-emerald-500 border-dashed",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-start gap-2.5 px-4 py-2.5 sm:items-center sm:gap-3 sm:px-6">
        <Icon
          className={cn(
            "mt-0.5 size-4 shrink-0 sm:mt-0",
            accent === "volt" ? "text-accent" : "text-emerald-600 dark:text-emerald-400",
          )}
          aria-hidden
        />
        <p className="min-w-0 flex-1 text-sm leading-snug text-foreground/95 dark:text-zinc-200">
          <strong className="font-semibold text-foreground">{title}</strong>{" "}
          <span className="text-muted-foreground">{body}</span>
        </p>
      </div>
    </div>
  );
}
