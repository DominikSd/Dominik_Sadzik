import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LoginPanel from "./LoginPanel.jsx";

describe("LoginPanel", () => {
  it("renders password login form by default", () => {
    render(<LoginPanel />);
    expect(screen.getByRole("button", { name: /Hasło/ })).toBeTruthy();
    expect(screen.getByLabelText(/Email/)).toBeTruthy();
    expect(screen.getByLabelText(/Hasło/)).toBeTruthy();
  });
});
