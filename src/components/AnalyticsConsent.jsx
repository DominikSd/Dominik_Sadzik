import React, { useEffect, useState } from "react";
import {
  getAnalyticsConfig,
  getSafeAnalyticsPath,
  initAnalytics,
  setAnalyticsConsent,
  trackPageView,
} from "../lib/analytics/ga4";

export default function AnalyticsConsent() {
  const [consent, setConsent] = useState(() => getAnalyticsConfig().consent);
  const { isConfigured } = getAnalyticsConfig();

  useEffect(() => {
    const onConsentChange = (event) =>
      setConsent(event.detail?.consent || getAnalyticsConfig().consent);
    window.addEventListener("analytics-consent-change", onConsentChange);
    return () => window.removeEventListener("analytics-consent-change", onConsentChange);
  }, []);

  if (!isConfigured || consent) return null;

  const accept = () => {
    setAnalyticsConsent(true);
    initAnalytics();
    trackPageView(getSafeAnalyticsPath(), document.title);
  };

  const reject = () => {
    setAnalyticsConsent(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-3xl rounded-lg border border-white/10 bg-slate-950/95 p-4 text-white shadow-2xl shadow-blue-500/20 backdrop-blur md:left-auto md:right-6 md:max-w-md">
      <p className="text-sm font-bold">Analityka strony</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        Uzywamy Google Analytics 4, zeby sprawdzac ogolne statystyki odwiedzin i klikniec. Mozesz
        zaakceptowac albo odrzucic analityke.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={accept}
          className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-black text-slate-950 hover:bg-cyan-300"
        >
          Akceptuje
        </button>
        <button
          type="button"
          onClick={reject}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10"
        >
          Odrzucam
        </button>
      </div>
    </div>
  );
}
