export const REQUIRED_PUBLIC_ENV_VARS = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_ANON_KEY",
  "VITE_SITE_ID",
  "VITE_ADMIN_HASH_PATH",
];

export const OPTIONAL_PUBLIC_ENV_VARS = ["VITE_GA_MEASUREMENT_ID"];

export const publicEnv = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || "",
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  VITE_SITE_ID: import.meta.env.VITE_SITE_ID || "",
  VITE_ADMIN_HASH_PATH: import.meta.env.VITE_ADMIN_HASH_PATH || "",
  VITE_GA_MEASUREMENT_ID: import.meta.env.VITE_GA_MEASUREMENT_ID || "",
};

function hasValue(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function getMissingPublicEnvVars(env = publicEnv) {
  return REQUIRED_PUBLIC_ENV_VARS.filter((name) => !hasValue(env[name]));
}

export const missingPublicEnvVars = getMissingPublicEnvVars();

export const isPublicEnvConfigured = missingPublicEnvVars.length === 0;

export function getCmsConfigurationHelpText() {
  return [
    "CMS nie jest skonfigurowany. Utwórz lokalny plik `.env` na podstawie `.env.example` i uzupełnij wymagane zmienne.",
    "Plik `.env.example` jest tylko wzorem i nie powinien zawierać prawdziwych wartości.",
    "Po zmianie `.env` uruchom ponownie `npm run dev`.",
    "Na produkcji ustaw te wartości w GitHub Actions Variables.",
  ].join(" ");
}
