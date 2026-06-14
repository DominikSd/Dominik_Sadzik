import React, { useMemo, useState } from "react";
import { defaultSiteContent } from "../../content/defaultSiteContent";
import { Field, FormGrid, TextArea, TextInput } from "./FormPrimitives";

const seoPageLabels = [
  ["start", "Start"],
  ["projects", "Projekty"],
  ["faq", "FAQ"],
  ["contact", "Kontakt"],
];

const emptySeoPage = {
  title: "",
  description: "",
  slug: "",
  canonical: "",
  noindex: false,
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
};

export function getLengthHint(value, min, max) {
  const length = String(value || "").trim().length;
  const status = length < min ? "za krótko" : length > max ? "za długo" : "dobrze";
  return `${length} znaków - zalecane ${min}-${max}, obecnie: ${status}.`;
}

function validateSlug(slug) {
  if (!slug) return "";
  return /^[a-z0-9-]+$/.test(slug)
    ? ""
    : "Slug powinien mieć tylko małe litery, cyfry i myślniki, bez spacji i polskich znaków.";
}

export function validateCanonical(url) {
  if (!url) return "";
  return /^https?:\/\/[^\s]+$/i.test(url) ? "" : "Podaj pełny URL albo zostaw puste pole.";
}

export function validateOgImage(value) {
  if (!value) return "";
  if (/^https?:\/\/[^\s]+$/i.test(value)) return "";
  if (/^[a-z0-9][a-z0-9/_.,?=&%#+-]*$/i.test(value)) return "";
  return "Podaj pełny URL albo ścieżkę publiczną, np. og-image.png.";
}

export function GooglePreview({ title, description, canonical }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/65 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
        Podgląd Google
      </p>
      <p className="mt-3 truncate text-xs text-emerald-300">
        {canonical || "https://dominiksd.github.io/Dominik_Sadzik/"}
      </p>
      <p className="mt-1 break-words text-lg font-semibold text-blue-300">
        {title || "Tytuł strony"}
      </p>
      <p className="mt-1 break-words text-sm leading-6 text-slate-300">
        {description || "Opis meta pojawi się tutaj jako krótki podgląd wyniku wyszukiwania."}
      </p>
    </div>
  );
}

export function SocialPreview({ title, description, image }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/65">
      <div className="flex aspect-[1.91/1] items-center justify-center overflow-hidden bg-slate-900">
        {image ? (
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="text-sm font-semibold text-slate-500">Obraz linku</div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
          Podgląd social
        </p>
        <p className="mt-2 break-words text-base font-bold text-white">
          {title || "Tytuł do udostępniania"}
        </p>
        <p className="mt-1 break-words text-sm leading-6 text-slate-400">
          {description || "Opis linku widoczny np. w komunikatorze lub social media."}
        </p>
      </div>
    </div>
  );
}

function SeoPageEditor({ page, updatePage, fallbackImage }) {
  const slugError = validateSlug(page.slug);
  const canonicalError = validateCanonical(page.canonical);
  const ogImageError = validateOgImage(page.ogImage);
  const socialTitle = page.ogTitle || page.title;
  const socialDescription = page.ogDescription || page.description;
  const socialImage = page.ogImage || fallbackImage;

  return (
    <div className="space-y-5 rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <FormGrid>
        <Field label="Tytuł SEO" hint={getLengthHint(page.title, 30, 60)}>
          <TextInput
            value={page.title}
            onChange={(event) => updatePage({ title: event.target.value })}
          />
        </Field>
        <Field
          label="Slug URL"
          hint={slugError || "Małe litery, cyfry i myślniki. Puste pole oznacza stronę główną."}
        >
          <TextInput
            value={page.slug}
            onChange={(event) => updatePage({ slug: event.target.value })}
          />
        </Field>
      </FormGrid>
      <Field label="Opis meta" hint={getLengthHint(page.description, 70, 160)}>
        <TextArea
          value={page.description}
          onChange={(event) => updatePage({ description: event.target.value })}
        />
      </Field>
      <Field label="Canonical URL" hint={canonicalError || "Pełny URL albo puste pole."}>
        <TextInput
          value={page.canonical}
          onChange={(event) => updatePage({ canonical: event.target.value })}
        />
      </Field>
      <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-slate-950/45 p-4 text-sm text-slate-200">
        <input
          type="checkbox"
          checked={page.noindex}
          onChange={(event) => updatePage({ noindex: event.target.checked })}
          className="mt-1"
        />
        <span>
          <span className="block font-semibold text-white">Nie indeksuj tej sekcji</span>
          <span className="mt-1 block text-slate-400">
            Ustawia robots na noindex,nofollow. Przydatne tylko dla stron, których nie chcesz
            pokazywać w Google.
          </span>
        </span>
      </label>
      <FormGrid>
        <Field label="Tytuł do udostępniania">
          <TextInput
            value={page.ogTitle}
            onChange={(event) => updatePage({ ogTitle: event.target.value })}
          />
        </Field>
        <Field
          label="Obrazek do udostępniania"
          hint={ogImageError || "URL albo ścieżka publiczna."}
        >
          <TextInput
            value={page.ogImage}
            onChange={(event) => updatePage({ ogImage: event.target.value })}
          />
        </Field>
      </FormGrid>
      <Field label="Opis do udostępniania">
        <TextArea
          value={page.ogDescription}
          onChange={(event) => updatePage({ ogDescription: event.target.value })}
        />
      </Field>
      <div className="grid gap-4 lg:grid-cols-2">
        <GooglePreview
          title={page.title}
          description={page.description}
          canonical={page.canonical}
        />
        <SocialPreview title={socialTitle} description={socialDescription} image={socialImage} />
      </div>
    </div>
  );
}

export default function SeoSectionForm({ value, onChange }) {
  const [activePageKey, setActivePageKey] = useState("start");
  const seoValue = {
    ...defaultSiteContent.seo,
    ...value,
    pages: {
      ...defaultSiteContent.seo.pages,
      ...(value.pages || {}),
    },
  };
  const activePage = {
    ...emptySeoPage,
    ...seoValue.pages[activePageKey],
  };
  const fallbackImage = seoValue.ogImage || defaultSiteContent.seo.ogImage;
  const globalTitleHint = useMemo(
    () => getLengthHint(seoValue.metaTitle, 30, 60),
    [seoValue.metaTitle],
  );
  const globalDescriptionHint = useMemo(
    () => getLengthHint(seoValue.metaDescription, 70, 160),
    [seoValue.metaDescription],
  );

  const updateGlobal = (patch) => onChange({ ...seoValue, ...patch });
  const updatePage = (patch) =>
    onChange({
      ...seoValue,
      pages: {
        ...seoValue.pages,
        [activePageKey]: {
          ...activePage,
          ...patch,
        },
      },
    });

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50">
        SEO zapisuje się jak inne treści: najpierw jako draft, a dopiero po publikacji trafia na
        publiczną stronę. To techniczne przygotowanie meta tagów i podglądów linków, nie gwarancja
        pozycji w Google.
      </div>

      <div className="space-y-5 rounded-lg border border-white/10 bg-white/[0.035] p-4">
        <h3 className="text-lg font-bold text-white">Domyślne SEO strony</h3>
        <FormGrid>
          <Field label="Tytuł SEO" hint={globalTitleHint}>
            <TextInput
              value={seoValue.metaTitle}
              onChange={(event) => updateGlobal({ metaTitle: event.target.value })}
            />
          </Field>
          <Field label="Nazwa strony">
            <TextInput
              value={seoValue.siteName}
              onChange={(event) => updateGlobal({ siteName: event.target.value })}
            />
          </Field>
        </FormGrid>
        <Field label="Opis meta" hint={globalDescriptionHint}>
          <TextArea
            value={seoValue.metaDescription}
            onChange={(event) => updateGlobal({ metaDescription: event.target.value })}
          />
        </Field>
        <FormGrid>
          <Field
            label="Canonical strony głównej"
            hint={validateCanonical(seoValue.canonical) || "Pełny URL strony głównej."}
          >
            <TextInput
              value={seoValue.canonical}
              onChange={(event) => updateGlobal({ canonical: event.target.value })}
            />
          </Field>
          <Field label="Robots" hint="Zwykle: index,follow. Panel CMS ma osobne noindex.">
            <TextInput
              value={seoValue.robots}
              onChange={(event) => updateGlobal({ robots: event.target.value })}
            />
          </Field>
        </FormGrid>
        <FormGrid>
          <Field label="OG title">
            <TextInput
              value={seoValue.ogTitle}
              onChange={(event) => updateGlobal({ ogTitle: event.target.value })}
            />
          </Field>
          <Field
            label="OG image"
            hint={validateOgImage(seoValue.ogImage) || "URL albo ścieżka publiczna."}
          >
            <TextInput
              value={seoValue.ogImage}
              onChange={(event) => updateGlobal({ ogImage: event.target.value })}
            />
          </Field>
        </FormGrid>
        <Field label="OG description">
          <TextArea
            value={seoValue.ogDescription}
            onChange={(event) => updateGlobal({ ogDescription: event.target.value })}
          />
        </Field>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white">SEO sekcji strony głównej</h3>
          <p className="mt-1 text-sm text-slate-400">
            Obecnie projekt działa na hash routingu, więc sitemap ma tylko główny URL. Te pola
            ustawiają meta tagi po przejściu do danej sekcji w aplikacji.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {seoPageLabels.map(([key, label]) => (
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
        <SeoPageEditor page={activePage} updatePage={updatePage} fallbackImage={fallbackImage} />
      </div>
    </div>
  );
}
