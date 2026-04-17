"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

function LoginInner() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const redirectTo = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/auth/callback?next=/`;
  }, []);

  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function signInWithGitHub() {
    setBusy(true);
    setLocalError(null);

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLocalError(
        "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
      setBusy(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo,
      },
    });

    if (error) {
      setLocalError(error.message);
      setBusy(false);
    }
  }

  return (
    <main className="container" style={{ padding: "56px 20px 72px" }}>
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.06)",
          padding: 22,
          boxShadow: "0 24px 70px rgba(0,0,0,0.45)",
        }}
      >
        <p className="kicker" style={{ marginBottom: 8 }}>
          Developer Portal
        </p>
        <h1 className="h2" style={{ marginTop: 0 }}>
          Sign in
        </h1>
        <p className="lede" style={{ marginTop: 10 }}>
          GitHub only for now. We’ll add more providers once the portal is
          stable.
        </p>

        {(error || localError) && (
          <div
            style={{
              marginTop: 14,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255, 80, 80, 0.12)",
              color: "rgba(255,255,255,0.9)",
              fontSize: 13,
            }}
          >
            {localError ?? "Authentication failed. Please try again."}
          </div>
        )}

        <div className="ctaRow" style={{ marginTop: 16 }}>
          <button
            type="button"
            className="btn btnPrimary"
            onClick={signInWithGitHub}
            disabled={busy}
            style={{ cursor: busy ? "not-allowed" : "pointer" }}
          >
            {busy ? "Redirecting…" : "Continue with GitHub"}
          </button>

          <Link className="btn" href="/">
            Back to portal
          </Link>
        </div>

        <p style={{ margin: "14px 0 0", fontSize: 12, color: "var(--muted)" }}>
          You’ll be redirected to GitHub and back to{" "}
          <code>/auth/callback</code>.
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}

