import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

const getSession = vi.fn();
const onAuthStateChange = vi.fn();
const exchangeCodeForSession = vi.fn();
const setSession = vi.fn();
const clearAuthQueryParams = vi.fn();

vi.mock("../../lib/supabaseClient.js", () => ({
  requireSupabase: () => ({
    auth: {
      exchangeCodeForSession,
      getSession,
      onAuthStateChange,
      setSession,
    },
  }),
}));

vi.mock("./authRedirects.js", () => ({
  clearAuthQueryParams,
  getAdminUrl: () => "#/panel-admin",
}));

const AuthCallbackHandler = (await import("./AuthCallbackHandler.jsx")).default;

describe("AuthCallbackHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSession.mockResolvedValue({ data: { session: null } });
    exchangeCodeForSession.mockResolvedValue({ error: null });
    setSession.mockResolvedValue({ error: null });
    onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
    window.history.pushState(null, "", "/?auth=callback");
  });

  it("shows an error when no session is created", async () => {
    render(<AuthCallbackHandler />);

    await waitFor(() => {
      expect(screen.getByText(/Nie udało się zalogować/i)).toBeTruthy();
    });
  });

  it("redirects to the admin route when callback creates a session", async () => {
    getSession.mockResolvedValue({ data: { session: { user: { id: "u1" } } } });

    render(<AuthCallbackHandler />);

    await waitFor(() => {
      expect(clearAuthQueryParams).toHaveBeenCalled();
      expect(window.location.hash).toBe("#/panel-admin");
    });
  });

  it("restores a callback session from hash tokens before redirecting", async () => {
    getSession.mockResolvedValue({ data: { session: { user: { id: "u1" } } } });
    window.history.pushState(
      null,
      "",
      "/?auth=callback#access_token=test-access&refresh_token=test-refresh&type=magiclink",
    );

    render(<AuthCallbackHandler />);

    await waitFor(() => {
      expect(setSession).toHaveBeenCalledWith({
        access_token: "test-access",
        refresh_token: "test-refresh",
      });
      expect(clearAuthQueryParams).toHaveBeenCalled();
      expect(window.location.hash).toBe("#/panel-admin");
    });
  });
});
