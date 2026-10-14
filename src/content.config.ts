import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const articles = defineCollection({
  loader: glob({ pattern: "{nl,en}/**/*.{md,mdx}", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: z.enum(["nl", "en"]),
    slug: z.string(),
    translation_key: z.string(),
    alternate_path: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    last_reviewed: z.coerce.date(),
    evidence_certainty: z.enum(["higher", "moderate", "low", "very-low", "not-applicable"]),
    content_type: z.enum(["foundation", "evidence-review", "research-explainer", "safety-guide", "video"]),
    tags: z.array(z.string()).default([]),
    reviewer: z.string().default(""),
    conflicts: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
