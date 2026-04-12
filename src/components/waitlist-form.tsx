"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isWaitlistConfigured, joinWaitlist } from "@/lib/waitlist";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function WaitlistForm() {
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!isWaitlistConfigured()) {
      setError(
        "Waitlist is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
      return;
    }

    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    if (!email) return;

    setPending(true);
    const result = await joinWaitlist(email);
    setPending(false);

    if (!result.ok) {
      if (result.error === "config") {
        setError("Waitlist is not configured.");
      } else if (result.message === "Invalid email") {
        setError("Enter a valid email address.");
      } else {
        setError(
          result.error === "server"
            ? "Something went wrong. Try again in a moment."
            : "Could not join the waitlist. Try again.",
        );
      }
      return;
    }

    setSubmitted(true);
    form.reset();
  }

  if (submitted) {
    return (
      <p className="text-center text-sm text-zinc-400 md:text-left">
        You&apos;re on the list. We&apos;ll be in touch at launch.
      </p>
    );
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
      >
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="your@email.com"
          disabled={pending}
          className={cn(
            "min-h-12 h-12 flex-1 rounded-xl border-zinc-700 bg-zinc-950/80 px-4 text-base text-zinc-100 placeholder:text-zinc-600 md:text-sm",
          )}
        />
        <Button
          type="submit"
          disabled={pending}
          className={cn(
            "inline-flex min-h-12 h-12 shrink-0 items-center justify-center gap-2 rounded-xl border-0 bg-accent px-6 text-sm font-bold tracking-wide text-zinc-950 hover:bg-accent/90",
          )}
        >
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Joining…
            </>
          ) : (
            "Notify me at launch"
          )}
        </Button>
      </form>
      {error ? (
        <p className="text-center text-sm text-red-400 sm:text-left" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
