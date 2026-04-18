"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export type SaleCreationStep = {
  id: number;
  name: string;
  description?: string;
  href: string;
};

type Props = {
  steps: SaleCreationStep[];
};

function StepCircle({
  label,
  state,
}: {
  label: React.ReactNode;
  state: "completed" | "current" | "upcoming";
}) {
  return (
    <div
      className={cn(
        "relative z-10 flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold shadow-sm",
        state === "completed" && "border-accent/30 bg-accent text-white",
        state === "current" && "border-accent bg-background text-accent",
        state === "upcoming" && "border-border bg-muted/50 text-muted-foreground",
      )}
      aria-hidden
    >
      {label}
    </div>
  );
}

export function SaleCreationStepper({ steps }: Props) {
  const pathname = usePathname();
  const currentIndex = Math.max(
    0,
    steps.findIndex((s) => pathname?.startsWith(s.href)),
  );

  return (
    <nav aria-label="Sale creation progress" className="mb-8">
      <ol className="flex w-full items-start justify-between">
        {steps.map((step, i) => {
          const state: "completed" | "current" | "upcoming" =
            i < currentIndex ? "completed" : i === currentIndex ? "current" : "upcoming";

          return (
            <li key={step.id} className="relative flex flex-1 flex-col items-center">
              <Link
                href={step.href}
                aria-current={state === "current" ? "step" : undefined}
                className="group flex flex-col items-center gap-2 text-center outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <StepCircle
                  state={state}
                  label={
                    state === "completed" ? (
                      <Check
                        className="size-[1.125rem] stroke-[2.5] text-white"
                        aria-hidden
                      />
                    ) : (
                      step.id
                    )
                  }
                />

                <div className="space-y-0.5">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      state === "completed" && "text-foreground",
                      state === "current" && "text-foreground",
                      state === "upcoming" && "text-muted-foreground",
                    )}
                  >
                    {step.name}
                  </div>
                  {step.description ? (
                    <div className="text-xs text-muted-foreground">{step.description}</div>
                  ) : null}
                </div>
              </Link>

              {i !== steps.length - 1 ? (
                <div
                  className={cn(
                    "absolute left-1/2 top-[18px] h-0.5 w-full -translate-y-1/2",
                    i < currentIndex ? "bg-accent" : "bg-border",
                  )}
                  style={{ right: "-50%" }}
                  aria-hidden
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

