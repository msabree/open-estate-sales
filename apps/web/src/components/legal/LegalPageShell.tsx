import type { ReactNode } from "react";

type LegalPageShellProps = {
  title: string;
  lastUpdated: string;
  children: ReactNode;
};

export function LegalPageShell({
  title,
  lastUpdated,
  children,
}: LegalPageShellProps) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-2xl uppercase tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {lastUpdated}
      </p>
      <div className="mt-10 space-y-10 text-sm leading-relaxed text-foreground/95 [&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 [&_a]:hover:underline [&_h2]:scroll-mt-24 [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:first:mt-0 [&_h3]:mt-6 [&_h3]:font-medium [&_h3]:text-foreground [&_li]:mt-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </main>
  );
}
