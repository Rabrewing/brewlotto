import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/browserClient';
import { playBrewSound } from '@/utils/brewSounds';

export function useBrewSoundEffects() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadPreference = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (mounted) {
            setEnabled(false);
            setLoading(false);
          }
          return;
        }

        const { data } = await supabase
          .from('user_settings')
          .select('sound_effects_enabled')
          .eq('user_id', user.id)
          .maybeSingle();

        if (mounted) {
          setEnabled(Boolean(data?.sound_effects_enabled));
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setEnabled(false);
          setLoading(false);
        }
      }
    };

    loadPreference();

    return () => {
      mounted = false;
    };
  }, []);

  const playSound = useCallback(
    async (cue = 'success') => {
      if (!enabled) {
        return false;
      }

      return playBrewSound(cue);
    },
    [enabled]
  );

  return {
    enabled,
    loading,
    playSound,
  };
}
