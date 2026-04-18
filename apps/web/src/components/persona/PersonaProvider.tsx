"use client";

import {
  DEFAULT_PERSONA,
  type Persona,
  parsePersonaFromMetadata,
  PERSONA_METADATA_KEY,
} from "@/lib/persona";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type PersonaContextValue = {
  user: User | null;
  /** Resolved persona; defaults to shopper when signed out or unset. */
  persona: Persona;
  loading: boolean;
  setPersona: (next: Persona) => Promise<{ ok: true } | { ok: false; message: string }>;
};

const PersonaContext = createContext<PersonaContextValue | null>(null);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [persona, setPersonaState] = useState<Persona>(DEFAULT_PERSONA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      const id = requestAnimationFrame(() => setLoading(false));
      return () => cancelAnimationFrame(id);
    }

    let cancelled = false;

    void supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (cancelled) return;
      setUser(u ?? null);
      setPersonaState(parsePersonaFromMetadata(u?.user_metadata));
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      setPersonaState(parsePersonaFromMetadata(u?.user_metadata));
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const setPersona = useCallback(
    async (next: Persona): Promise<
      { ok: true } | { ok: false; message: string }
    > => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        return { ok: false, message: "Not configured." };
      }
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      if (!u) {
        return { ok: false, message: "Sign in to switch experience." };
      }

      const { error } = await supabase.auth.updateUser({
        data: { [PERSONA_METADATA_KEY]: next },
      });

      if (error) {
        return { ok: false, message: error.message };
      }

      setPersonaState(next);
      return { ok: true };
    },
    [],
  );

  const value = useMemo(
    () => ({
      user,
      persona: user ? persona : DEFAULT_PERSONA,
      loading,
      setPersona,
    }),
    [user, persona, loading, setPersona],
  );

  return (
    <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>
  );
}

export function usePersona(): PersonaContextValue {
  const ctx = useContext(PersonaContext);
  if (!ctx) {
    throw new Error("usePersona must be used within PersonaProvider");
  }
  return ctx;
}
