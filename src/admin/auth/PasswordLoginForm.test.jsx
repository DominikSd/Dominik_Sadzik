import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const signInWithPassword = vi.fn();

vi.mock("../../lib/supabaseClient.js", () => ({
  requireSupabase: () => ({
    auth: {
      signInWithPassword,
    },
  }),
}));

const PasswordLoginForm = (await import("./PasswordLoginForm.jsx")).default;

describe("PasswordLoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    signInWithPassword.mockResolvedValue({ error: null });
  });

  it("uses signInWithPassword for password login", async () => {
    render(<PasswordLoginForm />);

    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Hasło/), {
      target: { value: "secret-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Zaloguj/i }));

    await waitFor(() => {
      expect(signInWithPassword).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "secret-password",
      });
    });
  });
});
