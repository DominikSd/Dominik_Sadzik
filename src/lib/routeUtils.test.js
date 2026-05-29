import { describe, expect, it } from "vitest";
import { normalizeHash, pathToHash } from "./routeUtils.js";

describe("routeUtils", () => {
  it("normalizes empty and slash hashes to root", () => {
    expect(normalizeHash("")).toBe("#/");
    expect(normalizeHash("#")).toBe("#/");
    expect(normalizeHash("#/\/")).toBe("#/");
  });

  it("normalizes admin hashes consistently", () => {
    expect(normalizeHash("#/panel-admin")).toBe("#/panel-admin");
    expect(normalizeHash("#/panel-admin/")).toBe("#/panel-admin");
    expect(normalizeHash("#panel-admin")).toBe("#/panel-admin");
  });

  it("converts plain pathname to hash route", () => {
    expect(pathToHash("/panel-admin", "/")).toBe("#/panel-admin");
    expect(pathToHash("/Dominik_Sadzik/panel-admin", "/Dominik_Sadzik/")).toBe("#/panel-admin");
    expect(pathToHash("/", "/Dominik_Sadzik/")).toBe("#/");
  });
});
