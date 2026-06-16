import { beforeEach, describe, expect, it, vi } from "vitest";

async function loadGa4() {
  vi.resetModules();
  vi.stubEnv("VITE_GA_MEASUREMENT_ID", "G-TEST123");
  window.localStorage.clear();
  window.dataLayer = undefined;
  window.gtag = undefined;
  document.head.innerHTML = "";
  return await import("./ga4");
}

function eventsNamed(name) {
  return (window.dataLayer || []).filter((entry) => entry[0] === "event" && entry[1] === name);
}

describe("GA4 privacy controls", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("does not send events without analytics consent", async () => {
    const ga4 = await loadGa4();

    ga4.trackEvent("cta_click", { cta_label: "Kontakt" });

    expect(eventsNamed("cta_click")).toHaveLength(0);
    expect(document.getElementById("ga4-script")).toBeNull();
  });

  it("initializes GA4 after consent is granted", async () => {
    const ga4 = await loadGa4();

    ga4.setAnalyticsConsent(true);
    ga4.trackEvent("cta_click", { cta_label: "Kontakt" });

    expect(document.getElementById("ga4-script")?.getAttribute("src")).toContain("G-TEST123");
    expect(eventsNamed("cta_click")).toHaveLength(1);
  });

  it("keeps tracking blocked when analytics consent is rejected", async () => {
    const ga4 = await loadGa4();

    ga4.setAnalyticsConsent(false);
    ga4.trackEvent("cta_click", { cta_label: "Kontakt" });

    expect(eventsNamed("cta_click")).toHaveLength(0);
    expect(document.getElementById("ga4-script")).toBeNull();
  });

  it("does not send email address or phone number in contact click events", async () => {
    const ga4 = await loadGa4();

    ga4.setAnalyticsConsent(true);
    ga4.trackContactClick("mailto:test@example.com", "+48123123123");

    const [event] = eventsNamed("contact_click");
    expect(event[2]).toEqual({
      contact_type: "unknown",
      contact_location: "unknown",
    });
    expect(JSON.stringify(event[2])).not.toContain("@");
    expect(JSON.stringify(event[2])).not.toContain("+48");
    expect(JSON.stringify(event[2])).not.toContain("123123123");
  });

  it("removes query params from page_view paths", async () => {
    const ga4 = await loadGa4();

    ga4.setAnalyticsConsent(true);
    ga4.trackPageView("/?email=test@example.com#/panel-admin?token=secret", "Panel");

    const [event] = eventsNamed("page_view");
    expect(event[2].page_path).toBe("/#/panel-admin");
    expect(JSON.stringify(event[2])).not.toContain("test@example.com");
    expect(JSON.stringify(event[2])).not.toContain("secret");
  });

  it("does not send form field data in form submit events", async () => {
    const ga4 = await loadGa4();

    ga4.setAnalyticsConsent(true);
    ga4.trackFormSubmit("contact?email=test@example.com&message=secret");

    const [event] = eventsNamed("form_submit");
    expect(event[2]).toEqual({ form_name: "unknown_form" });
    expect(JSON.stringify(event[2])).not.toContain("test@example.com");
    expect(JSON.stringify(event[2])).not.toContain("secret");
  });

  it("tracks navigation clicks with safe event names and sanitized targets", async () => {
    const ga4 = await loadGa4();

    ga4.setAnalyticsConsent(true);
    ga4.trackNavigationClick("Strony i CMS", "#/strony-cms?token=secret", "desktop");

    const [event] = eventsNamed("nav_click_strony_i_cms");
    expect(event[2]).toEqual({
      nav_label: "strony_i_cms",
      nav_target: "strony-cms",
      nav_location: "desktop",
    });
    expect(JSON.stringify(event[2])).not.toContain("secret");
  });
});
