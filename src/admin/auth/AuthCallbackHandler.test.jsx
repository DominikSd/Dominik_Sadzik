import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

const getSession = vi.fn();
const onAuthStateChange = vi.fn();

vi.mock("../../lib/supabaseClient.js", () => ({
  supabase: {
    auth: {
      getSession,
      onAuthStateChange,
    },
  },
}));

vi.mock("./authRedirects.js", () => ({
  clearAuthQueryParams: vi.fn(),
  getAdminUrl: () => "http://localhost:5173/#/panel-admin",
}));

const AuthCallbackHandler = (await import("./AuthCallbackHandler.jsx")).default;

describe("AuthCallbackHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSession.mockResolvedValue({ data: { session: null } });
    onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
  });

  it("shows an error when no session is created", async () => {
    render(<AuthCallbackHandler />);

    await waitFor(() => {
      expect(screen.getByText(/Nie udało się zalogować/i)).toBeTruthy();
    });
  });
});
