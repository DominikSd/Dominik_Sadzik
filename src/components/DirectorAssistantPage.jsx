import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

const featureKeys = ["companyData", "customDocuments", "archiveRevisions"];
const supportingKeys = ["importData", "documentCreation", "dataChecks"];
const absoluteAsset = (src, base) => (/^(https?:|\/)/.test(src) ? src : `${base}${src}`);

function ProjectImage({ media, base, onOpen, eager = false, thumbnail = false, caption = true }) {
  return (
    <figure className="min-w-0">
      <a
        href={absoluteAsset(media.fullSrc || media.src, base)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => onOpen?.(event, media)}
        aria-label={`Powiększ: ${media.title}`}
        className="group block overflow-hidden rounded-lg border border-white/15 bg-[#f4f5f8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <img
          src={absoluteAsset(thumbnail ? media.thumbnailSrc || media.src : media.src, base)}
          alt={media.alt}
          width="1600"
          height="1040"
          loading={eager ? "eager" : "lazy"}
          fetchpriority={eager ? "high" : undefined}
          decoding="async"
          className="block h-auto w-full"
        />
      </a>
      {caption && (
        <figcaption className="mt-3 flex items-start justify-between gap-4 text-sm leading-6 text-slate-400">
          <span>
            <strong className="block font-medium text-slate-200">{media.title}</strong>
            {media.description}
          </span>
          <Expand size={15} aria-hidden="true" className="mt-1 shrink-0" />
        </figcaption>
      )}
    </figure>
  );
}

