import { define, publicationsSchema } from "./schema";

/**
 * Publications.
 *
 * DELIBERATELY BRIEF while unpublished. This entry carries only what already
 * circulates in the resume: the title, the advisor, a plain-language abstract,
 * and three high-level findings. No statistics, no methodology detail, and no
 * link to the research code. Do not expand from the repo before the paper is
 * out. See VERIFICATION.md section 2.
 */
export const publications = define(
  publicationsSchema,
  [
    {
      id: "personalized-sycophancy",
      title:
        "Personalized Sycophancy: How Conversational Context Causes LLMs to Abandon Honest Social Judgments",
      authors: ["Rishiraj Nagarajan"],
      venue: "In preparation",
      year: "2026",
      sortKey: "2026-04",
      status: "in-preparation",
      advisor: "Prof. Maarten Sap",
      affiliation: "Carnegie Mellon University, Language Technologies Institute",
      abstract:
        "Sycophancy is usually measured in a single turn: a user states a position and the model agrees. Real advice conversations run longer, and the consequential failure is gradual. This introduces a 100-scenario benchmark that measures the shift as a trajectory and identifies where in a conversation honest judgment gives way.",
      findings: [
        "Judgment drifts measurably across a multi-turn conversation even when the underlying facts never change.",
        "The self-justification turn, where a user begins defending their own behaviour, is the point most associated with that drift.",
      ],
      links: [],
      // Results available on request. Add a preprint or arXiv link here once the
      // paper is public, and get advisor sign-off before that point.
    },
  ],
  "content/research.ts",
);
