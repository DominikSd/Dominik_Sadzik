import { describe, expect, it } from "vitest";
import {
  clearAuthHashParams,
  clearAuthQueryParams,
  getAdminUrl,
  getAuthCallbackUrl,
  getAuthModeFromSearch,
  getAuthRecoveryUrl,
} from "./authRedirects.js";

describe("authRedirects", () => {
  it("reads callback and recovery modes from query params", () => {
    expect(getAuthModeFromSearch("?auth=callback")).toBe("callback");
    expect(getAuthModeFromSearch("?auth=recovery")).toBe("recovery");
    expect(getAuthModeFromSearch("?auth=other")).toBeNull();
    expect(getAuthModeFromSearch("")).toBeNull();
  });

  it("builds auth URLs on the configured Vite base path", () => {
    expect(getAuthCallbackUrl()).toBe(`${window.location.origin}/Dominik_Sadzik/?auth=callback`);
    expect(getAuthRecoveryUrl()).toBe(`${window.location.origin}/Dominik_Sadzik/?auth=recovery`);
    expect(getAdminUrl()).toBe(`${window.location.origin}/Dominik_Sadzik/#/panel-admin`);
  });

  it("clears auth query params without removing the hash route", () => {
    window.history.pushState(
      null,
      "",
      "/Dominik_Sadzik/?auth=callback&code=abc&utm_source=test#/panel-admin",
    );

    clearAuthQueryParams();

    expect(window.location.pathname).toBe("/Dominik_Sadzik/");
    expect(window.location.search).toBe("?utm_source=test");
    expect(window.location.hash).toBe("#/panel-admin");
  });

  it("clears auth hash tokens while preserving the auth recovery query", () => {
    window.history.pushState(
      null,
      "",
      "/Dominik_Sadzik/?auth=recovery#access_token=test-access&refresh_token=test-refresh&type=recovery",
    );

    clearAuthHashParams();

    expect(window.location.pathname).toBe("/Dominik_Sadzik/");
    expect(window.location.search).toBe("?auth=recovery");
    expect(window.location.hash).toBe("");
  });

  it("clears auth query params and auth hash tokens after recovery completes", () => {
    window.history.pushState(
      null,
      "",
      "/Dominik_Sadzik/?auth=recovery#access_token=test-access&refresh_token=test-refresh&type=recovery",
    );

    clearAuthQueryParams();

    expect(window.location.pathname).toBe("/Dominik_Sadzik/");
    expect(window.location.search).toBe("");
    expect(window.location.hash).toBe("");
  });
});
