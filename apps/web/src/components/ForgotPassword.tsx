"use client";

import { requestPasswordReset } from "@/app/login/actions";
import { useState, useTransition } from "react";

type Props = {
  onDone: () => void;
};

export default function ForgotPassword({ onDone }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("email", email);
    startTransition(async () => {
      const res = await requestPasswordReset(fd);
      if (!res.success) {
        setError(res.errorMessage ?? "Could not send reset email.");
        return;
      }
      setDone(true);
    });
  }

  if (done) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-foreground/90">
          If an account exists for <strong>{email}</strong>, we sent a link to reset
          your password.
        </p>
        <button
          type="button"
          onClick={onDone}
          className="text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Reset password</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a link.
        </p>
      </div>
      <div>
        <label
          htmlFor="reset-email"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Email
        </label>
        <input
          id="reset-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-white/25 bg-white/15 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-accent focus:ring-2 focus:ring-accent/40 dark:border-white/20"
          placeholder="you@example.com"
          required
        />
      </div>
      {error ? (
        <p className="text-sm text-red-200" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onDone}
          className="text-sm font-medium text-white/80 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-accent/90 disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send link"}
        </button>
      </div>
    </form>
  );
}
