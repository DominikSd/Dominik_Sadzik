import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

const updateUser = vi.fn();
const getSession = vi.fn();
const exchangeCodeForSession = vi.fn();
const onAuthStateChange = vi.fn();
const setSession = vi.fn();
const clearAuthHashParams = vi.fn(() => {
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
});
const clearAuthQueryParams = vi.fn(() => {
  window.history.replaceState(null, "", "/Dominik_Sadzik/");
});

vi.mock("../../lib/supabaseClient.js", () => ({
  requireSupabase: () => ({
    auth: {
      exchangeCodeForSession,
      getSession,
      onAuthStateChange,
      setSession,
      updateUser,
    },
  }),
}));

vi.mock("./authRedirects.js", () => ({
  clearAuthHashParams,
  clearAuthQueryParams,
  getAdminUrl: () => "#/panel-admin",
}));

const UpdatePasswordForm = (await import("./UpdatePasswordForm.jsx")).default;

describe("UpdatePasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSession.mockResolvedValue({ data: { session: { user: { id: "u1" } } } });
    exchangeCodeForSession.mockResolvedValue({ error: null });
    onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
    setSession.mockResolvedValue({ error: null });
    updateUser.mockResolvedValue({ error: null });
    window.history.pushState(null, "", "/Dominik_Sadzik/?auth=recovery");
  });

  it("uses updateUser to save a new password", async () => {
    render(<UpdatePasswordForm />);

    const submitButton = await screen.findByRole("button", {
      name: /Zapisz nowe hasło/i,
    });

    await waitFor(() => {
      expect(submitButton.disabled).toBe(false);
    });

    fireEvent.change(screen.getByLabelText(/Nowe hasło/), {
      target: { value: "newpassword" },
    });
    fireEvent.change(screen.getByLabelText(/Powtórz nowe hasło/), {
      target: { value: "newpassword" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith({ password: "newpassword" });
    });
  });

  it("restores the recovery session from hash tokens without leaving tokens in the URL", async () => {
    getSession.mockResolvedValue({ data: { session: { user: { id: "u1" } } } });
    window.history.pushState(
      null,
      "",
      "/Dominik_Sadzik/?auth=recovery#access_token=test-access&refresh_token=test-refresh&type=recovery",
    );

    render(<UpdatePasswordForm />);

    await waitFor(() => {
      expect(setSession).toHaveBeenCalledWith({
        access_token: "test-access",
        refresh_token: "test-refresh",
      });
      expect(clearAuthHashParams).toHaveBeenCalled();
      expect(window.location.search).toBe("?auth=recovery");
      expect(window.location.hash).toBe("");
    });
  });

  it("enables password update after PASSWORD_RECOVERY auth event", async () => {
    let authStateHandler = () => {};
    getSession.mockResolvedValue({ data: { session: null } });
    onAuthStateChange.mockImplementation((handler) => {
      authStateHandler = handler;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    render(<UpdatePasswordForm />);

    await act(async () => {
      authStateHandler("PASSWORD_RECOVERY", { user: { id: "u1" } });
    });

    const submitButton = await screen.findByRole("button", {
      name: /Zapisz nowe hasło/i,
    });

    await waitFor(() => {
      expect(submitButton.disabled).toBe(false);
    });
  });

  it("cleans the URL after a successful password update", async () => {
    render(<UpdatePasswordForm />);

    const submitButton = await screen.findByRole("button", {
      name: /Zapisz nowe hasło/i,
    });

    await waitFor(() => {
      expect(submitButton.disabled).toBe(false);
    });

    fireEvent.change(screen.getByLabelText(/Nowe hasło/), {
      target: { value: "newpassword" },
    });
    fireEvent.change(screen.getByLabelText(/Powtórz nowe hasło/), {
      target: { value: "newpassword" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(clearAuthQueryParams).toHaveBeenCalled();
      expect(window.location.pathname).toBe("/Dominik_Sadzik/");
      expect(window.location.search).toBe("");
      expect(window.location.hash).toBe("#/panel-admin");
    });
  });

  it("shows a recovery session error before submitting when the link is not valid", async () => {
    getSession.mockResolvedValue({ data: { session: null } });

    render(<UpdatePasswordForm />);

    await waitFor(() => {
      expect(screen.getByText(/Brak aktywnej sesji resetu hasła/i)).toBeTruthy();
    });

    expect(updateUser).not.toHaveBeenCalled();
  });
});
