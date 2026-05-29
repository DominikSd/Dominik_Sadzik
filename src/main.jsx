import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import AdminApp from "./admin/AdminApp.jsx";
import AnalyticsConsent from "./components/AnalyticsConsent.jsx";
import LandingPage from "./LandingPage.jsx";
import PasswordRecoveryForm from "./admin/PasswordRecoveryForm.jsx";
import { getSafeAnalyticsPath, initAnalytics, trackPageView } from "./lib/analytics/ga4.js";
import { adminHashPath, supabase } from "./lib/supabaseClient.js";
import { extractAuthHash, normalizeHash, pathToHash } from "./lib/routeUtils.js";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// AppRouter and hash routing are intentionally simple because GitHub Pages uses hash-based navigation.

function AppRouter() {
  const [hash, setHash] = React.useState(normalizeHash(window.location.hash));

  useEffect(() => {
    const rawHash = window.location.hash;
    const pathnameHash = pathToHash(window.location.pathname, import.meta.env.BASE_URL || "/");
    const authHash = extractAuthHash(rawHash);
    const isAuthRedirect = authHash !== rawHash;

    if (isAuthRedirect) {
      window.history.replaceState(null, "", authHash);
      setHash(authHash);
      return;
    }

    if (pathnameHash === `#/${adminHashPath}` && normalizeHash(rawHash) !== pathnameHash) {
      window.history.replaceState(null, "", pathnameHash + window.location.search);
      setHash(pathnameHash);
      return;
    }

    const normalizedHash = normalizeHash(rawHash);
    if (normalizedHash !== rawHash) {
      window.history.replaceState(null, "", normalizedHash + window.location.search);
    }

    setHash(normalizedHash);
  }, []);

  useEffect(() => {
    const authHash =
      hash.startsWith("#access_token=") ||
      hash.startsWith("#refresh_token=") ||
      hash.includes("type=recovery") ||
      hash.includes("type=magiclink");
    if (!authHash) return;

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        window.location.hash = `#/${adminHashPath}`;
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, [hash]);

  useEffect(() => {
    initAnalytics();
    trackPageView(getSafeAnalyticsPath(), document.title);
  }, [hash]);

  const isRecoveryHash = hash.includes("type=recovery");
  const app = isRecoveryHash ? (
    <PasswordRecoveryForm />
  ) : hash === `#/${adminHashPath}` ? (
    <AdminApp />
  ) : (
    <LandingPage />
  );

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
