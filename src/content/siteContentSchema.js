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

const iconKeySchema = z.enum(["monitor", "palette", "sparkles", "globe", "check"]);

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

const pageSeoSchema = z.object({
  title: z.string().trim().min(1).max(75),
  description: z.string().trim().min(1).max(180),
  ogTitle: z.string().trim().max(90).optional().default(""),
  ogDescription: z.string().trim().max(220).optional().default(""),
});

const pageHeroSchema = z.object({
  eyebrow: z.string().trim().max(80).default(""),
  title: z.string().trim().min(1).max(140),
  subtitle: z.string().trim().max(160).default(""),
  description: z.string().trim().min(1).max(700),
  ctaLabel: z.string().trim().min(1).max(60),
  ctaHref: z.string().trim().min(1).max(220),
});

const editablePageSchema = z.object({
  slug: z.string().trim().min(1).max(80),
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
  }),
  hero: z.object({
    eyebrow: z.string().trim().max(120),
    title: z.string().trim().min(1).max(160),
    highlightedTitle: z.string().trim().min(1).max(120),
    description: z.string().trim().min(1).max(700),
    primaryCta: ctaSchema,
    secondaryCta: ctaSchema,
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
        }),
      )
      .min(1)
      .max(12),
  }),
  pages: z.object({
    webCms: editablePageSchema,
    qaAutomation: editablePageSchema,
    gamedev: editablePageSchema,
  }),
  packages: sectionHeadingSchema.extend({
    items: z
      .array(
        z.object({
          name: z.string().trim().min(1).max(100),
          desc: z.string().trim().min(1).max(360),
          points: z.array(z.string().trim().min(1).max(80)).min(1).max(8),
          highlighted: z.boolean().optional().default(false),
        }),
      )
      .min(1)
      .max(6),
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
  automationQa: sectionSchemas.automationQa,
  gamedevTeaser: sectionSchemas.gamedevTeaser,
  benefits: sectionSchemas.benefits,
  process: sectionSchemas.process,
  portfolio: sectionSchemas.portfolio,
  pages: sectionSchemas.pages,
  packages: sectionSchemas.packages,
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
  };

  return siteContentSchema.parse({
    ...defaultSiteContent,
    ...candidate,
    pages,
    schemaVersion: CONTENT_SCHEMA_VERSION,
  });
}
