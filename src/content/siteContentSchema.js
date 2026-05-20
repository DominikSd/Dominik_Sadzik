import { z } from "zod";
import { CONTENT_SCHEMA_VERSION, defaultSiteContent } from "./defaultSiteContent";

export const allowedCollections = ["page_sections", "seo", "settings"];
export const editableSectionKeys = ["hero", "services", "faq", "contact", "seo", "settings"];

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
          icon: z.enum(["monitor", "palette", "sparkles", "globe"]),
          title: z.string().trim().min(1).max(100),
          text: z.string().trim().min(1).max(400),
        }),
      )
      .min(1)
      .max(8),
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
          title: z.string().trim().min(1).max(100),
          text: z.string().trim().min(1).max(360),
        }),
      )
      .min(1)
      .max(8),
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
    phone: z.string().trim().min(3).max(40),
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
  benefits: sectionSchemas.benefits,
  process: sectionSchemas.process,
  portfolio: sectionSchemas.portfolio,
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
  return siteContentSchema.parse({
    ...defaultSiteContent,
    ...candidate,
    schemaVersion: CONTENT_SCHEMA_VERSION,
  });
}
