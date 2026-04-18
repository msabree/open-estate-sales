"use server";

import { operatorProfileSchema } from "@/form-schemas/operator-profile";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export type ProfileActionResult =
  | { ok: true }
  | { ok: false; message: string };

async function getUser(): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>;
  user: User | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return { supabase, user: null };
  return { supabase, user };
}

async function ensureOperatorRow(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: { id: string; email?: string | null },
): Promise<ProfileActionResult> {
  const { data: existing } = await supabase
    .from("operators")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return { ok: true };

  const email = user.email ?? "unknown@example.com";
  const slug = `op-${user.id.replace(/-/g, "").slice(0, 12)}`;

  const { error } = await supabase.from("operators").insert({
    id: user.id,
    email,
    name: email.split("@")[0] ?? "Operator",
    slug,
  });

  if (error) {
    return { ok: false, message: error.message };
  }
  return { ok: true };
}

export async function updateOperatorProfile(
  raw: unknown,
): Promise<ProfileActionResult> {
  const parsed = operatorProfileSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      ok: false,
      message: first?.message ?? "Invalid input.",
    };
  }

  const { supabase, user } = await getUser();
  if (!user?.email) {
    return { ok: false, message: "Sign in to update your profile." };
  }

  const ensured = await ensureOperatorRow(supabase, user);
  if (!ensured.ok) return ensured;

  const d = parsed.data;
  const companyName =
    d.operator_kind === "company" ? (d.company_name ?? "").trim() : null;
  const logoRaw = d.company_logo_url?.trim();
  const companyLogoUrl =
    d.operator_kind === "company" && logoRaw ? logoRaw : null;

  const { error } = await supabase
    .from("operators")
    .update({
      email: user.email,
      name: d.name.trim(),
      phone: d.phone?.trim() || null,
      city: d.city?.trim() || null,
      state: d.state?.trim().toUpperCase() || null,
      operator_kind: d.operator_kind,
      company_name: companyName,
      company_logo_url: companyLogoUrl,
    })
    .eq("id", user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  return { ok: true };
}
