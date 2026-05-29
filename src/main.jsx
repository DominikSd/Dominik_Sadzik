import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import AdminApp from "./admin/AdminApp.jsx";
import AnalyticsConsent from "./components/AnalyticsConsent.jsx";
import LandingPage from "./LandingPage.jsx";
import { getSafeAnalyticsPath, initAnalytics, trackPageView } from "./lib/analytics/ga4.js";
import { adminHashPath } from "./lib/supabaseClient.js";
import { normalizeHash, pathToHash } from "./lib/routeUtils.js";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// AppRouter and hash routing are intentionally simple because GitHub Pages uses hash-based navigation.

function AppRouter() {
  const [hash, setHash] = React.useState(normalizeHash(window.location.hash));

  useEffect(() => {
    const normalizedHash = normalizeHash(window.location.hash);
    const pathnameHash = pathToHash(window.location.pathname, import.meta.env.BASE_URL || "/");

    if (pathnameHash === `#/${adminHashPath}` && normalizedHash !== pathnameHash) {
      window.history.replaceState(null, "", pathnameHash + window.location.search);
      setHash(pathnameHash);
      return;
    }

    if (normalizedHash !== window.location.hash) {
      window.history.replaceState(null, "", normalizedHash + window.location.search);
    }

    setHash(normalizedHash);
  }, []);

  useEffect(() => {
    const onHashChange = () => setHash(normalizeHash(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    initAnalytics();
    trackPageView(getSafeAnalyticsPath(), document.title);
  }, [hash]);

  const app = hash === `#/${adminHashPath}` ? <AdminApp /> : <LandingPage />;

  return (
    <>
      {app}
      <AnalyticsConsent />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary
      title="Wystąpił błąd aplikacji"
      description="Przepraszamy, coś poszło nie tak. Odśwież stronę lub sprawdź konsolę."
    >
      <AppRouter />
    </ErrorBoundary>
  </React.StrictMode>,
);
