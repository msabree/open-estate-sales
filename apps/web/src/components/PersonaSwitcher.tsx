"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Persona } from "@/lib/persona";
import { usePersona } from "@/components/persona/PersonaProvider";
import { cn } from "@/lib/utils";
import { LayoutGrid, Store } from "lucide-react";

type Props = {
  className?: string;
};

const options: { value: Persona; label: string; short: string; Icon: typeof Store }[] = [
  {
    value: "shopper",
    label: "Shopping",
    short: "Shop",
    Icon: Store,
  },
  {
    value: "operator",
    label: "Listing",
    short: "List",
    Icon: LayoutGrid,
  },
];

/**
 * Compact rows for account dropdown (same navigation as the pill switcher).
 */
export function PersonaMenuSection({
  className,
  onAfterSelect,
}: {
  className?: string;
  onAfterSelect?: () => void;
}) {
  const router = useRouter();
  const { user, persona, loading, setPersona } = usePersona();
  const [pending, setPending] = useState(false);

  if (!user || loading) {
    return null;
  }

  async function select(next: Persona) {
    if (next === persona || pending) return;
    setPending(true);
    const result = await setPersona(next);
    setPending(false);
    if (!result.ok) return;
    onAfterSelect?.();
    if (next === "operator") {
      router.push("/dashboard");
    } else {
      router.push("/sales");
    }
    router.refresh();
  }

  return (
    <div className={cn("border-border border-b px-1 py-1", className)}>
      <p className="text-muted-foreground px-2 pb-1.5 text-[0.65rem] font-semibold uppercase tracking-wider">
        Mode
      </p>
      <div className="flex flex-col gap-0.5">
        {options.map(({ value, label, Icon }) => {
          const active = persona === value;
          return (
            <button
              key={value}
              type="button"
              disabled={pending}
              onClick={() => void select(value)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors",
                active
                  ? "bg-accent/15 text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                pending && !active && "opacity-50",
              )}
            >
              <Icon className="text-muted-foreground size-4 shrink-0" aria-hidden />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Airbnb-style mode control: separate browsing vs managing listings without mixing both in one IA.
 */
export function PersonaSwitcher({ className }: Props) {
  const router = useRouter();
  const { user, persona, loading, setPersona } = usePersona();
  const [pending, setPending] = useState(false);

  if (!user || loading) {
    return null;
  }

  async function select(next: Persona) {
    if (next === persona || pending) return;
    setPending(true);
    const result = await setPersona(next);
    setPending(false);
    if (!result.ok) return;
    if (next === "operator") {
      router.push("/dashboard");
    } else {
      router.push("/sales");
    }
    router.refresh();
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-muted/50 p-0.5 shadow-sm dark:bg-zinc-900/60",
        className,
      )}
      role="group"
      aria-label="Experience mode"
    >
      {options.map(({ value, label, short, Icon }) => {
        const active = persona === value;
        return (
          <button
            key={value}
            type="button"
            disabled={pending}
            onClick={() => void select(value)}
            aria-pressed={active}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors sm:px-3",
              active
                ? "bg-accent text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground",
              pending && !active && "opacity-50",
            )}
          >
            <Icon className="size-3.5 shrink-0 sm:size-4" aria-hidden />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{short}</span>
          </button>
        );
      })}
    </div>
  );
}
