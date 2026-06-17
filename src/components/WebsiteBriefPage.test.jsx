import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import WebsiteBriefPage from "./WebsiteBriefPage";
import { submitWebsiteBrief } from "../lib/briefApi";
import { trackFormSubmit } from "../lib/analytics/ga4";

vi.mock("../lib/briefApi", () => ({
  submitWebsiteBrief: vi.fn(),
}));

vi.mock("../lib/analytics/ga4", () => ({
  trackFormSubmit: vi.fn(),
}));

describe("WebsiteBriefPage", () => {
  beforeEach(() => {
    submitWebsiteBrief.mockReset();
    trackFormSubmit.mockReset();
  });

  it("renders the website brief form sections", () => {
    render(<WebsiteBriefPage contact={{ email: "kontakt@example.com" }} />);

    expect(
      screen.getByRole("heading", {
        name: "Opisz swoją stronę, a przygotuję wstępną propozycję",
      }),
    ).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Dane kontaktowe" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Jakiej strony potrzebujesz?" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Edycja strony i materiały" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Styl i dodatki" })).toBeTruthy();
  });

  it("validates required fields before submit", async () => {
    const user = userEvent.setup();
    render(<WebsiteBriefPage contact={{ email: "kontakt@example.com" }} />);

    await user.click(screen.getByRole("button", { name: /Wyślij opis strony/i }));

    expect(screen.getByText("Podaj imię i nazwisko albo nazwę firmy.")).toBeTruthy();
    expect(screen.getByText("Podaj adres e-mail.")).toBeTruthy();
    expect(screen.getByText("Zgoda na kontakt jest wymagana.")).toBeTruthy();
    expect(submitWebsiteBrief).not.toHaveBeenCalled();
  });

  it("submits the brief and shows success message", async () => {
    const user = userEvent.setup();
    submitWebsiteBrief.mockResolvedValue({ ok: true });
    render(<WebsiteBriefPage contact={{ email: "kontakt@example.com" }} />);

    await user.type(screen.getByLabelText("Imię i nazwisko / nazwa firmy"), "Dominik");
    await user.type(screen.getByLabelText("E-mail"), "dominik@example.com");
    await user.click(screen.getByLabelText("strona z panelem administratora"));
    await user.type(
      screen.getByLabelText("Opisz krótko, czym się zajmujesz i czego oczekujesz od strony"),
      "Potrzebuję strony z panelem administratora.",
    );
    await user.click(
      screen.getByLabelText(/Wyrażam zgodę na kontakt w sprawie przesłanego zapytania/i),
    );
    await user.click(screen.getByRole("button", { name: /Wyślij opis strony/i }));

    await waitFor(() => {
      expect(submitWebsiteBrief).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Dominik",
          email: "dominik@example.com",
          projectTypes: ["strona z panelem administratora"],
          consentContact: true,
        }),
      );
      expect(trackFormSubmit).toHaveBeenCalledWith("website_brief");
      expect(screen.getByRole("status").textContent).toContain(
        "Dziękuję za przesłanie opisu strony",
      );
      expect(screen.getAllByText(/Dziękuję za przesłanie opisu strony/i)).toHaveLength(2);
    });
  });
});
