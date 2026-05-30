import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary.jsx";

function BrokenChild() {
  throw new Error("Testowy runtime error");
}

describe("ErrorBoundary", () => {
  it("renders a fallback instead of a blank screen when a child throws", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary title="Błąd testowy" description="Fallback działa.">
        <BrokenChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Błąd testowy")).toBeTruthy();
    expect(screen.getByText("Fallback działa.")).toBeTruthy();
    expect(screen.getByText(/Testowy runtime error/)).toBeTruthy();

    consoleError.mockRestore();
  });
});
