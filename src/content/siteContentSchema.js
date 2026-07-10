import { z } from "zod";
import { CONTENT_SCHEMA_VERSION, defaultSiteContent } from "./defaultSiteContent";

export const allowedCollections = ["page_sections", "seo", "settings"];
export const editableSectionKeys = [
  "hero",
  "services",
  "automationQa",
  "gamedevTeaser",
  "pages",
  "portfolio",
  "faq",
  "contact",
  "seo",
  "settings",
];

const ctaSchema = z.object({
  label: z.string().trim().min(1).max(80),
  href: z.string().trim().min(1).max(240),
});

const navItemSchema = z.object({
  label: z.string().trim().min(1).max(60),
  href: z.string().trim().min(1).max(160),
});

const sectionHeadingSchema = z.object({
  eyebrow: z.string().trim().max(80).default(""),
  title: z.string().trim().min(1).max(180),
  text: z.string().trim().max(600).default(""),
});

const iconKeySchema = z.enum([
  "monitor",
  "palette",
  "sparkles",
  "globe",
  "check",
  "badge",
  "shield-check",
]);

const featureCardSchema = z.object({
  icon: iconKeySchema.optional().default("sparkles"),
  title: z.string().trim().min(1).max(100),
  text: z.string().trim().min(1).max(420),
});

const editableListSectionSchema = z.object({
  title: z.string().trim().min(1).max(140),
  description: z.string().trim().max(520).default(""),
  items: z.array(z.string().trim().min(1).max(160)).min(1).max(10),
  mediaItems: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(100),
        description: z.string().trim().max(260).default(""),
        src: z.string().trim().min(1).max(300),
        demoSrc: z.string().trim().max(300).optional().default(""),
        demoLabel: z.string().trim().max(80).optional().default("Zobacz animację"),
        alt: z.string().trim().min(1).max(180),
        tags: z.array(z.string().trim().min(1).max(40)).max(6).optional().default([]),
      }),
    )
    .max(6)
    .optional()
    .default([]),
});

const finalCtaSectionSchema = z.object({
  title: z.string().trim().min(1).max(140),
  description: z.string().trim().max(520).default(""),
  ctaLabel: z.string().trim().min(1).max(60),
  ctaHref: z.string().trim().min(1).max(220),
});

const slugSchema = z
  .string()
  .trim()
  .max(80)
  .regex(/^[a-z0-9-]*$/, "Slug może zawierać tylko małe litery, cyfry i myślniki.");

const canonicalSchema = z
  .string()
  .trim()
  .max(240)
  .refine((value) => value === "" || /^https?:\/\/[^\s]+$/i.test(value), {
    message: "Canonical musi być pełnym adresem URL albo pustym polem.",
  })
  .default("");

