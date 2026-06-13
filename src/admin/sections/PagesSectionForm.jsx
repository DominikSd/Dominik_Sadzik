import React, { useState } from "react";
import { Field, FormGrid, ListEditor, TextArea, TextInput } from "./FormPrimitives";
import { defaultSiteContent } from "../../content/defaultSiteContent";
import {
  GooglePreview,
  getLengthHint,
  SocialPreview,
  validateCanonical,
  validateOgImage,
} from "./SeoSectionForm";

const pageLabels = [
  ["webCms", "Strony i CMS"],
  ["qaAutomation", "QA i automatyzacja"],
  ["gamedev", "GameDev"],
];

const sectionLabels = {
  whatICanBuild: "Co mogę przygotować",
  cmsPanel: "Panel CMS",
  process: "Proces współpracy",
  audience: "Dla kogo",
  whatCanBeAutomated: "Co mogę automatyzować",
  benefits: "Korzyści",
  examples: "Przykłady zastosowań",
  istqbCertificate: "Certyfikat ISTQB",
  testing: "Testowanie stron i aplikacji",
  automation: "Automatyzacja procesów",
  bugReports: "Raportowanie błędów",
  qaMindset: "Podejście testerskie",
  testScope: "Zakres testów",
  bugReport: "Raport z testów",
  clientBenefits: "Korzyści dla klienta",
  whatIBuild: "Co tworzę",
  connectionToWeb: "Połączenie z ofertą web",
  demos: "Projekty i demo",
  finalCta: "CTA końcowe",
};

function PageSeoEditor({ page, updatePage }) {
  const updateSeo = (patch) => updatePage({ seo: { ...page.seo, ...patch } });
  const canonicalError = validateCanonical(page.seo.canonical || "");
  const ogImageError = validateOgImage(page.seo.ogImage || "");
  const socialTitle = page.seo.ogTitle || page.seo.title;
  const socialDescription = page.seo.ogDescription || page.seo.description;
  const socialImage = page.seo.ogImage || defaultSiteContent.seo.ogImage;

  return (
    <div className="space-y-4 rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <h3 className="text-lg font-bold text-white">SEO podstrony</h3>
      <FormGrid>
        <Field label="SEO title" hint={getLengthHint(page.seo.title, 30, 60)}>
          <TextInput
            value={page.seo.title}
            onChange={(event) => updateSeo({ title: event.target.value })}
          />
        </Field>
        <Field label="Slug URL" hint="Małe litery, cyfry i myślniki.">
          <TextInput
            value={page.slug}
            onChange={(event) => updatePage({ slug: event.target.value })}
          />
        </Field>
        <Field label="OG title">
          <TextInput
            value={page.seo.ogTitle || ""}
            onChange={(event) => updateSeo({ ogTitle: event.target.value })}
          />
        </Field>
      </FormGrid>
      <Field label="SEO description" hint={getLengthHint(page.seo.description, 70, 160)}>
        <TextArea
          value={page.seo.description}
          onChange={(event) => updateSeo({ description: event.target.value })}
        />
      </Field>
      <Field label="Canonical URL" hint={canonicalError || "Pełny URL albo puste pole."}>
        <TextInput
          value={page.seo.canonical || ""}
          onChange={(event) => updateSeo({ canonical: event.target.value })}
        />
      </Field>
      <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-200">
        <input
          type="checkbox"
          checked={Boolean(page.seo.noindex)}
          onChange={(event) => updateSeo({ noindex: event.target.checked })}
          className="mt-1"
        />
        <span>
          <span className="block font-semibold text-white">Nie indeksuj tej podstrony</span>
          <span className="mt-1 block text-slate-400">Ustawia robots na noindex,nofollow.</span>
        </span>
      </label>
      <Field label="OG description">
        <TextArea
          value={page.seo.ogDescription || ""}
          onChange={(event) => updateSeo({ ogDescription: event.target.value })}
        />
      </Field>
      <Field label="OG image" hint={ogImageError || "URL albo ścieżka publiczna."}>
        <TextInput
          value={page.seo.ogImage || ""}
          onChange={(event) => updateSeo({ ogImage: event.target.value })}
        />
      </Field>
      <div className="grid gap-4 lg:grid-cols-2">
        <GooglePreview
          title={page.seo.title}
          description={page.seo.description}
          canonical={page.seo.canonical}
        />
        <SocialPreview title={socialTitle} description={socialDescription} image={socialImage} />
      </div>
    </div>
  );
}

