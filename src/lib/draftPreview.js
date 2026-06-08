import { normalizeSiteContent } from "../content/siteContentSchema";

export const DRAFT_PREVIEW_STORAGE_KEY = "dominik_sadzik_cms_draft_preview_v1";

function getDefaultStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage || null;
}

export function isDraftPreviewRequest(search = "") {
  return new URLSearchParams(String(search || "")).get("preview") === "draft";
}

export function saveDraftPreviewContent(content, storage = getDefaultStorage()) {
  if (!storage) throw new Error("Brak dostępu do localStorage dla podglądu draftu.");

  const payload = {
    savedAt: new Date().toISOString(),
    content: normalizeSiteContent(content),
  };

  storage.setItem(DRAFT_PREVIEW_STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

export function loadDraftPreviewContent(storage = getDefaultStorage()) {
  if (!storage) return null;

  try {
    const rawValue = storage.getItem(DRAFT_PREVIEW_STORAGE_KEY);
    if (!rawValue) return null;

    const payload = JSON.parse(rawValue);
    if (!payload?.content) return null;

    return {
      savedAt: payload.savedAt || "",
      content: normalizeSiteContent(payload.content),
    };
  } catch (error) {
    console.warn("Draft preview content is invalid.", error);
    return null;
  }
}
