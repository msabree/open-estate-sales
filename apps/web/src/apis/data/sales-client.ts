/**
 * Browser Supabase mutations for operator sale flows (RLS: authenticated user).
 * Public server reads stay in `sales.ts` (server-only).
 */

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  buildListingSlug,
  buildRegionSlug,
  fuzzCoordinates,
  salePublicPath,
} from "@/utils/sales";

export type MutationResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; message: string };

async function ensureOperatorRow(
  supabase: NonNullable<ReturnType<typeof getSupabaseBrowserClient>>,
  user: { id: string; email?: string | null },
): Promise<MutationResult> {
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

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

export async function createSale(): Promise<
  MutationResult<{ saleId: string }>
> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, message: "Missing Supabase client configuration." };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { ok: false, message: "Sign in to create a sale." };
  }

  const ensured = await ensureOperatorRow(supabase, user);
  if (!ensured.ok) return ensured;

  const year = new Date().getFullYear();
  const suffix = crypto.randomUUID().slice(0, 8);
  const listingSlug = `untitled-${suffix}-${year}`;
  const city = "Atlanta";
  const state = "GA";
  const regionSlug = buildRegionSlug(city, state);

  const start = new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  const reveal = new Date();
  reveal.setDate(reveal.getDate() + 1);

  const { data, error } = await supabase
    .from("sales")
    .insert({
      operator_id: user.id,
      title: "New sale",
      description: null,
      city,
      state,
      zip: null,
      region_slug: regionSlug,
      listing_slug: listingSlug,
      address: null,
      lat: null,
      lng: null,
      lat_fuzzy: null,
      lng_fuzzy: null,
      address_reveal_at: reveal.toISOString(),
      start_date: start.toISOString().slice(0, 10),
      end_date: end.toISOString().slice(0, 10),
      preview_times: null,
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, message: error?.message ?? "Could not create draft." };
  }

  return { ok: true, data: { saleId: data.id } };
}

export type UpdateSaleLocationInput = {
  saleId: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  zip: string | null;
  addressRevealAt: string;
};

export async function updateSaleLocation(
  input: UpdateSaleLocationInput,
): Promise<MutationResult> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, message: "Missing Supabase client configuration." };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { ok: false, message: "Not signed in." };
  }

  const { lat_fuzzy, lng_fuzzy } = fuzzCoordinates(input.latitude, input.longitude);
  const regionSlug = buildRegionSlug(input.city, input.state);

  const { error } = await supabase
    .from("sales")
    .update({
      address: input.address,
      lat: input.latitude,
      lng: input.longitude,
      lat_fuzzy,
      lng_fuzzy,
      city: input.city,
      state: input.state,
      zip: input.zip,
      region_slug: regionSlug,
      address_reveal_at: input.addressRevealAt,
    })
    .eq("id", input.saleId)
    .eq("operator_id", user.id);

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

export type UpdateSaleDetailsInput = {
  saleId: string;
  title: string;
  description: string | null;
};

export async function updateSaleDetails(
  input: UpdateSaleDetailsInput,
): Promise<MutationResult> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, message: "Missing Supabase client configuration." };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { ok: false, message: "Not signed in." };
  }

  const title = input.title.trim();
  if (!title) {
    return { ok: false, message: "Enter a sale title." };
  }

  const { data: row, error: fetchError } = await supabase
    .from("sales")
    .select("start_date, city, state")
    .eq("id", input.saleId)
    .eq("operator_id", user.id)
    .maybeSingle();

  if (fetchError) return { ok: false, message: fetchError.message };
  if (!row) return { ok: false, message: "Sale not found." };

  const listingSlug = buildListingSlug(title, row.start_date);
  const regionSlug = buildRegionSlug(row.city, row.state);

  const { error } = await supabase
    .from("sales")
    .update({
      title,
      description: input.description?.trim() || null,
      listing_slug: listingSlug,
      region_slug: regionSlug,
    })
    .eq("id", input.saleId)
    .eq("operator_id", user.id);

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

export type UpdateSaleScheduleInput = {
  saleId: string;
  startDate: string;
  endDate: string;
  previewTimes: string | null;
};

export async function updateSaleSchedule(
  input: UpdateSaleScheduleInput,
): Promise<MutationResult> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, message: "Missing Supabase client configuration." };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { ok: false, message: "Not signed in." };
  }

  if (!input.startDate || !input.endDate) {
    return { ok: false, message: "Start and end dates are required." };
  }

  if (input.endDate < input.startDate) {
    return { ok: false, message: "End date must be on or after start date." };
  }

  const { data: row, error: fetchError } = await supabase
    .from("sales")
    .select("title, city, state")
    .eq("id", input.saleId)
    .eq("operator_id", user.id)
    .maybeSingle();

  if (fetchError) return { ok: false, message: fetchError.message };
  if (!row) return { ok: false, message: "Sale not found." };

  const listingSlug = buildListingSlug(row.title, input.startDate);
  const regionSlug = buildRegionSlug(row.city, row.state);

  const { error } = await supabase
    .from("sales")
    .update({
      start_date: input.startDate,
      end_date: input.endDate,
      preview_times: input.previewTimes?.trim() || null,
      listing_slug: listingSlug,
      region_slug: regionSlug,
    })
    .eq("id", input.saleId)
    .eq("operator_id", user.id);

  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

export async function publishSale(saleId: string): Promise<
  MutationResult<{ regionSlug: string; listingSlug: string }>
> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, message: "Missing Supabase client configuration." };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { ok: false, message: "Not signed in." };
  }

  const { data: row, error: fetchError } = await supabase
    .from("sales")
    .select("address, lat, lng, title, region_slug, listing_slug")
    .eq("id", saleId)
    .eq("operator_id", user.id)
    .maybeSingle();

  if (fetchError) return { ok: false, message: fetchError.message };
  if (!row) return { ok: false, message: "Sale not found." };

  if (!row.address || row.lat == null || row.lng == null) {
    return {
      ok: false,
      message: "Add a full address before publishing.",
    };
  }

  const t = row.title.trim();
  if (!t || t === "New sale") {
    return { ok: false, message: "Set a descriptive title before publishing." };
  }

  const publishedAt = new Date().toISOString();

  const { error } = await supabase
    .from("sales")
    .update({
      status: "published",
      published_at: publishedAt,
    })
    .eq("id", saleId)
    .eq("operator_id", user.id);

  if (error) return { ok: false, message: error.message };

  return {
    ok: true,
    data: { regionSlug: row.region_slug, listingSlug: row.listing_slug },
  };
}

export function publishedSaleHref(regionSlug: string, listingSlug: string): string {
  return salePublicPath(regionSlug, listingSlug);
}
