import { define, publicationsSchema } from "./schema";

/**
 * Publications.
 *
 * Mirrors the resume, which now states the headline results and that the paper
 * is under review at EMNLP 2026. Still no methodology detail and no link to the
 * research code until the paper is public. See VERIFICATION.md section 2.
 */
export const publications = define(
  publicationsSchema,
  [
    {
      id: "personalized-sycophancy",
      title:
        "Personalized Sycophancy: How Conversational Context Causes LLMs to Abandon Honest Social Judgments",
      authors: ["Rishiraj Nagarajan"],
      venue: "Under review at EMNLP 2026",
      year: "2026",
      sortKey: "2026-04",
      status: "under-review",
      advisor: "Prof. Maarten Sap",
      affiliation: "Carnegie Mellon University, Language Technologies Institute",
      abstract:
        "Sycophancy is usually measured in a single turn: a user states a position and the model agrees. Real advice conversations run longer, and the consequential failure is gradual. SocialDrift is a 100-case benchmark that measures the shift as a trajectory across five-turn dialogues and identifies where honest judgment gives way.",
      findings: [
        "Models' \"you were right\" judgments rose from 1% to 24% over five turns, with the facts held constant.",
        "Of 36K judgments analyzed, conversation context accounted for 64% of the drift, and self-justification was the strongest trigger.",
        "On 100 Reddit AITA posts, the benchmark's judgments reached 73% agreement with crowd labels.",
      ],
      links: [],
      // Results available on request. Add a preprint or arXiv link here once the
      // paper is public, and get advisor sign-off before that point.
    },
  ],
  "content/research.ts",
);
