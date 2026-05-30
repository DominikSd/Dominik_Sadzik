import React from "react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

const supabaseMocks = vi.hoisted(() => ({
  onAuthStateChange: vi.fn(() => ({
    data: {
      subscription: {
        unsubscribe: vi.fn(),
      },
    },
  })),
}));

vi.mock("./admin/AdminApp.jsx", () => ({
  default: () => <div data-testid="admin-route">admin</div>,
}));

vi.mock("./admin/auth/AuthCallbackHandler.jsx", () => ({
  default: () => <div data-testid="callback-route">callback</div>,
}));

vi.mock("./admin/auth/UpdatePasswordForm.jsx", () => ({
  default: () => <div data-testid="recovery-route">recovery</div>,
}));

vi.mock("./components/AnalyticsConsent.jsx", () => ({
  default: () => null,
}));

vi.mock("./LandingPage.jsx", () => ({
  default: () => <div data-testid="landing-route">landing</div>,
}));

vi.mock("./lib/analytics/ga4.js", () => ({
  getSafeAnalyticsPath: () => "/safe-path",
  initAnalytics: vi.fn(),
  trackPageView: vi.fn(),
}));

vi.mock("./lib/supabaseClient.js", () => ({
  adminHashPath: "panel-admin",
  supabase: {
    auth: {
      onAuthStateChange: supabaseMocks.onAuthStateChange,
    },
  },
}));

const { AppRouter } = await import("./main.jsx");

describe("AppRouter", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    window.history.pushState(null, "", "/Dominik_Sadzik/");
  });

  it("does not import the removed PasswordRecoveryForm component", () => {
    const mainSource = readFileSync(join(process.cwd(), "src/main.jsx"), "utf8");

    expect(mainSource).not.toContain("PasswordRecoveryForm");
    expect(mainSource).toContain("./admin/auth/UpdatePasswordForm.jsx");
  });

  it("renders the auth callback screen from ?auth=callback without falling through", () => {
    window.history.pushState(
      null,
      "",
      "/Dominik_Sadzik/?auth=callback#access_token=token&type=magiclink",
    );

    render(<AppRouter />);

    expect(screen.getByTestId("callback-route")).toBeTruthy();
    expect(screen.queryByTestId("landing-route")).toBeNull();
  });

  it("renders the password recovery screen from ?auth=recovery without falling through", () => {
    window.history.pushState(
      null,
      "",
      "/Dominik_Sadzik/?auth=recovery#access_token=token&type=recovery",
    );

    render(<AppRouter />);

    expect(screen.getByTestId("recovery-route")).toBeTruthy();
    expect(screen.queryByTestId("landing-route")).toBeNull();
  });

  it("renders the admin route from the hash route", () => {
    window.history.pushState(null, "", "/Dominik_Sadzik/#/panel-admin");

    render(<AppRouter />);

    expect(screen.getByTestId("admin-route")).toBeTruthy();
  });
});
