/**
 * Content schemas.
 *
 * Every content file in this directory is validated against these at module
 * load, so a typo in a slug or a missing required field fails the build rather
 * than shipping a broken page. Types are inferred from the schemas, never
 * declared separately, so they cannot drift.
 */

import { z } from "zod";

/* ---------------------------------------------------------------- primitives */

const slug = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase kebab-case");

const url = z.string().url();

/** Free-form date label, e.g. "Jan 2026", "May 2026", "Present". */
const dateLabel = z.string().min(3);

/**
 * ISO-ish sort key so timelines order correctly regardless of label prose.
 * Day precision is optional and exists only to break ties between entries that
 * started in the same month (higher day sorts first, see byRecency).
 */
const sortKey = z
  .string()
  .regex(/^\d{4}-\d{2}(?:-\d{2})?$/, 'must be "YYYY-MM" or "YYYY-MM-DD"');

export const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  /** Named icon; resolved by components/ui/icon.tsx. */
  icon: z
    .enum([
      "github",
      "linkedin",
      "mail",
      "phone",
      "file",
      "external",
      "paper",
      "demo",
      "docs",
      "pr",
    ])
    .optional(),
  external: z.boolean().default(false),
});

export const metricSchema = z.object({
  /** The number itself, pre-formatted. "39.6%", "80,730", "~2 min". */
  value: z.string().min(1),
  /** What it measures. Short. "P99 TTFT reduction". */
  label: z.string().min(1),
  /** Optional qualifier: baseline, hardware, sample size. */
  note: z.string().optional(),
  /** Nudges the number up visually in featured treatments. */
  emphasis: z.boolean().default(false),
});

/* ------------------------------------------------------------------ sections */

export const siteSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  role: z.string().min(1),
  /** One line at the very top of the page. Under ~100 chars reads best. */
  headline: z.string().min(1),
  /** Two or three sentences under the headline. */
  subheadline: z.string().min(1),
  location: z.string().min(1),
  availability: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  bio: z.object({ short: z.string().min(1), long: z.string().min(1) }),
  /** The thread connecting the work. Rendered in About. */
  throughLine: z.string().min(1),
  resumePath: z.string().min(1),
  /** Canonical origin, no trailing slash. Used for OG tags and sitemap. */
  siteUrl: url,
  socials: z.array(linkSchema).min(1),
  /** Ordered nav. `href` may be an in-page anchor or a route. */
  nav: z.array(z.object({ label: z.string(), href: z.string() })).min(1),
});

export const educationSchema = z.object({
  institution: z.string().min(1),
  location: z.string().min(1),
  degree: z.string().min(1),
  start: dateLabel.optional(),
  end: dateLabel,
  sortKey,
  expected: z.boolean().default(false),
  coursework: z.array(z.string()).default([]),
  honors: z.array(z.string()).default([]),
});

export const experienceSchema = z.object({
  id: slug,
  org: z.string().min(1),
  /** Parenthetical context, e.g. "General Catalyst-backed". */
  orgNote: z.string().optional(),
  orgUrl: url.optional(),
  role: z.string().min(1),
  location: z.string().optional(),
  start: dateLabel,
  end: dateLabel,
  sortKey,
  current: z.boolean().default(false),
  /** One-sentence framing above the bullets. */
  blurb: z.string().optional(),
  bullets: z.array(z.string()).min(1),
  tags: z.array(z.string()).default([]),
});

export const projectTier = z.enum(["featured", "secondary", "minor"]);

