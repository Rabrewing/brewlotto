const { createClient } = require("@supabase/supabase-js");

function createCompatClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables for compat server client");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

const supabase = createCompatClient();

function createSupabaseServerClient() {
  return supabase;
}

function createSupabaseServerClientSimple() {
  return supabase;
}

function createSupabaseServerClientLegacy() {
  return supabase;
}

module.exports = {
  supabase,
  createSupabaseServerClient,
  createSupabaseServerClientSimple,
  createSupabaseServerClientLegacy,
};
