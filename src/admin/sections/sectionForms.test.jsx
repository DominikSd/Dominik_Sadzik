import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { defaultSiteContent } from "../../content/defaultSiteContent";
import ContactSectionForm from "./ContactSectionForm";
import FaqSectionForm from "./FaqSectionForm";
import HeroSectionForm from "./HeroSectionForm";
import SeoSectionForm from "./SeoSectionForm";
import ServicesSectionForm from "./ServicesSectionForm";
import SettingsSectionForm from "./SettingsSectionForm";

const forms = [
  ["hero", HeroSectionForm, "Naglowek"],
  ["services", ServicesSectionForm, "Opis sekcji"],
  ["faq", FaqSectionForm, "Dodaj pytanie"],
  ["contact", ContactSectionForm, "Telefon"],
  ["seo", SeoSectionForm, "Meta title"],
  ["settings", SettingsSectionForm, "Nazwa strony"],
];

describe("admin section forms", () => {
  it.each(forms)("renders %s form without missing React runtime", (_key, Form, expectedText) => {
    render(<Form value={defaultSiteContent[_key]} onChange={vi.fn()} />);

    expect(screen.getByText(expectedText)).toBeTruthy();
  });
});
