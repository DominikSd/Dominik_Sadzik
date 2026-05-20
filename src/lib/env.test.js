import { beforeEach, describe, expect, it, vi } from "vitest";

async function loadEnv(vars = {}) {
  vi.resetModules();
  vi.unstubAllEnvs();

  const defaults = {
    VITE_SUPABASE_URL: "",
    VITE_SUPABASE_ANON_KEY: "",
    VITE_SITE_ID: "",
    VITE_ADMIN_HASH_PATH: "",
    VITE_GA_MEASUREMENT_ID: "",
    ...vars,
  };

  for (const [key, value] of Object.entries(defaults)) {
    vi.stubEnv(key, value);
  }

  return await import("./env");
}

describe("public env validation", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("lists every required public env var that is missing", async () => {
    const env = await loadEnv();

    expect(env.getMissingPublicEnvVars()).toEqual([
      "VITE_SUPABASE_URL",
      "VITE_SUPABASE_ANON_KEY",
      "VITE_SITE_ID",
      "VITE_ADMIN_HASH_PATH",
    ]);
    expect(env.isPublicEnvConfigured).toBe(false);
  });

  it("treats GA4 measurement ID as optional", async () => {
    const env = await loadEnv({
      VITE_SUPABASE_URL: "https://example.supabase.co",
      VITE_SUPABASE_ANON_KEY: "anon",
      VITE_SITE_ID: "site-id",
      VITE_ADMIN_HASH_PATH: "panel-admin",
    });

    expect(env.getMissingPublicEnvVars()).toEqual([]);
    expect(env.isPublicEnvConfigured).toBe(true);
  });
});
