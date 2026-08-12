export const DEFAULT_SITE_URL = "https://dominik-sadzik.pl/";
export const DEFAULT_OG_IMAGE = `${DEFAULT_SITE_URL}link-preview.png`;

function getDocumentHead() {
  if (typeof document === "undefined") return null;
  return document.head;
}

function removeDuplicateElements(selector, keepElement) {
  if (typeof document === "undefined" || !keepElement) return;

  document.querySelectorAll(selector).forEach((element) => {
    if (element !== keepElement) element.remove();
  });
}

function ensureMeta(selector, attributes) {
  const head = getDocumentHead();
  if (!head) return null;

  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => {
      if (key !== "content") element.setAttribute(key, value);
    });
    head.appendChild(element);
  }

  if (attributes.content !== undefined) {
    element.setAttribute("content", attributes.content);
  }

  removeDuplicateElements(selector, element);
  return element;
}

function ensureCanonical(url) {
  const head = getDocumentHead();
  if (!head) return null;

  let element = document.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    head.appendChild(element);
  }

  element.setAttribute("href", url);
  removeDuplicateElements('link[rel="canonical"]', element);
  return element;
}

function ensureJsonLd(id, data) {
  const head = getDocumentHead();
  if (!head) return null;

  let element = document.getElementById(id);
  if (!element) {
    element = document.createElement("script");
    element.id = id;
    element.type = "application/ld+json";
    head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
  return element;
}

export function normalizeBaseUrl(url = DEFAULT_SITE_URL) {
  const value = String(url || DEFAULT_SITE_URL).trim() || DEFAULT_SITE_URL;
  return value.endsWith("/") ? value : `${value}/`;
}

export function toAbsoluteUrl(value = "", baseUrl = DEFAULT_SITE_URL) {
  const cleanValue = String(value || "").trim();
  if (!cleanValue) return "";
  if (/^https?:\/\//i.test(cleanValue)) return cleanValue;

  try {
    return new URL(cleanValue.replace(/^\/+/, ""), normalizeBaseUrl(baseUrl)).toString();
  } catch {
    return "";
  }
}

function getRouteSlug(routeHash = "") {
  return String(routeHash || "")
    .replace(/^#\/?/, "")
    .replace(/^\/+|\/+$/g, "");
}

function isHomeRoute(routeSlug = "") {
  return routeSlug === "" || routeSlug === "/";
}

function getSectionSeoKey(routeSlug = "") {
  if (isHomeRoute(routeSlug)) return "start";
  if (routeSlug === "realizacje") return "projects";
  if (routeSlug === "kontakt") return "contact";
  return routeSlug;
}

function getRouteCanonical({ entry, baseUrl }) {
  const fallback = normalizeBaseUrl(baseUrl);
  const configuredCanonical = String(entry?.canonical || "").trim();

  if (!configuredCanonical) return fallback;

  try {
    const canonicalUrl = new URL(configuredCanonical, fallback);
    canonicalUrl.hash = "";
    return canonicalUrl.toString();
  } catch {
    return fallback;
  }
}

export function getPublicRouteSeo({ content, routeHash = "", activePage = null } = {}) {
  const globalSeo = content?.seo || {};
  const baseUrl = normalizeBaseUrl(globalSeo.canonical || DEFAULT_SITE_URL);
  const routeSlug = getRouteSlug(routeHash);

  if (activePage?.seo) {
    const pageSeo = activePage.seo;
    return {
      title: pageSeo.title || globalSeo.metaTitle,
      description: pageSeo.description || globalSeo.metaDescription,
      canonical: getRouteCanonical({
        entry: pageSeo,
        baseUrl,
      }),
      robots: pageSeo.noindex ? "noindex,nofollow" : globalSeo.robots || "index,follow",
      ogTitle: pageSeo.ogTitle || pageSeo.title || globalSeo.ogTitle || globalSeo.metaTitle,
      ogDescription:
        pageSeo.ogDescription ||
        pageSeo.description ||
        globalSeo.ogDescription ||
        globalSeo.metaDescription,
      ogImage: toAbsoluteUrl(pageSeo.ogImage || globalSeo.ogImage || DEFAULT_OG_IMAGE, baseUrl),
      ogUrl: getRouteCanonical({
        entry: pageSeo,
        baseUrl,
      }),
      siteName: globalSeo.siteName || "Dominik Sadzik",
      locale: globalSeo.locale || "pl_PL",
    };
  }

  const sectionSeoKey = getSectionSeoKey(routeSlug);
  const entry = globalSeo.pages?.[sectionSeoKey] || globalSeo.pages?.start || {};
  const sectionCanonical = getRouteCanonical({
    entry,
    baseUrl,
  });

  return {
    title: entry.title || globalSeo.metaTitle,
    description: entry.description || globalSeo.metaDescription,
    canonical: sectionCanonical,
    robots: entry.noindex ? "noindex,nofollow" : globalSeo.robots || "index,follow",
    ogTitle: entry.ogTitle || entry.title || globalSeo.ogTitle || globalSeo.metaTitle,
    ogDescription:
      entry.ogDescription ||
      entry.description ||
      globalSeo.ogDescription ||
      globalSeo.metaDescription,
    ogImage: toAbsoluteUrl(entry.ogImage || globalSeo.ogImage || DEFAULT_OG_IMAGE, baseUrl),
    ogUrl: sectionCanonical,
    siteName: globalSeo.siteName || "Dominik Sadzik",
    locale: globalSeo.locale || "pl_PL",
  };
}

export function applySeo(seo) {
  if (typeof document === "undefined" || !seo) return;

  document.title = seo.title || "Dominik Sadzik";
  ensureMeta('meta[name="description"]', {
    name: "description",
    content: seo.description || "",
  });
  ensureMeta('meta[name="robots"]', {
    name: "robots",
    content: seo.robots || "index,follow",
  });
  ensureCanonical(seo.canonical || DEFAULT_SITE_URL);

  ensureMeta('meta[property="og:title"]', {
    property: "og:title",
    content: seo.ogTitle || seo.title || "",
  });
  ensureMeta('meta[property="og:description"]', {
    property: "og:description",
    content: seo.ogDescription || seo.description || "",
  });
  ensureMeta('meta[property="og:type"]', {
    property: "og:type",
    content: "website",
  });
  ensureMeta('meta[property="og:url"]', {
    property: "og:url",
    content: seo.ogUrl || seo.canonical || DEFAULT_SITE_URL,
  });
  ensureMeta('meta[property="og:image"]', {
    property: "og:image",
    content: seo.ogImage || DEFAULT_OG_IMAGE,
  });
  ensureMeta('meta[property="og:site_name"]', {
    property: "og:site_name",
    content: seo.siteName || "Dominik Sadzik",
  });
  ensureMeta('meta[property="og:locale"]', {
    property: "og:locale",
    content: seo.locale || "pl_PL",
  });

  ensureMeta('meta[name="twitter:card"]', {
    name: "twitter:card",
    content: "summary_large_image",
  });
  ensureMeta('meta[name="twitter:title"]', {
    name: "twitter:title",
    content: seo.ogTitle || seo.title || "",
  });
  ensureMeta('meta[name="twitter:description"]', {
    name: "twitter:description",
    content: seo.ogDescription || seo.description || "",
  });
  ensureMeta('meta[name="twitter:image"]', {
    name: "twitter:image",
    content: seo.ogImage || DEFAULT_OG_IMAGE,
  });
}

export function applyNoindexSeo(title = "Panel CMS - Dominik Sadzik") {
  applySeo({
    title,
    description: "Prywatny panel administracyjny.",
    canonical: DEFAULT_SITE_URL,
    robots: "noindex,nofollow",
    ogTitle: title,
    ogDescription: "Prywatny panel administracyjny.",
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: DEFAULT_SITE_URL,
    siteName: "Dominik Sadzik",
    locale: "pl_PL",
  });
}

export function applyStructuredData(content) {
  const globalSeo = content?.seo || {};
  const baseUrl = normalizeBaseUrl(globalSeo.canonical || DEFAULT_SITE_URL);
  const siteName = globalSeo.siteName || content?.settings?.siteName || "Dominik Sadzik";
  const description = globalSeo.metaDescription || content?.hero?.description || "";

  ensureJsonLd("structured-data-website", {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: baseUrl,
    inLanguage: "pl-PL",
    description,
  });

  ensureJsonLd("structured-data-person", {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteName,
    url: baseUrl,
    jobTitle: "Web developer",
    knowsAbout: [
      "strony internetowe",
      "wizytówki online",
      "lekki CMS",
      "React",
      "testowanie stron",
    ],
  });

  ensureJsonLd("structured-data-service", {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteName,
    url: baseUrl,
    areaServed: "PL",
    serviceType: "Projektowanie stron internetowych i lekkich paneli CMS",
    description,
  });
}
