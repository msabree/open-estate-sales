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
                ? "bg-accent text-zinc-950 shadow-sm"
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
