import { beforeEach, describe, expect, it, vi } from "vitest";
import { submitWebsiteBrief } from "./briefApi";

const mocks = vi.hoisted(() => ({
  insert: vi.fn(),
}));

vi.mock("./supabaseClient", () => ({
  siteId: "site-123",
  requireSupabase: () => ({
    from: vi.fn((table) => {
      expect(table).toBe("website_briefs");
      return { insert: mocks.insert };
    }),
  }),
}));

describe("submitWebsiteBrief", () => {
  beforeEach(() => {
    mocks.insert.mockReset();
    mocks.insert.mockResolvedValue({ error: null });
  });

  it("stores a normalized website brief in Supabase", async () => {
    await submitWebsiteBrief({
      name: "  Dominik  ",
      email: " test@example.com ",
      phone: "",
      preferredContact: "email",
      currentWebsite: "",
      projectTypes: ["strona z CMS"],
      websiteGoals: ["pokazanie oferty"],
      cmsNeeds: "tak",
      materials: { logo: "tak" },
      stylePreferences: ["nowoczesna"],
      inspirationLinks: "",
      addons: ["SEO"],
      deadline: "w ciągu miesiąca",
      budget: "",
      projectDescription: "Opis projektu",
      consentContact: true,
    });

    expect(mocks.insert).toHaveBeenCalledWith({
      site_id: "site-123",
      name: "Dominik",
      email: "test@example.com",
      phone: null,
      preferred_contact: "email",
      current_website: null,
      project_type: ["strona z CMS"],
      website_goals: ["pokazanie oferty"],
      cms_needs: "tak",
      materials: { logo: "tak" },
      style_preferences: ["nowoczesna"],
      inspiration_links: null,
      addons: ["SEO"],
      deadline: "w ciągu miesiąca",
      budget: null,
      project_description: "Opis projektu",
      consent_contact: true,
      source: "brief_form",
    });
  });

  it("throws Supabase errors", async () => {
    mocks.insert.mockResolvedValue({ error: new Error("rls_denied") });

    await expect(submitWebsiteBrief({ name: "Dominik" })).rejects.toThrow("rls_denied");
  });
});
