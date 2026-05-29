import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const signInWithOtp = vi.fn();

vi.mock("../../lib/supabaseClient.js", () => ({
  requireSupabase: () => ({
    auth: {
      signInWithOtp,
    },
  }),
}));

vi.mock("./authRedirects.js", () => ({
  getAuthCallbackUrl: () => "http://localhost:5173/?auth=callback",
}));

const MagicLinkForm = (await import("./MagicLinkForm.jsx")).default;

describe("MagicLinkForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    signInWithOtp.mockResolvedValue({ error: null });
  });

  it("calls signInWithOtp with shouldCreateUser false", async () => {
    render(<MagicLinkForm />);

    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Wyślij magic link/i }));

    await waitFor(() => {
      expect(signInWithOtp).toHaveBeenCalledWith({
        email: "user@example.com",
        options: {
          emailRedirectTo: "http://localhost:5173/?auth=callback",
          shouldCreateUser: false,
        },
      });
    });
  });
});
