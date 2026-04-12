"use client";

import { useState } from "react";

export function WaitlistForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-center text-sm text-zinc-400 md:text-left">
        You&apos;re on the list. We&apos;ll be in touch at launch.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-stretch"
    >
      <label htmlFor="email" className="sr-only">
        Email address
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="your@email.com"
        className="min-h-12 flex-1 rounded-xl border border-zinc-700 bg-zinc-950/80 px-4 text-zinc-100 placeholder:text-zinc-600 outline-none ring-accent/40 transition focus:border-accent focus:ring-2"
      />
      <button
        type="submit"
        className="min-h-12 shrink-0 rounded-xl bg-accent px-6 text-sm font-bold tracking-wide text-zinc-950 transition hover:brightness-110 active:brightness-95"
      >
        Notify me at launch
      </button>
    </form>
  );
}
