import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

const resetPasswordForEmail = vi.fn();

vi.mock("../../lib/supabaseClient.js", () => ({
  requireSupabase: () => ({
    auth: {
      resetPasswordForEmail,
    },
  }),
}));

vi.mock("./authRedirects.js", () => ({
  getAuthRecoveryUrl: () => "http://localhost:5173/?auth=recovery",
}));

const PasswordRecoveryRequest = (await import("./PasswordRecoveryRequest.jsx")).default;

describe("PasswordRecoveryRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetPasswordForEmail.mockResolvedValue({ error: null });
  });

  it("calls resetPasswordForEmail with the correct redirect URL", async () => {
    render(<PasswordRecoveryRequest />);

    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Wyślij link resetu/i }));

    await waitFor(() => {
      expect(resetPasswordForEmail).toHaveBeenCalledWith("user@example.com", {
        redirectTo: "http://localhost:5173/?auth=recovery",
      });
    });
  });
});
