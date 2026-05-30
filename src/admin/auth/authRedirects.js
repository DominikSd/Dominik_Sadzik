import { adminHashPath } from "../../lib/supabaseClient.js";

function getAppBasePath() {
  const segments = String(import.meta.env.BASE_URL || "/")
    .split("/")
    .filter(Boolean);

  return segments.length ? `/${segments.join("/")}/` : "/";
}

export function getAppBaseUrl() {
  return `${window.location.origin}${getAppBasePath()}`;
}

export function getAuthModeFromSearch(search) {
  const params = new URLSearchParams(search);
  const mode = params.get("auth");
  return mode === "callback" || mode === "recovery" ? mode : null;
}

export function getAuthCallbackUrl() {
  return `${getAppBaseUrl()}?auth=callback`;
}

export function getAuthRecoveryUrl() {
  return `${getAppBaseUrl()}?auth=recovery`;
}

export function getAdminUrl() {
  return `${getAppBaseUrl()}#/${adminHashPath}`;
}

function hasAuthHash(hash) {
  const hashParams = new URLSearchParams(hash.replace(/^#/, ""));
  return (
    hashParams.has("access_token") ||
    hashParams.has("refresh_token") ||
    hashParams.has("expires_at") ||
    hashParams.has("expires_in") ||
    hashParams.has("token_type") ||
    hashParams.has("type")
  );
}

export function clearAuthHashParams() {
  const url = new URL(window.location.href);

  if (hasAuthHash(url.hash)) {
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  }
}

export function clearAuthQueryParams() {
  const url = new URL(window.location.href);

  [
    "auth",
    "code",
    "error",
    "error_code",
    "error_description",
    "error_uri",
    "token_hash",
    "type",
  ].forEach((name) => url.searchParams.delete(name));

  if (hasAuthHash(url.hash)) {
    url.hash = "";
  }

  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}
