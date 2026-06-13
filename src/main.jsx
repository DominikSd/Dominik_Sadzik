import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import AdminApp from "./admin/AdminApp.jsx";
import AnalyticsConsent from "./components/AnalyticsConsent.jsx";
import LandingPage from "./LandingPage.jsx";
import AuthCallbackHandler from "./admin/auth/AuthCallbackHandler.jsx";
import UpdatePasswordForm from "./admin/auth/UpdatePasswordForm.jsx";
import { getSafeAnalyticsPath, initAnalytics, trackPageView } from "./lib/analytics/ga4.js";
import { adminHashPath, supabase } from "./lib/supabaseClient.js";
import { extractAuthHash, normalizeHash, pathToHash } from "./lib/routeUtils.js";
import { applyNoindexSeo } from "./lib/seo.js";
import { getAuthModeFromSearch } from "./admin/auth/authRedirects.js";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// AppRouter and hash routing are intentionally simple because GitHub Pages uses hash-based navigation.

function getBasePath() {
  const segments = String(import.meta.env.BASE_URL || "/")
    .split("/")
    .filter(Boolean);

  return segments.length ? `/${segments.join("/")}/` : "/";
}

function getRouteState() {
  return {
    authMode: getAuthModeFromSearch(window.location.search),
    hash: normalizeHash(window.location.hash),
  };
}

export function AppRouter() {
  const [{ authMode, hash }, setRouteState] = React.useState(getRouteState);

  useEffect(() => {
    function syncRouteState() {
      setRouteState(getRouteState());
    }

    window.addEventListener("hashchange", syncRouteState);
    window.addEventListener("popstate", syncRouteState);

    return () => {
      window.removeEventListener("hashchange", syncRouteState);
      window.removeEventListener("popstate", syncRouteState);
    };
  }, []);

  useEffect(() => {
    if (authMode) return;

    const rawHash = window.location.hash;
    const pathnameHash = pathToHash(window.location.pathname, import.meta.env.BASE_URL || "/");
    const authHash = extractAuthHash(rawHash);
    const isAuthRedirect = authHash !== rawHash;

    if (isAuthRedirect) {
      const search = window.location.search || "";
      window.history.replaceState(null, "", `${window.location.pathname}${search}${authHash}`);
      setRouteState((current) => ({ ...current, hash: authHash }));
      return;
    }

    if (pathnameHash === `#/${adminHashPath}` && normalizeHash(rawHash) !== pathnameHash) {
      window.history.replaceState(
        null,
        "",
        `${getBasePath()}${window.location.search}${pathnameHash}`,
      );
      setRouteState((current) => ({ ...current, hash: pathnameHash }));
      return;
    }

    const normalizedHash = normalizeHash(rawHash);
    if (normalizedHash !== rawHash) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}${normalizedHash}`,
      );
    }

    setRouteState((current) => ({ ...current, hash: normalizedHash }));
  }, [authMode]);

  useEffect(() => {
    if (authMode) return undefined;

    const authHash =
      hash.startsWith("#access_token=") ||
      hash.startsWith("#refresh_token=") ||
      hash.includes("type=recovery") ||
      hash.includes("type=magiclink");
    if (!authHash || !supabase) return undefined;

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        window.location.hash = `#/${adminHashPath}`;
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, [authMode, hash]);

  useEffect(() => {
    if (authMode === "callback") {
      applyNoindexSeo("Logowanie do panelu CMS - Dominik Sadzik");
      return;
    }
    if (authMode === "recovery") {
      applyNoindexSeo("Reset hasła panelu CMS - Dominik Sadzik");
      return;
    }
    if (hash === `#/${adminHashPath}`) {
      applyNoindexSeo("Panel CMS - Dominik Sadzik");
    }
  }, [authMode, hash]);

  useEffect(() => {
    initAnalytics();
    trackPageView(getSafeAnalyticsPath(), document.title);
  }, [hash]);

  const app =
    authMode === "callback" ? (
      <AuthCallbackHandler />
    ) : authMode === "recovery" ? (
      <UpdatePasswordForm />
    ) : hash === `#/${adminHashPath}` ? (
      <AdminApp />
    ) : (
      <LandingPage routeHash={hash} />
    );

  return (
    <>
      {app}
      <AnalyticsConsent />
    </>
  );
}

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary
        title="Wystąpił błąd aplikacji"
        description="Przepraszamy, coś poszło nie tak. Odśwież stronę lub sprawdź konsolę."
      >
        <AppRouter />
      </ErrorBoundary>
    </React.StrictMode>,
  );
}
