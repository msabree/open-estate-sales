import { ExternalLink } from "lucide-react";
import Link from "next/link";

import { GithubMarkIcon } from "@/components/github-mark-icon";
import { githubRepoUrl, siteOrigin } from "@/lib/seo/site";
import { cn } from "@/lib/utils";

type FooterProps = {
  className?: string;
};

export function Footer({ className }: FooterProps) {
  const year = new Date().getFullYear();
  const repo = githubRepoUrl();

  return (
    <footer
      className={cn(
        "mt-auto border-t border-zinc-800/90 bg-surface/60",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-center text-xs text-zinc-500 sm:text-left">
          © {year} Open Estate Sales · AGPL-3.0 ·{" "}
          <Link
            href={siteOrigin()}
            className="text-zinc-400 underline-offset-4 hover:text-zinc-300 hover:underline"
          >
            {siteOrigin().replace(/^https?:\/\//, "")}
          </Link>
        </p>
        <Link
          href={repo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
        >
          <GithubMarkIcon className="size-5 shrink-0" />
          <span className="font-medium">Source on GitHub</span>
          <span className="sr-only">(opens in new tab)</span>
          <ExternalLink className="size-4 opacity-70" aria-hidden />
        </Link>
      </div>
    </footer>
  );
}
