import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null | undefined;

/** Browser client with cookie-backed session (pairs with `createServerClient` in `server.ts`). */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (cached !== undefined) {
    return cached;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    cached = null;
    return null;
  }
  cached = createBrowserClient(url, key);
  return cached;
}
