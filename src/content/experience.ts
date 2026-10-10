import { define, experiencesSchema } from "./schema";

/**
 * Work history, newest first.
 *
 * Mirrors public/Rishiraj_Nagarajan_Resume.pdf. Every number is preserved. If
 * you update the PDF, update these too. No em dashes.
 */
export const experience = define(
  experiencesSchema,
  [
    {
      id: "different-labs",
      org: "Different Labs",
      orgNote: "General Catalyst-backed",
      role: "Machine Learning Engineer Intern",
      start: "May 2026",
      end: "Aug 2026",
      sortKey: "2026-05",
      current: false,
      blurb:
        "Applied-LLM infrastructure for content pipelines serving 10+ organizations.",
      bullets: [
        "Built shared preference memory for Java and Python content pipelines serving 10+ organizations. It removes stale, duplicate or conflicting preferences before generation, preventing repeat client inputs and saving 300 user-hours monthly.",
        "Built Gemini Vision profiles from client posts to condition generated content on color, imagery, layout and text. In LLM-as-a-judge evaluation they scored 47% higher in brand alignment than the legacy direct-LLM web-check pipeline.",
        "Reduced duplicate workflow runs 25% with unique Temporal IDs, MongoDB execution checks and idempotent retries, and grounded editorial checks in source documents with human review and rollback controls.",
      ],
      tags: [
        "Python",
        "Java",
        "Gemini Vision",
        "Temporal",
        "MongoDB",
        "PostgreSQL",
        "Redis",
      ],
    },
    {
      id: "cmu-lti",
      org: "Carnegie Mellon University",
      orgNote: "Language Technologies Institute",
      role: "Graduate Researcher",
      location: "Pittsburgh, PA",
      start: "Apr 2026",
      end: "Present",
      sortKey: "2026-04-15",
      current: true,
      blurb:
        "Measuring how conversation pulls language models away from honest judgment. Advised by Prof. Maarten Sap. Paper under review at EMNLP 2026.",
      bullets: [
        "Built SocialDrift, a 100-case benchmark measuring conversational drift in ambiguous social conflicts. Across five-turn dialogues, LLMs' \"you were right\" judgments rose from 1% to 24%.",
        "Analyzed 36K judgments to isolate drift drivers: conversation context accounted for 64%, with self-justification the strongest trigger. Evaluation on 100 Reddit AITA posts reached 73% agreement with crowd labels.",
      ],
      tags: ["LLM Evaluation", "Benchmark Design", "Statistics"],
    },
    {
      id: "cmu-ta",
      org: "Carnegie Mellon University",
      orgNote: "11-868 Large Language Model Systems",
      role: "Teaching Assistant",
      location: "Pittsburgh, PA",
      start: "Aug 2026",
      end: "Present",
      sortKey: "2026-08",
      current: true,
      bullets: [
        "Taught 120 students CUDA, GPU acceleration, speculative decoding, transformer inference and TPU architectures.",
      ],
      tags: ["CUDA", "GPU Acceleration", "LLM Systems"],
    },
    {
      id: "brandidea",
      org: "Brandidea Granular Analytics",
      role: "Data Science Intern",
      start: "Jan 2025",
      end: "May 2025",
      sortKey: "2025-01",
      current: false,
      blurb:
        "Replaced the spreadsheet a national industry was forecasting demand with.",
      bullets: [
        "Engineered seasonality-aware XGBoost features to forecast cement demand by district, reducing RMSE 15% versus an analyst forecast baseline.",
        "Built a RAG pipeline translating natural-language questions into validated district queries with age, gender, income and education filters. It reached 92% parsing accuracy across 150 queries at sub-2s latency.",
      ],
      tags: ["XGBoost", "AWS Bedrock", "Lambda", "RAG", "Time-series"],
    },
  ],
  "content/experience.ts",
);
