import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const siteId = import.meta.env.VITE_SITE_ID || "";
export const adminHashPath = import.meta.env.VITE_ADMIN_HASH_PATH || "panel-admin";
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && siteId);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function requireSupabase() {
  if (!supabase || !siteId) {
    throw new Error("Supabase CMS is not configured. Check VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY and VITE_SITE_ID.");
  }
  return supabase;
}
