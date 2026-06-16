import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { defaultSiteContent } from "../content/defaultSiteContent.js";

const supabaseMocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  signOut: vi.fn(),
}));

const contentApiMocks = vi.hoisted(() => ({
  getCurrentMembership: vi.fn(),
  loadDraftSiteContent: vi.fn(),
  publishContentEntry: vi.fn(),
  saveContentDraft: vi.fn(),
}));

vi.mock("../lib/supabaseClient.js", () => ({
  isSupabaseConfigured: true,
  missingPublicEnvVars: [],
  siteId: "test-site",
  supabase: {
    auth: {
      getSession: supabaseMocks.getSession,
      onAuthStateChange: supabaseMocks.onAuthStateChange,
      signOut: supabaseMocks.signOut,
    },
  },
}));

vi.mock("../lib/contentApi.js", () => ({
  getCurrentMembership: contentApiMocks.getCurrentMembership,
  loadDraftSiteContent: contentApiMocks.loadDraftSiteContent,
  publishContentEntry: contentApiMocks.publishContentEntry,
  saveContentDraft: contentApiMocks.saveContentDraft,
}));

vi.mock("./auth/LoginPanel.jsx", () => ({
  default: () => <div data-testid="login-panel">Logowanie administratora</div>,
}));

vi.mock("./AnalyticsPanel.jsx", () => ({
  default: () => <div data-testid="analytics-panel">Statystyki</div>,
}));

const AdminApp = (await import("./AdminApp.jsx")).default;

describe("AdminApp access gate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    supabaseMocks.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
    contentApiMocks.loadDraftSiteContent.mockResolvedValue({ content: defaultSiteContent });
  });

  it("shows the login panel when there is no active Supabase session", async () => {
    supabaseMocks.getSession.mockResolvedValue({ data: { session: null } });

    render(<AdminApp />);

    expect(await screen.findByTestId("login-panel")).toBeTruthy();
    expect(contentApiMocks.getCurrentMembership).not.toHaveBeenCalled();
    expect(contentApiMocks.loadDraftSiteContent).not.toHaveBeenCalled();
  });

  it("blocks a signed-in user who is not an active site member", async () => {
    supabaseMocks.getSession.mockResolvedValue({
      data: { session: { user: { id: "user-without-membership" } } },
    });
    contentApiMocks.getCurrentMembership.mockResolvedValue(null);

    render(<AdminApp />);

    await waitFor(() => {
      expect(screen.getByText("Brak dostępu")).toBeTruthy();
    });
    expect(contentApiMocks.loadDraftSiteContent).not.toHaveBeenCalled();
  });

  it("loads the CMS only for a signed-in active site member", async () => {
    supabaseMocks.getSession.mockResolvedValue({
      data: { session: { user: { id: "site-owner" } } },
    });
    contentApiMocks.getCurrentMembership.mockResolvedValue({
      site_id: "test-site",
      user_id: "site-owner",
      email: "owner@example.com",
      role: "owner",
      active: true,
    });

    render(<AdminApp />);

    await waitFor(() => {
      expect(screen.getByText("Panel zarządzania treścią")).toBeTruthy();
    });
    expect(contentApiMocks.loadDraftSiteContent).toHaveBeenCalled();
  });
});