function ImageViewer({ media, selected, setSelected, base }) {
  const dialog = useRef(null);
  const [originalSize, setOriginalSize] = useState(false);
  const item = media[selected];
  useEffect(() => {
    if (selected === null) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (element.open) element.close();
    };
  }, [selected === null]);
  if (!item) return null;
  const move = (direction) => {
    setOriginalSize(false);
    setSelected((selected + direction + media.length) % media.length);
  };
  return (
    <dialog
      ref={dialog}
      aria-labelledby="director-image-title"
      aria-describedby="director-image-caption"
      onClose={(event) => {
        if (!event.currentTarget.open) setSelected(null);
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) setSelected(null);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          move(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
      className="fixed inset-0 max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-[1720px] rounded-xl border border-white/20 bg-[#101521] p-4 text-white backdrop:bg-black/80 md:p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 id="director-image-title" className="text-base font-semibold">
            {item.title}
          </h2>
          <p className="mt-1 text-xs text-slate-400" aria-live="polite">
            {selected + 1} / {media.length}
          </p>
        </div>
        <button
          type="button"
          autoFocus
          onClick={() => setSelected(null)}
          aria-label="Zamknij podgląd"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>
      <div
        className="max-h-[70dvh] overflow-auto rounded-md bg-[#f4f5f8]"
        tabIndex={originalSize ? 0 : undefined}
        aria-label="Obraz aplikacji"
      >
        <img
          key={item.fullSrc || item.src}
          src={absoluteAsset(item.fullSrc || item.src, base)}
          alt={item.alt}
          width="1600"
          height="1040"
          className={
            originalSize
              ? "block w-[1600px] max-w-none"
              : "mx-auto block h-auto max-h-[70dvh] max-w-full object-contain"
          }
        />
      </div>
      <p id="director-image-caption" className="mt-3 text-sm leading-6 text-slate-300">
        {item.description}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Poprzedni obraz"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-white/20"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Następny obraz"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-white/20"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
        <button
          type="button"
          aria-pressed={originalSize}
          onClick={() => setOriginalSize((value) => !value)}
          className="min-h-11 rounded-md border border-white/20 px-4 text-sm"
        >
          {originalSize ? "Dopasuj do ekranu" : "Rozmiar oryginalny"}
        </button>
        <a
          href={absoluteAsset(item.fullSrc || item.src, base)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center text-sm underline underline-offset-4"
        >
          Otwórz plik PNG
        </a>
      </div>
    </dialog>
  );
}

export function DirectorPortfolioCard({ section, basePath = "/" }) {
  const base = basePath.endsWith("/") ? basePath : `${basePath}/`;
  const image = section.mediaItems?.[0];
  return (
    <section id="desktopApps" className="scroll-mt-28 px-4 py-10 sm:px-6 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 rounded-xl border border-white/15 bg-[#101521] p-6 text-left md:grid-cols-[0.85fr_1.15fr] md:items-center md:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Autorska aplikacja desktopowa
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-white">{section.title}</h2>
          <p className="mt-4 leading-7 text-slate-300">{section.description}</p>
          <ul aria-label="Technologie Director Assistant" className="mt-5 flex flex-wrap gap-2">
            {section.items.map((item) => (
              <li
                key={item}
                className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-slate-300"
              >
                {item}
              </li>
            ))}
          </ul>
          <a
            href={`${base}director-assistant/`}
            className="mt-6 inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-white underline underline-offset-4"
          >
            Poznaj Director Assistant <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        {image && (
          <a
            href={`${base}director-assistant/`}
            aria-label="Zobacz prezentację aplikacji Director Assistant"
            className="overflow-hidden rounded-lg border border-white/15"
          >
            <img
              src={absoluteAsset(image.src, base)}
              alt={image.alt}
              width="1600"
              height="1040"
              loading="lazy"
              className="block h-auto w-full"
            />
          </a>
        )}
      </div>
    </section>
  );
}

export default function DirectorAssistantPage({
  page,
  settings,
  basePath = "/",
  onNavigate,
  standalone = false,
}) {
  const base = basePath.endsWith("/") ? basePath : `${basePath}/`;
  const homeHref = (href = "#/") => `${base}${href}`;
  const link = (event, href) => onNavigate?.(event, href);
  const sections = page.sections;
  const editor = sections.customDocuments?.mediaItems?.[0];
  const allImages = Object.values(sections).flatMap((section) => section.mediaItems || []);
  const [selected, setSelected] = useState(null);
  const openImage = (event, media) => {
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0 ||
      typeof HTMLDialogElement === "undefined" ||
      typeof HTMLDialogElement.prototype.showModal !== "function"
    )
      return;
    event.preventDefault();
    setSelected(allImages.findIndex((item) => item.src === media.src));
  };
  return (
    <>
      {standalone && (
        <header className="border-b border-white/10 bg-[#080d18] px-6 py-5">
          <nav
            aria-label="Nawigacja projektu"
            className="mx-auto flex max-w-[1440px] items-center justify-between gap-4"
          >
            <a href={homeHref()} className="font-semibold text-white">
              {settings.siteName}
            </a>
            <a href={homeHref("#/portfolio")} className="text-sm text-slate-300">
              Portfolio
            </a>
          </nav>
        </header>
      )}
      <article className="relative bg-[#080d18] text-white [font-family:var(--font-body)]">
        <section className="mx-auto max-w-[1440px] px-6 pb-12 pt-8 md:px-10 md:pt-10">
          <a
            href={homeHref("#/portfolio")}
            onClick={(e) => link(e, "#/portfolio")}
            className="inline-flex min-h-11 items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Wróć do portfolio
          </a>
          <div className="mt-8 grid items-center gap-9 lg:grid-cols-[0.85fr_1.4fr] lg:gap-12">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                {page.hero.eyebrow}
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl xl:text-6xl">
                {page.hero.title}
              </h1>
              <p className="mt-5 text-xl font-medium leading-relaxed text-slate-200 xl:text-2xl">
                {page.hero.subtitle}
              </p>
              <p className="mt-6 text-base leading-8 text-slate-300">{page.hero.description}</p>
              <p className="mt-5 text-sm leading-6 text-slate-400">
                {sections.projectContext?.items?.[0]}
              </p>
              <a
                href={homeHref(page.hero.ctaHref)}
                onClick={(e) => link(e, page.hero.ctaHref)}
                className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold hover:bg-white/10"
              >
                {page.hero.ctaLabel}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
            {editor && <ProjectImage media={editor} base={base} onOpen={openImage} eager />}
          </div>
          {sections.technologyStack && (
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 border-y border-white/10 py-5">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                {sections.technologyStack.title}
              </p>
              <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-slate-200">
                {sections.technologyStack.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
        <div className="mx-auto max-w-[1440px] px-6 pb-16 md:px-10 md:pb-24">
          {sections.projectContext && (
            <div className="max-w-3xl pb-12 pt-4">
              <h2 className="text-2xl font-semibold leading-snug sm:text-3xl">
                {sections.projectContext.title}
              </h2>
              <p className="mt-4 leading-8 text-slate-400">{sections.projectContext.description}</p>
            </div>
          )}
          <div className="space-y-16 md:space-y-24">
            {featureKeys
              .filter((key) => sections[key])
              .map((key, index) => {
                const section = sections[key];
                return (
                  <section
                    key={key}
                    id={key}
                    className="grid scroll-mt-28 items-start gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16"
                  >
                    <div className="min-w-0 lg:pt-3">
                      <p className="text-xs tracking-[0.18em] text-slate-400">0{index + 1}</p>
                      <h2 className="mt-3 text-2xl font-semibold leading-snug sm:text-3xl">
                        {section.title}
                      </h2>
                      <p className="mt-5 leading-8 text-slate-400">{section.description}</p>
                      <ul className="mt-6 space-y-3">
                        {section.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-sm leading-7 text-slate-300"
                          >
                            <Check
                              size={15}
                              aria-hidden="true"
                              className="mt-1.5 shrink-0 text-slate-400"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="min-w-0 space-y-7">
                      {section.mediaItems?.map((media) => (
                        <ProjectImage
                          key={media.src}
                          media={media}
                          base={base}
                          onOpen={openImage}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
          </div>
          <div className="my-16 grid gap-6 border-y border-white/10 py-10 md:my-24 md:grid-cols-3">
            {supportingKeys
              .filter((key) => sections[key])
              .map((key) => (
                <section key={key}>
                  <h2 className="text-lg font-semibold">{sections[key].title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-400">
                    {sections[key].description}
                  </p>
                </section>
              ))}
          </div>
          {sections.gallery && (
            <section aria-labelledby="director-gallery-title">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <h2 id="director-gallery-title" className="text-2xl font-semibold sm:text-3xl">
                  {sections.gallery.title}
                </h2>
                <p className="text-sm text-slate-400">{sections.gallery.items[0]}</p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2">
                {sections.gallery.mediaItems?.map((media) => (
                  <ProjectImage
                    key={media.src}
                    media={media}
                    base={base}
                    onOpen={openImage}
                    thumbnail
                  />
                ))}
              </div>
              <p className="mt-10 max-w-4xl border-t border-white/10 pt-6 text-sm leading-7 text-slate-400">
                {sections.gallery.description}
              </p>
            </section>
          )}
        </div>
      </article>
      {selected !== null && (
        <ImageViewer media={allImages} selected={selected} setSelected={setSelected} base={base} />
      )}
      {standalone && (
        <footer className="border-t border-white/10 bg-[#080d18] px-6 py-8 text-center text-sm text-slate-400">
          <a href={homeHref()}>{settings.siteName} — strona główna</a>
        </footer>
      )}
    </>
  );
}
