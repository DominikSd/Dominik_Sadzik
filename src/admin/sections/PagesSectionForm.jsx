import React, { useState } from "react";
import { Field, FormGrid, ListEditor, TextArea, TextInput } from "./FormPrimitives";

const pageLabels = [
  ["automationTesting", "Automatyzacja i QA"],
  ["istqbTesting", "Tester ISTQB"],
  ["gamedev", "GameDev"],
];

const sectionLabels = {
  whatCanBeAutomated: "Co mogę automatyzować",
  benefits: "Korzyści",
  examples: "Przykłady zastosowań",
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

  return (
    <div className="space-y-4 rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <h3 className="text-lg font-bold text-white">SEO podstrony</h3>
      <FormGrid>
        <Field label="SEO title" hint="Najlepiej ok. 60-70 znaków.">
          <TextInput
            value={page.seo.title}
            onChange={(event) => updateSeo({ title: event.target.value })}
          />
        </Field>
        <Field label="OG title">
          <TextInput
            value={page.seo.ogTitle || ""}
            onChange={(event) => updateSeo({ ogTitle: event.target.value })}
          />
        </Field>
      </FormGrid>
      <Field label="SEO description" hint="Najlepiej ok. 150-170 znaków.">
        <TextArea
          value={page.seo.description}
          onChange={(event) => updateSeo({ description: event.target.value })}
        />
      </Field>
      <Field label="OG description">
        <TextArea
          value={page.seo.ogDescription || ""}
          onChange={(event) => updateSeo({ ogDescription: event.target.value })}
        />
      </Field>
    </div>
  );
}

function PageHeroEditor({ page, updatePage }) {
  const updateHero = (patch) => updatePage({ hero: { ...page.hero, ...patch } });

  return (
    <div className="space-y-4 rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <h3 className="text-lg font-bold text-white">Hero podstrony</h3>
      <FormGrid>
        <Field label="Slug">
          <TextInput
            value={page.slug}
            onChange={(event) => updatePage({ slug: event.target.value })}
          />
        </Field>
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
  const [activePageKey, setActivePageKey] = useState("automationTesting");
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
