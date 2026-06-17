import { beforeEach, describe, expect, it, vi } from "vitest";
import { submitWebsiteBrief } from "./briefApi";

const mocks = vi.hoisted(() => ({
  invoke: vi.fn(),
}));

vi.mock("./supabaseClient", () => ({
  siteId: "site-123",
  requireSupabase: () => ({
    functions: {
      invoke: mocks.invoke,
    },
  }),
}));

describe("submitWebsiteBrief", () => {
  beforeEach(() => {
    mocks.invoke.mockReset();
    mocks.invoke.mockResolvedValue({
      data: { ok: true, leadId: "lead-123", emailSent: true },
      error: null,
    });
  });

  it("sends a normalized website brief to the Edge Function", async () => {
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

    expect(mocks.invoke).toHaveBeenCalledWith("website-brief-submit", {
      body: {
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
      },
    });
  });

  it("throws Edge Function invoke errors", async () => {
    mocks.invoke.mockResolvedValue({ data: null, error: new Error("edge_failed") });

    await expect(submitWebsiteBrief({ name: "Dominik" })).rejects.toThrow("edge_failed");
  });

  it("throws safe errors returned by the function body", async () => {
    mocks.invoke.mockResolvedValue({
      data: { error: { code: "invalid_payload", message: "Niepoprawne dane formularza." } },
      error: null,
    });

    await expect(submitWebsiteBrief({ name: "Dominik" })).rejects.toThrow(
      "Niepoprawne dane formularza.",
    );
  });
});
