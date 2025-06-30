// File: auth/authListener.js
// Timestamp: 2025-06-24 19:50 EDT
// Description: Seeds user_profiles with full_name, avatar, email, and tracks last login timestamp

import { supabase } from '@/utils/supabase';

supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN') {
        try {
            const { user } = session;

            const { error } = await supabase
                .from('user_profiles')
                .upsert({
                    id: user.id,
                    display_name: user.user_metadata?.full_name || user.email,
                    avatar_url: user.user_metadata?.avatar_url || '',
                    email: user.email,
                    last_login: new Date().toISOString()
                });

            if (error) console.error('Profile seed error:', error);
        } catch (err) {
            console.error('AuthListener failed:', err.message);
        }
    }
});