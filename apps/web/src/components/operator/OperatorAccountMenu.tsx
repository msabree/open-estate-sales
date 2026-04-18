"use client";

import { usePersona } from "@/components/persona/PersonaProvider";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { ChevronDown, LayoutGrid, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Minimal account menu (no avatar): dashboard / profile when in operator mode, sign out for any signed-in user.
 */
export function OperatorAccountMenu({ className }: { className?: string }) {
  const { user, persona, loading } = usePersona();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const isOperator = persona === "operator";

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (!open) return;
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase?.auth.signOut();
    setOpen(false);
    router.push("/sales");
    router.refresh();
  }

  if (loading || !user) {
    return null;
  }

  return (
    <div className={cn("relative", className)} ref={wrapRef}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        className="gap-1 font-semibold uppercase tracking-wider"
      >
        <UserRound className="size-3.5" aria-hidden />
        <span className="hidden sm:inline">Account</span>
        <ChevronDown
          className={cn("size-3.5 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </Button>
      {open ? (
        <div
          role="menu"
          className="border-border bg-popover text-popover-foreground absolute right-0 z-50 mt-1 w-52 rounded-lg border py-1 text-sm shadow-md"
        >
          {isOperator ? (
            <>
              <Link
                role="menuitem"
                href="/dashboard"
                className="hover:bg-muted flex items-center gap-2 px-3 py-2 transition-colors"
                onClick={() => setOpen(false)}
              >
                <LayoutGrid className="text-muted-foreground size-4" aria-hidden />
                Dashboard
              </Link>
              <Link
                role="menuitem"
                href="/dashboard/profile"
                className="hover:bg-muted flex items-center gap-2 px-3 py-2 transition-colors"
                onClick={() => setOpen(false)}
              >
                <UserRound className="text-muted-foreground size-4" aria-hidden />
                Profile
              </Link>
              <div className="bg-border my-1 h-px" role="separator" />
            </>
          ) : null}
          <button
            role="menuitem"
            type="button"
            className="text-destructive hover:bg-muted flex w-full items-center gap-2 px-3 py-2 text-left transition-colors"
            onClick={() => void signOut()}
          >
            <LogOut className="size-4" aria-hidden />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
