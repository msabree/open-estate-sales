"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinWaitlist } from "@/apis/data/waitlist";
import { isValidWaitlistEmail } from "@/lib/validate-email";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Enter your email.");
      return;
    }
    if (!isValidWaitlistEmail(trimmed)) {
      setError("Enter a valid email.");
      return;
    }
    setPending(true);
    const result = await joinWaitlist(trimmed);
    setPending(false);
    if (!result.ok) {
      setError(
        result.error === "server"
          ? "Something went wrong. Try again later."
          : "Could not subscribe. Try again.",
      );
      return;
    }
    setDone(true);
    setEmail("");
  }

  if (done) {
    return (
      <p className="text-sm text-muted-foreground">
        You&apos;re on the list. Thanks for following along.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Product updates and launch news — no spam.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <label htmlFor="footer-email" className="sr-only">
          Email for updates
        </label>
        <Input
          id="footer-email"
          name="email"
          type="text"
          inputMode="email"
          autoComplete="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          className={cn(
            "min-h-10 flex-1 border-border bg-background text-foreground",
            "dark:border-zinc-700 dark:bg-zinc-950/50",
          )}
          aria-invalid={Boolean(error)}
        />
        <Button
          type="submit"
          disabled={pending}
          className="shrink-0 bg-accent font-semibold text-zinc-950 hover:bg-accent/90"
        >
          {pending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
              …
            </>
          ) : (
            "Subscribe"
          )}
        </Button>
      </div>
      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
