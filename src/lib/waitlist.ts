export type JoinWaitlistResult =
  | { ok: true }
  | {
      ok: false;
      error: "config" | "client" | "server";
      message?: string;
    };

export function isWaitlistConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function joinWaitlist(email: string): Promise<JoinWaitlistResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return { ok: false, error: "config" };
  }

  const res = await fetch(`${url.replace(/\/$/, "")}/functions/v1/waitlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${anon}`,
      apikey: anon,
    },
    body: JSON.stringify({ email }),
  });

  let payload: unknown;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof (payload as { error: unknown }).error === "string"
        ? (payload as { error: string }).error
        : undefined;
    const kind = res.status >= 500 ? "server" : "client";
    return { ok: false, error: kind, message };
  }

  return { ok: true };
}
