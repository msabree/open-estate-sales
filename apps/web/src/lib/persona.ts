/**
 * UX mode: browsing estate sales vs managing listings.
 * Stored in Supabase Auth `user.user_metadata.persona` (no extra table required).
 */

export const PERSONA_METADATA_KEY = "oes_persona" as const;

export type Persona = "shopper" | "operator";

export const DEFAULT_PERSONA: Persona = "shopper";

export function parsePersonaFromMetadata(
  metadata: Record<string, unknown> | null | undefined,
): Persona {
  const raw = metadata?.[PERSONA_METADATA_KEY];
  if (raw === "operator" || raw === "shopper") {
    return raw;
  }
  return DEFAULT_PERSONA;
}
