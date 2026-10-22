import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import DirectorAssistantPage from "./DirectorAssistantPage.jsx";
import { defaultSiteContent } from "../content/defaultSiteContent.js";

const page = defaultSiteContent.pages.directorAssistant;
const setup = () =>
  render(
    <DirectorAssistantPage
      page={page}
      settings={defaultSiteContent.settings}
      basePath="/portfolio/"
    />,
  );

describe("Director Assistant presentation", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
    HTMLDialogElement.prototype.showModal = vi.fn(function () {
      this.setAttribute("open", "");
    });
    HTMLDialogElement.prototype.close = vi.fn(function () {
      this.removeAttribute("open");
    });
  });

  it("shows all eight adapted images, one shared disclosure and the confirmed technologies", () => {
    setup();
    expect(new Set(screen.getAllByRole("img").map((img) => img.src)).size).toBe(8);
    expect(screen.getAllByText(page.sections.gallery.description)).toHaveLength(1);
    expect(screen.getByText("SQLite")).toBeTruthy();
    expect(screen.getByText(/Dane są przechowywane lokalnie/)).toBeTruthy();
    expect(screen.getByText(/PDF korzysta z LibreOffice/)).toBeTruthy();
    expect(screen.getAllByRole("img")[0].getAttribute("loading")).toBe("eager");
    expect(screen.getByRole("link", { name: "Powiększ: Import danych" }).href).toContain(
      "/portfolio/portfolio/director-assistant/05-import-danych.png",
    );
  });

  it("opens original PNGs, changes images, toggles original size, and restores page scrolling", () => {
    setup();
    fireEvent.click(screen.getByRole("link", { name: "Powiększ: Import danych" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading").textContent).toBe("Import danych");
    expect(document.body.style.overflow).toBe("hidden");
    expect(within(dialog).getByRole("img").src).toMatch(/05-import-danych\.png$/);
    fireEvent.keyDown(dialog, { key: "ArrowRight" });
    expect(within(dialog).getByRole("heading").textContent).toBe("Profil firmy");
    fireEvent.click(within(dialog).getByRole("button", { name: "Następny obraz" }));
    expect(within(dialog).getByRole("heading").textContent).toBe("Kartoteka kontaktów");
    fireEvent.click(within(dialog).getByRole("button", { name: "Rozmiar oryginalny" }));
    expect(
      within(dialog)
        .getByRole("button", { name: "Dopasuj do ekranu" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    fireEvent.click(within(dialog).getByRole("button", { name: "Zamknij podgląd" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("retains direct PNG links when native dialogs are unavailable", () => {
    HTMLDialogElement.prototype.showModal = undefined;
    setup();
    fireEvent.click(screen.getByRole("link", { name: "Powiększ: Import danych" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