function PageHeroEditor({ page, updatePage }) {
  const updateHero = (patch) => updatePage({ hero: { ...page.hero, ...patch } });

  return (
    <div className="space-y-4 rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <h3 className="text-lg font-bold text-white">Hero podstrony</h3>
      <FormGrid>
        <Field label="Etykieta">
          <TextInput
            value={page.hero.eyebrow}
            onChange={(event) => updateHero({ eyebrow: event.target.value })}
          />
        </Field>
      </FormGrid>
      <Field label="Tytuł">
        <TextInput
          value={page.hero.title}
          onChange={(event) => updateHero({ title: event.target.value })}
        />
      </Field>
      <Field label="Podtytuł">
        <TextInput
          value={page.hero.subtitle}
          onChange={(event) => updateHero({ subtitle: event.target.value })}
        />
      </Field>
      <Field label="Opis">
        <TextArea
          value={page.hero.description}
          onChange={(event) => updateHero({ description: event.target.value })}
        />
      </Field>
      <FormGrid>
        <Field label="CTA label">
          <TextInput
            value={page.hero.ctaLabel}
            onChange={(event) => updateHero({ ctaLabel: event.target.value })}
          />
        </Field>
        <Field label="CTA link">
          <TextInput
            value={page.hero.ctaHref}
            onChange={(event) => updateHero({ ctaHref: event.target.value })}
          />
        </Field>
      </FormGrid>
    </div>
  );
}

function PageContentSectionEditor({ sectionKey, section, updateSection }) {
  const isFinalCta = sectionKey === "finalCta";

  return (
    <div className="space-y-4 rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <h3 className="text-lg font-bold text-white">{sectionLabels[sectionKey] || sectionKey}</h3>
      <Field label="Tytuł">
        <TextInput
          value={section.title}
          onChange={(event) => updateSection({ ...section, title: event.target.value })}
        />
      </Field>
      <Field label="Opis">
        <TextArea
          value={section.description || ""}
          onChange={(event) => updateSection({ ...section, description: event.target.value })}
        />
      </Field>
      {isFinalCta ? (
        <FormGrid>
          <Field label="CTA label">
            <TextInput
              value={section.ctaLabel}
              onChange={(event) => updateSection({ ...section, ctaLabel: event.target.value })}
            />
          </Field>
          <Field label="CTA link">
            <TextInput
              value={section.ctaHref}
              onChange={(event) => updateSection({ ...section, ctaHref: event.target.value })}
            />
          </Field>
        </FormGrid>
      ) : (
        <ListEditor
          items={section.items}
          onChange={(items) => updateSection({ ...section, items })}
          createItem={() => "Nowy punkt"}
          addLabel="Dodaj punkt"
          maxItems={10}
          renderItem={(item, index, updateItem) => (
            <Field label={`Punkt ${index + 1}`}>
              <TextInput value={item} onChange={(event) => updateItem(event.target.value)} />
            </Field>
          )}
        />
      )}
    </div>
  );
}

export default function PagesSectionForm({ value, onChange }) {
  const [activePageKey, setActivePageKey] = useState("webCms");
  const activePage = value[activePageKey];

  const updatePage = (patch) =>
    onChange({
      ...value,
      [activePageKey]: {
        ...activePage,
        ...patch,
      },
    });

  const updateContentSection = (sectionKey, nextSection) =>
    updatePage({
      sections: {
        ...activePage.sections,
        [sectionKey]: nextSection,
      },
    });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {pageLabels.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActivePageKey(key)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              activePageKey === key
                ? "bg-cyan-400 text-slate-950"
                : "border border-white/10 bg-white/[0.045] text-slate-200 hover:bg-white/10"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <PageSeoEditor page={activePage} updatePage={updatePage} />
      <PageHeroEditor page={activePage} updatePage={updatePage} />

      <div className="space-y-4">
        {Object.entries(activePage.sections).map(([sectionKey, section]) => (
          <PageContentSectionEditor
            key={sectionKey}
            sectionKey={sectionKey}
            section={section}
            updateSection={(nextSection) => updateContentSection(sectionKey, nextSection)}
          />
        ))}
      </div>
    </div>
  );
}
