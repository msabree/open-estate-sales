import Link from "next/link";

const repo = "https://github.com/msabree/open-estate-sales";

export default function DevelopersPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 md:py-20">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Developers
      </p>
      <h1 className="mt-3 font-display text-4xl uppercase tracking-tight text-foreground">
        Build on open estate sales
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        Public HTTP APIs and operator integrations are{" "}
        <strong className="font-semibold text-foreground">on the roadmap</strong>{" "}
        — we&apos;re shipping the core product first, then documenting stable
        endpoints for listings, webhooks, and partners.
      </p>
      <div className="mt-8 rounded-xl border border-border bg-accent/[0.06] p-5 dark:bg-zinc-950/40">
        <p className="text-sm leading-relaxed text-foreground/90">
          <strong className="text-foreground">API access &amp; integrations:</strong>{" "}
          coming — watch the repo and changelog for release notes.
        </p>
      </div>
      <p className="mt-8 text-muted-foreground">
        This project is{" "}
        <strong className="text-foreground">AGPL-3.0</strong>. We welcome issues,
        docs fixes, and code contributions on GitHub — that&apos;s how the
        ecosystem stays open.
      </p>
      <p className="mt-6">
        <Link
          href={repo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-semibold text-accent underline-offset-4 hover:underline"
        >
          Contribute on GitHub →
        </Link>
      </p>
      <p className="mt-10 text-sm text-muted-foreground">
        <Link href="/" className="text-accent hover:underline">
          ← Back home
        </Link>
      </p>
    </main>
  );
}
