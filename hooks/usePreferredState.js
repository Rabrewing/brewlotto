'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/browserClient';

export const PREFERRED_STATE_STORAGE_KEY = 'brewlotto:preferred-state';
export const PREFERRED_STATE_CHANGE_EVENT = 'brewlotto:preferred-state-changed';

export function normalizePreferredStateCode(value) {
  return String(value || '').toUpperCase() === 'CA' ? 'CA' : 'NC';
}

export function getStoredPreferredStateCode() {
  if (typeof window === 'undefined') {
    return 'NC';
  }

  return normalizePreferredStateCode(window.localStorage.getItem(PREFERRED_STATE_STORAGE_KEY));
}

export function setStoredPreferredStateCode(nextState) {
  if (typeof window === 'undefined') {
    return;
  }

  const normalized = normalizePreferredStateCode(nextState);
  window.localStorage.setItem(PREFERRED_STATE_STORAGE_KEY, normalized);
  window.dispatchEvent(new CustomEvent(PREFERRED_STATE_CHANGE_EVENT, { detail: { state: normalized } }));
}

export async function loadPreferredStateForUser(userId) {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('default_state_code')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return normalizePreferredStateCode(data?.default_state_code);
}

export async function savePreferredStateForUser(userId, nextState) {
  const normalized = normalizePreferredStateCode(nextState);

  const { error } = await supabase.from('user_preferences').upsert(
    {
      user_id: userId,
      default_state_code: normalized,
    },
    { onConflict: 'user_id' },
  );

  if (error) {
    throw error;
  }

  setStoredPreferredStateCode(normalized);

  return normalized;
}

export function usePreferredState() {
  const [preferredState, setPreferredState] = useState(() => getStoredPreferredStateCode());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadPreferredState() {
      setLoading(true);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (cancelled) {
          return;
        }

        if (user) {
          const nextState = await loadPreferredStateForUser(user.id);
          if (!cancelled) {
            setPreferredState(nextState);
            setStoredPreferredStateCode(nextState);
          }
          return;
        }

        setPreferredState(getStoredPreferredStateCode());
      } catch {
        if (!cancelled) {
          setPreferredState(getStoredPreferredStateCode());
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPreferredState();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function syncFromStorage() {
      setPreferredState(getStoredPreferredStateCode());
    }

    function syncFromCustomEvent(event) {
      const nextState = event?.detail?.state;
      if (nextState === 'NC' || nextState === 'CA') {
        setPreferredState(nextState);
      }
    }

    window.addEventListener('storage', syncFromStorage);
    window.addEventListener(PREFERRED_STATE_CHANGE_EVENT, syncFromCustomEvent);

    return () => {
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener(PREFERRED_STATE_CHANGE_EVENT, syncFromCustomEvent);
    };
  }, []);

  return {
    preferredState,
    loading,
    setPreferredState,
  };
}
