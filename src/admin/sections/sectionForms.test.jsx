import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { defaultSiteContent } from "../../content/defaultSiteContent";
import ContactSectionForm from "./ContactSectionForm";
import FaqSectionForm from "./FaqSectionForm";
import FeatureCardsSectionForm from "./FeatureCardsSectionForm";
import HeroSectionForm from "./HeroSectionForm";
import PagesSectionForm from "./PagesSectionForm";
import PortfolioSectionForm from "./PortfolioSectionForm";
import SeoSectionForm from "./SeoSectionForm";
import ServicesSectionForm from "./ServicesSectionForm";
import SettingsSectionForm from "./SettingsSectionForm";

const forms = [
  ["hero", HeroSectionForm, "Nagłówek"],
  ["services", ServicesSectionForm, "Opis sekcji"],
  ["automationQa", FeatureCardsSectionForm, "CTA label"],
  ["gamedevTeaser", FeatureCardsSectionForm, "Dodaj kartę"],
  ["pages", PagesSectionForm, "SEO podstrony"],
  ["portfolio", PortfolioSectionForm, "Dodaj projekt"],
  ["faq", FaqSectionForm, "Dodaj pytanie"],
  ["contact", ContactSectionForm, "Telefon"],
  ["seo", SeoSectionForm, "Domyślne SEO strony"],
  ["settings", SettingsSectionForm, "Nazwa strony"],
];

describe("admin section forms", () => {
  it("exposes the Director content in the existing CMS form", () => {
    const onChange = vi.fn();
    render(<PagesSectionForm value={defaultSiteContent.pages} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Director Assistant" }));
    expect(screen.getByDisplayValue("Od danych do gotowego dokumentu")).toBeTruthy();
    const title = screen.getByDisplayValue("Director Assistant");
    fireEvent.change(title, { target: { value: "Director Assistant — projekt" } });
    const updated = onChange.mock.calls.at(-1)[0];
    expect(updated.directorAssistant.hero.title).toBe("Director Assistant — projekt");
    expect(updated.webCms).toEqual(defaultSiteContent.pages.webCms);
  });

  it.each(forms)("renders %s form without missing React runtime", (_key, Form, expectedText) => {
    render(<Form value={defaultSiteContent[_key]} onChange={vi.fn()} />);

    expect(screen.getByText(expectedText)).toBeTruthy();
  });
});
