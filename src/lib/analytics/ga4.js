const GA_SCRIPT_ID = "ga4-script";
const CONSENT_KEY = "analytics_consent";

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || "";
let initialized = false;

function getStoredConsent() {
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function hasAnalyticsConsent() {
  return getStoredConsent() === "granted";
}

function ensureDataLayer() {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };
}

function setConsentState(state) {
  ensureDataLayer();
  window.gtag("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: state,
  });
}

function injectGaScript() {
  if (document.getElementById(GA_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = GA_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

export function getAnalyticsConfig() {
  return {
    measurementId,
    isConfigured: Boolean(measurementId),
    consent: getStoredConsent(),
  };
}

export function setAnalyticsConsent(granted) {
  const value = granted ? "granted" : "denied";
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // localStorage can be unavailable in privacy modes; tracking still stays disabled.
  }
  setConsentState(value);
  if (granted) initAnalytics();
  window.dispatchEvent(new CustomEvent("analytics-consent-change", { detail: { consent: value } }));
}

export function initAnalytics() {
  if (!measurementId || typeof window === "undefined") return false;

  ensureDataLayer();
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: hasAnalyticsConsent() ? "granted" : "denied",
    wait_for_update: 500,
  });

  if (!hasAnalyticsConsent()) return false;

  injectGaScript();
  if (!initialized) {
    window.gtag("js", new Date());
    window.gtag("config", measurementId, { send_page_view: false });
    initialized = true;
  }

  return true;
}

export function trackPageView(path, title = document.title) {
  if (!initAnalytics()) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title,
  });
}

export function trackEvent(name, params = {}) {
  if (!initAnalytics()) return;
  window.gtag("event", name, params);
}

export function trackCtaClick(label, location) {
  trackEvent("cta_click", {
    cta_label: label,
    cta_location: location,
  });
}

export function trackContactClick(type) {
  trackEvent("contact_click", {
    contact_type: type,
  });
}

export function trackFormSubmit(formName) {
  trackEvent("form_submit", {
    form_name: formName,
  });
}
