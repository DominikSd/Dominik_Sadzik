import { adminHashPath } from "../../lib/supabaseClient.js";

const basePath = String(import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
const appBaseUrl = `${window.location.origin}${basePath}`;

export function getAuthModeFromSearch(search) {
  const params = new URLSearchParams(search);
  const mode = params.get("auth");
  return mode === "callback" || mode === "recovery" ? mode : null;
}

export function getAuthCallbackUrl() {
  return `${appBaseUrl}?auth=callback`;
}

export function getAuthRecoveryUrl() {
  return `${appBaseUrl}?auth=recovery`;
}

export function getAdminUrl() {
  return `${appBaseUrl}/#/${adminHashPath}`;
}

export function clearAuthQueryParams() {
  const hash = window.location.hash || "";
  window.history.replaceState(null, "", `${appBaseUrl}${hash}`);
}
