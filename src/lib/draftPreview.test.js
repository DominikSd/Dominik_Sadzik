import { afterEach, describe, expect, it, vi } from "vitest";
import { defaultSiteContent } from "../content/defaultSiteContent";
import {
  DRAFT_PREVIEW_STORAGE_KEY,
  isDraftPreviewRequest,
  loadDraftPreviewContent,
  saveDraftPreviewContent,
} from "./draftPreview";

function createStorage() {
  const data = new Map();

  return {
    getItem: (key) => data.get(key) || null,
    setItem: (key, value) => data.set(key, value),
  };
}

describe("draft preview helpers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("detects draft preview search params", () => {
    expect(isDraftPreviewRequest("?preview=draft")).toBe(true);
    expect(isDraftPreviewRequest("?preview=published")).toBe(false);
    expect(isDraftPreviewRequest("")).toBe(false);
  });

  it("saves and loads normalized draft preview content", () => {
    const storage = createStorage();
    const content = {
      ...defaultSiteContent,
      hero: {
        ...defaultSiteContent.hero,
        title: "Draft preview",
      },
    };

    saveDraftPreviewContent(content, storage);

    expect(storage.getItem(DRAFT_PREVIEW_STORAGE_KEY)).toContain("Draft preview");
    expect(loadDraftPreviewContent(storage).content.hero.title).toBe("Draft preview");
  });

  it("returns null for invalid preview payloads", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const storage = createStorage();
    storage.setItem(DRAFT_PREVIEW_STORAGE_KEY, "{invalid");

    expect(loadDraftPreviewContent(storage)).toBeNull();
  });
});
