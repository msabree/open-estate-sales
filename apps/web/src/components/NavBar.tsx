"use client";

import Link from "next/link";

import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import { usePersona } from "@/components/persona/PersonaProvider";
import { SiteLogo } from "@/components/icons/Logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavBarProps = {
  className?: string;
};

export function NavBar({ className }: NavBarProps) {
  const { user, persona, loading } = usePersona();
  const isOperator = Boolean(user) && persona === "operator";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md dark:bg-surface/85",
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <SiteLogo size="compact" />
        <div className="flex flex-1 flex-wrap items-center justify-end gap-3 sm:gap-4 md:flex-nowrap md:justify-between">
          <nav
            className="order-last flex w-full items-center gap-4 text-sm font-medium uppercase tracking-wider text-muted-foreground md:order-none md:ml-6 md:w-auto md:gap-6"
            aria-label="Main"
          >
            <Link href="/" className="transition-colors hover:text-accent">
              Home
            </Link>
            {isOperator ? (
              <Link
                href="/dashboard"
                className="transition-colors hover:text-accent"
              >
                Dashboard
              </Link>
            ) : null}
            <Link href="/sales" className="transition-colors hover:text-accent">
              Explore
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {!loading && user ? <PersonaSwitcher /> : null}
            {!loading && !user ? (
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "font-semibold uppercase tracking-wider",
                )}
              >
                Sign in
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
