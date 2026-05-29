import { describe, expect, it } from "vitest";
import { extractAuthHash, normalizeHash, pathToHash } from "./routeUtils.js";

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

  it("extracts auth hash fragments for access and refresh tokens", () => {
    expect(extractAuthHash("#panel-admin#access_token=token&refresh_token=refresh")).toBe(
      "#access_token=token&refresh_token=refresh",
    );
    expect(extractAuthHash("#access_token=token&expires_in=3600")).toBe(
      "#access_token=token&expires_in=3600",
    );
    expect(extractAuthHash("#refresh_token=refresh&access_token=token")).toBe(
      "#access_token=token",
    );
    expect(extractAuthHash("#/panel-admin")).toBe("#/panel-admin");
  });
});
