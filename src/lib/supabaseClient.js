import { createClient } from "@supabase/supabase-js";
import { isPublicEnvConfigured, missingPublicEnvVars, publicEnv } from "./env";

const supabaseUrl = publicEnv.VITE_SUPABASE_URL;
const supabaseAnonKey = publicEnv.VITE_SUPABASE_ANON_KEY;

export const siteId = publicEnv.VITE_SITE_ID;
export const adminHashPath = publicEnv.VITE_ADMIN_HASH_PATH || "panel-admin";
export const isSupabaseConfigured = isPublicEnvConfigured;
export { missingPublicEnvVars };

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
    throw new Error(
      `Supabase CMS is not configured. Missing public env: ${missingPublicEnvVars.join(", ")}`,
    );
  }
  return supabase;
}
