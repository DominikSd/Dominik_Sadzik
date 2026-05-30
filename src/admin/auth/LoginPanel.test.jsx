import React from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import LoginPanel from "./LoginPanel.jsx";

describe("LoginPanel", () => {
  it("renders password login form by default", () => {
    render(<LoginPanel />);
    expect(screen.getByRole("button", { name: /Hasło/ })).toBeTruthy();
    expect(screen.getByLabelText(/Email/)).toBeTruthy();
    expect(screen.getByLabelText(/Hasło/)).toBeTruthy();
  });

  it("renders magic link and password recovery modes", () => {
    render(<LoginPanel />);

    fireEvent.click(screen.getByRole("button", { name: /Magic link/ }));
    expect(screen.getByRole("button", { name: /Wyślij magic link/i })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Reset hasła/ }));
    expect(screen.getByRole("button", { name: /Wyślij link resetu/i })).toBeTruthy();
  });
});
