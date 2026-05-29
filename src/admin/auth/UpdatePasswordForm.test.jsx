import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const updateUser = vi.fn();
const getSession = vi.fn();

vi.mock("../../lib/supabaseClient.js", () => ({
  requireSupabase: () => ({
    auth: {
      updateUser,
    },
  }),
  supabase: {
    auth: {
      getSession,
    },
  },
}));

vi.mock("./authRedirects.js", () => ({
  clearAuthQueryParams: vi.fn(),
  getAdminUrl: () => "http://localhost:5173/#/panel-admin",
}));

const UpdatePasswordForm = (await import("./UpdatePasswordForm.jsx")).default;

describe("UpdatePasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSession.mockResolvedValue({ data: { session: { user: { id: "u1" } } } });
    updateUser.mockResolvedValue({ error: null });
  });

  it("uses updateUser to save a new password", async () => {
    render(<UpdatePasswordForm />);

    fireEvent.change(screen.getByLabelText(/Nowe hasło/), {
      target: { value: "newpassword" },
    });
    fireEvent.change(screen.getByLabelText(/Powtórz nowe hasło/), {
      target: { value: "newpassword" },
    });

    const submitButton = await screen.findByRole("button", {
      name: /Zapisz nowe hasło/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith({ password: "newpassword" });
    });
  });
});