export const projectSchema = z.object({
  slug,
  /** Short noun phrase. "Prefix cache eviction", not a sentence. */
  title: z.string().min(1),
  /**
   * The context line, mid-dot separated: discipline, then where it happened.
   * "ML systems · CMU 11-868 · three-person team". This carries the framing that
   * used to be spread across a tagline, a status badge and a date range.
   */
  kind: z.string().min(1),
  tier: projectTier,
  /** Grouping label for filters. */
  category: z.enum([
    "ml-systems",
    "research",
    "agents",
    "applied-ml",
    "data",
    "tools",
  ]),
  start: dateLabel,
  end: dateLabel.optional(),
  sortKey,
  status: z.enum(["active", "shipped", "in-review", "archived", "in-progress"]),

  /**
   * The whole description. ONE paragraph, opening with a verb, 55 words or
   * fewer. This is the only prose most visitors read, so it states what was
   * built and the fact that makes it interesting, and nothing else.
   *
   * The 55-word ceiling is enforced, not advisory. It replaced five separate
   * prose blocks (summary, problem, approach, architecture, technicalDepth)
   * that between them ran to 500 words on the longest project, and the cap is
   * the only thing stopping them growing back.
   */
  description: z
    .string()
    .min(1)
    .refine((v) => v.trim().split(/\s+/).length <= 55, {
      message: "description must be 55 words or fewer, see the field doc",
    }),

  /**
   * The detail page's one extra paragraph: the thing a sharp engineer would
   * actually want to know. 70 words or fewer. Omit it rather than pad it.
   */
  note: z
    .string()
    .refine((v) => v.trim().split(/\s+/).length <= 70, {
      message: "note must be 70 words or fewer",
    })
    .optional(),

  metrics: z.array(metricSchema).default([]),
  stack: z.array(z.string()).default([]),
  links: z.array(linkSchema).default([]),
  /** GitHub `owner/name`, enables live stats via lib/github.ts. */
  repo: z.string().regex(/^[\w.-]+\/[\w.-]+$/).optional(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  /** Set when a claim could not be verified from source. Dev-only surface. */
  caveats: z.string().optional(),
});

export const publicationSchema = z.object({
  id: slug,
  title: z.string().min(1),
  authors: z.array(z.string()).min(1),
  /** e.g. "In preparation", "Under review", "NeurIPS 2026". */
  venue: z.string().min(1),
  year: z.string().min(4),
  sortKey,
  advisor: z.string().optional(),
  affiliation: z.string().optional(),
  abstract: z.string().optional(),
  /** Headline findings, kept short. */
  findings: z.array(z.string()).default([]),
  links: z.array(linkSchema).default([]),
  status: z.enum(["in-preparation", "under-review", "published"]),
});

export const skillGroupSchema = z.object({
  name: z.string().min(1),
  /** Ordered by demonstrated depth, not alphabetically. */
  skills: z.array(z.string()).min(1),
  note: z.string().optional(),
});

/** Item rarity, borrowed from the game grammar. Drives inventory frame colour. */
export const rarity = z.enum(["legendary", "rare", "common"]);

export const repoSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  language: z.string().nullable(),
  pushedAt: z.string(),
  createdAt: z.string(),
  stars: z.number(),
  url: url,
  defaultBranch: z.string(),
  sizeKb: z.number(),
  topics: z.array(z.string()).default([]),
  languages: z
    .array(z.object({ name: z.string(), pct: z.number() }))
    .default([]),
  category: z.enum(["ml", "swe", "fun"]),
  rarity,
  /** Slug of the written project page, when one exists. */
  projectSlug: z.string().nullable(),
});

export const courseworkClusterSchema = z.object({
  id: slug,
  name: z.string().min(1),
  course: z.string().optional(),
  description: z.string().min(1),
  language: z.string().optional(),
  repos: z.array(z.object({ name: z.string(), href: url })).default([]),
});

/* --------------------------------------------------------------- collections */

export const projectsSchema = z.array(projectSchema).superRefine((list, ctx) => {
  const seen = new Set<string>();
  for (const [i, p] of list.entries()) {
    if (seen.has(p.slug)) {
      ctx.addIssue({
        code: "custom",
        path: [i, "slug"],
        message: `duplicate project slug "${p.slug}"`,
      });
    }
    seen.add(p.slug);
  }
});

export const experiencesSchema = z.array(experienceSchema);
export const educationsSchema = z.array(educationSchema);
export const publicationsSchema = z.array(publicationSchema);
export const skillGroupsSchema = z.array(skillGroupSchema).min(1);
export const courseworkClustersSchema = z.array(courseworkClusterSchema);
export const reposSchema = z.array(repoSchema);

/* -------------------------------------------------------------------- types */

export type Link = z.infer<typeof linkSchema>;
export type Metric = z.infer<typeof metricSchema>;
export type Site = z.infer<typeof siteSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type ProjectTier = z.infer<typeof projectTier>;
export type ProjectCategory = Project["category"];
export type Publication = z.infer<typeof publicationSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type CourseworkCluster = z.infer<typeof courseworkClusterSchema>;
export type Repo = z.infer<typeof repoSchema>;
export type Rarity = z.infer<typeof rarity>;

/* ------------------------------------------------------------------ helpers */

/**
 * Validate a content collection, failing loudly with the offending path.
 * Called by each content module so errors surface at build time.
 */
export function define<S extends z.ZodType>(
  schema: S,
  value: unknown,
  label: string,
): z.output<S> {
  const result = schema.safeParse(value);
  if (!result.success) {
    const detail = result.error.issues
      .map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid content in "${label}":\n${detail}`);
  }
  return result.data;
}

/** Newest first. */
export function byRecency<T extends { sortKey: string }>(a: T, b: T): number {
  return b.sortKey.localeCompare(a.sortKey);
}