const ogImageSchema = z
  .string()
  .trim()
  .max(300)
  .refine(
    (value) =>
      value === "" ||
      /^https?:\/\/[^\s]+$/i.test(value) ||
      /^[a-z0-9][a-z0-9/_.,?=&%#+-]*$/i.test(value),
    {
      message: "Obraz OG musi być pełnym URL-em albo poprawną ścieżką publiczną.",
    },
  )
  .default("");

const routeSeoSchema = z.object({
  title: z.string().trim().min(1).max(75),
  description: z.string().trim().min(1).max(180),
  slug: slugSchema.default(""),
  canonical: canonicalSchema,
  noindex: z.boolean().default(false),
  ogTitle: z.string().trim().max(90).optional().default(""),
  ogDescription: z.string().trim().max(220).optional().default(""),
  ogImage: ogImageSchema,
});

const pageSeoSchema = z.object({
  title: z.string().trim().min(1).max(75),
  description: z.string().trim().min(1).max(180),
  canonical: canonicalSchema,
  noindex: z.boolean().default(false),
  ogTitle: z.string().trim().max(90).optional().default(""),
  ogDescription: z.string().trim().max(220).optional().default(""),
  ogImage: ogImageSchema,
});

const pageHeroSchema = z.object({
  eyebrow: z.string().trim().max(80).default(""),
  title: z.string().trim().min(1).max(140),
  subtitle: z.string().trim().max(160).default(""),
  description: z.string().trim().min(1).max(700),
  ctaLabel: z.string().trim().min(1).max(60),
  ctaHref: z.string().trim().min(1).max(220),
});

const retiredPortfolioTitles = new Set([
  "Kontrola strony po publikacji",
  "Raport testów funkcjonalnych",
  "Interaktywny prototyp 2.5D",
]);

const editablePageSchema = z.object({
  slug: slugSchema.min(1),
  seo: pageSeoSchema,
  hero: pageHeroSchema,
  sections: z.record(z.union([editableListSectionSchema, finalCtaSectionSchema])),
});

export const sectionSchemas = {
  settings: z.object({
    siteName: z.string().trim().min(1).max(100),
    tagline: z.string().trim().max(160),
    footerText: z.string().trim().min(1).max(180),
    navItems: z.array(navItemSchema).min(1).max(8),
  }),
  seo: z.object({
    metaTitle: z.string().trim().min(1).max(70),
    metaDescription: z.string().trim().min(1).max(170),
    canonical: canonicalSchema,
    robots: z.string().trim().min(1).max(60).default("index,follow"),
    ogTitle: z.string().trim().max(90).optional().default(""),
    ogDescription: z.string().trim().max(220).optional().default(""),
    ogImage: ogImageSchema,
    siteName: z.string().trim().min(1).max(100).default(defaultSiteContent.settings.siteName),
    locale: z.string().trim().min(2).max(12).default("pl_PL"),
    pages: z
      .object({
        start: routeSeoSchema,
        projects: routeSeoSchema,
        faq: routeSeoSchema,
        contact: routeSeoSchema,
        portfolio: routeSeoSchema,
        "opisz-strone": routeSeoSchema,
        "polityka-prywatnosci": routeSeoSchema,
      })
      .default(defaultSiteContent.seo.pages),
  }),
  hero: z.object({
    eyebrow: z.string().trim().max(120),
    title: z.string().trim().min(1).max(160),
    highlightedTitle: z.string().trim().min(1).max(120),
    description: z.string().trim().min(1).max(700),
    primaryCta: ctaSchema,
    secondaryCta: ctaSchema,
    briefCta: ctaSchema.optional().default(defaultSiteContent.hero.briefCta),
    stats: z
      .array(
        z.object({
          value: z.string().trim().min(1).max(20),
          label: z.string().trim().min(1).max(80),
        }),
      )
      .max(4),
  }),
  services: sectionHeadingSchema.extend({
    items: z
      .array(
        z.object({
          icon: iconKeySchema,
          title: z.string().trim().min(1).max(100),
          text: z.string().trim().min(1).max(400),
        }),
      )
      .min(1)
      .max(8),
  }),
  audience: sectionHeadingSchema.extend({
    items: z.array(featureCardSchema).min(1).max(6),
  }),
  automationQa: sectionHeadingSchema.extend({
    certificateNote: z.string().trim().max(220).default(""),
    ctaLabel: z.string().trim().min(1).max(60),
    ctaHref: z.string().trim().min(1).max(220),
    secondaryCtaLabel: z.string().trim().max(60).default(""),
    secondaryCtaHref: z.string().trim().max(220).default(""),
    cards: z.array(featureCardSchema).min(1).max(6),
  }),
  gamedevTeaser: sectionHeadingSchema.extend({
    ctaLabel: z.string().trim().min(1).max(60),
    ctaHref: z.string().trim().min(1).max(220),
    cards: z.array(featureCardSchema).min(1).max(6),
  }),
  benefits: sectionHeadingSchema.extend({
    items: z.array(z.string().trim().min(1).max(140)).min(1).max(12),
  }),
  process: sectionHeadingSchema.extend({
    items: z
      .array(
        z.object({
          step: z.string().trim().min(1).max(8),
          title: z.string().trim().min(1).max(100),
          text: z.string().trim().min(1).max(360),
        }),
      )
      .min(1)
      .max(8),
  }),
  portfolio: sectionHeadingSchema.extend({
    items: z
      .array(
        z.object({
          type: z.string().trim().min(1).max(80).optional().default("Projekt"),
          title: z.string().trim().min(1).max(100),
          text: z.string().trim().min(1).max(360),
          details: z.string().trim().max(420).optional().default(""),
          status: z
            .enum([
              "realizacja",
              "projekt demo",
              "koncepcja",
              "prototyp",
              "projekt własny",
              "projekt wlasny",
              "projekt koncepcyjny",
            ])
            .optional()
            .default("projekt koncepcyjny"),
          category: z.string().trim().max(80).optional().default(""),
          tags: z.array(z.string().trim().min(1).max(40)).max(8).optional().default([]),
          href: z.string().trim().max(240).optional().default(""),
          linkLabel: z.string().trim().max(80).optional().default("Zobacz projekt"),
          screenshotUrl: z.string().trim().max(300).optional().default(""),
          mockupTone: z.enum(["cyan", "violet", "blue", "emerald"]).optional().default("cyan"),
          mockupScale: z.number().min(0.8).max(1.8).optional().default(1),
          demoItems: z
            .array(
              z.object({
                name: z.string().trim().min(1).max(100),
                description: z.string().trim().min(1).max(300),
                tags: z.array(z.string().trim().min(1).max(40)).max(6).optional().default([]),
                href: z.string().trim().max(240).optional().default("#"),
                linkLabel: z.string().trim().max(80).optional().default("Zobacz demo"),
                status: z.string().trim().max(40).optional().default(""),
              }),
            )
            .max(8)
            .optional()
            .default([]),
        }),
      )
      .min(1)
      .max(12),
  }),
  pages: z.object({
    webCms: editablePageSchema,
    qaAutomation: editablePageSchema,
    gamedev: editablePageSchema,
    portfolio: editablePageSchema,
  }),
  packages: sectionHeadingSchema.extend({
    note: z.string().trim().max(360).optional().default(""),
    items: z
      .array(
        z.object({
          name: z.string().trim().min(1).max(100),
          price: z.string().trim().max(80).optional().default(""),
          desc: z.string().trim().min(1).max(360),
          forWhom: z.string().trim().max(260).optional().default(""),
          points: z.array(z.string().trim().min(1).max(80)).min(1).max(8),
          ctaLabel: z.string().trim().max(80).optional().default("Zapytaj o zakres"),
          ctaHref: z.string().trim().max(220).optional().default("#contact"),
          highlighted: z.boolean().optional().default(false),
        }),
      )
      .min(1)
      .max(6),
  }),
  whyMe: sectionHeadingSchema.extend({
    items: z.array(featureCardSchema).min(1).max(6),
  }),
  faq: sectionHeadingSchema.extend({
    items: z
      .array(
        z.object({
          question: z.string().trim().min(1).max(180),
          answer: z.string().trim().min(1).max(800),
        }),
      )
      .min(1)
      .max(12),
  }),
  contact: sectionHeadingSchema.extend({
    email: z.string().trim().email().max(120),
    phone: z.string().trim().max(40),
    www: z.string().trim().max(120),
    address: z.string().trim().max(180),
    emailButtonLabel: z.string().trim().min(1).max(80),
    phoneButtonLabel: z.string().trim().min(1).max(80),
  }),
};

export const siteContentSchema = z.object({
  schemaVersion: z.literal(CONTENT_SCHEMA_VERSION),
  settings: sectionSchemas.settings,
  seo: sectionSchemas.seo,
  hero: sectionSchemas.hero,
  services: sectionSchemas.services,
  audience: sectionSchemas.audience,
  automationQa: sectionSchemas.automationQa,
  gamedevTeaser: sectionSchemas.gamedevTeaser,
  benefits: sectionSchemas.benefits,
  process: sectionSchemas.process,
  portfolio: sectionSchemas.portfolio,
  pages: sectionSchemas.pages,
  packages: sectionSchemas.packages,
  whyMe: sectionSchemas.whyMe,
  faq: sectionSchemas.faq,
  contact: sectionSchemas.contact,
});

export function getCollectionForKey(key) {
  if (key === "seo") return "seo";
  if (key === "settings") return "settings";
  return "page_sections";
}

export function validateSectionData(key, data) {
  const schema = sectionSchemas[key];
  if (!schema) {
    throw new Error(`Unknown content section: ${key}`);
  }
  return schema.parse(data);
}

export function normalizeSiteContent(candidate) {
  const candidatePages = candidate?.pages || {};
  const candidateSeo = candidate?.seo || {};
  const candidatePortfolio = candidate?.portfolio;
  const candidatePortfolioItems = Array.isArray(candidatePortfolio?.items)
    ? candidatePortfolio.items.filter((item) => !retiredPortfolioTitles.has(item?.title))
    : [];
  const candidatePortfolioTitles = new Set(
    candidatePortfolioItems.map((item) => item?.title).filter(Boolean),
  );
  const portfolio = candidatePortfolio
    ? {
        ...defaultSiteContent.portfolio,
        ...candidatePortfolio,
        items: [
          ...candidatePortfolioItems,
          ...defaultSiteContent.portfolio.items.filter(
            (item) => item?.title && !candidatePortfolioTitles.has(item.title),
          ),
        ],
      }
    : defaultSiteContent.portfolio;
  const pages = {
    ...defaultSiteContent.pages,
    ...candidatePages,
    webCms: candidatePages.webCms || defaultSiteContent.pages.webCms,
    qaAutomation:
      candidatePages.qaAutomation ||
      candidatePages.automationTesting ||
      candidatePages.istqbTesting ||
      defaultSiteContent.pages.qaAutomation,
    gamedev: candidatePages.gamedev || defaultSiteContent.pages.gamedev,
    portfolio: candidatePages.portfolio || defaultSiteContent.pages.portfolio,
  };
  const seo = {
    ...defaultSiteContent.seo,
    ...candidateSeo,
    pages: {
      ...defaultSiteContent.seo.pages,
      ...(candidateSeo.pages || {}),
    },
  };

  return siteContentSchema.parse({
    ...defaultSiteContent,
    ...candidate,
    seo,
    pages,
    portfolio,
    schemaVersion: CONTENT_SCHEMA_VERSION,
  });
}
