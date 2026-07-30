import { define, experiencesSchema } from "./schema";

/**
 * Work history, newest first.
 *
 * Bullets are tightened from the resume for screen reading. Every number is
 * preserved. If you update the PDF, update these too. No em dashes.
 */
export const experience = define(
  experiencesSchema,
  [
    {
      id: "different-labs",
      org: "Different Labs",
      orgNote: "General Catalyst-backed",
      role: "ML Systems Engineer Intern",
      start: "May 2026",
      end: "Present",
      sortKey: "2026-05",
      current: true,
      blurb:
        "Applied-LLM infrastructure: teaching a generation system what a human would have changed, and proving the lesson stuck.",
      bullets: [
        "Built a system that learns styling preferences by diffing a first draft against the human-edited final version, gated by a verifier that re-checks each rule's cited evidence against the source before it can influence anything.",
        "Built the weekly pipeline on Apache Temporal, pairing a Spring Boot orchestrator with a FastAPI agent that proposes, reinforces and retires rules by support-count voting.",
        "Shipped a multi-platform brand-intelligence agent to production on Railway, profiling brand voice from around 150 scraped ads per run.",
      ],
      tags: [
        "Apache Temporal",
        "LangChain",
        "FastAPI",
        "Spring Boot",
        "Postgres",
        "Redis",
        "Gemini",
        "Railway",
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
        "Measuring how conversation pulls language models away from honest judgment. Advised by Prof. Maarten Sap.",
      bullets: [
        "First author on a paper in preparation. Built a 100-scenario benchmark for multi-turn sycophantic drift and isolated the turn where honesty gives way. Results available on request.",
      ],
      tags: ["LLM Evaluation", "Benchmark Design", "Statistics"],
    },
    {
      id: "cmu-ta",
      org: "Carnegie Mellon University",
      role: "Teaching Assistant",
      location: "Pittsburgh, PA",
      start: "Apr 2026",
      end: "Present",
      sortKey: "2026-04-01",
      current: true,
      bullets: [
        "Support Mathematical Foundations for Computational Data Science, and AI Technicians, an applied-AI and cloud upskilling program delivered to U.S. Army officials.",
      ],
      tags: ["Teaching", "Applied AI", "Cloud"],
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
        "Trained XGBoost for national cement demand forecasting, 15% more accurate by RMSE than the analyst-built Excel baseline it replaced.",
        "Built the feature pipeline on web scrapers I wrote and fed an executive dashboard with a district-level map of India. Presented findings to the CEO.",
      ],
      tags: ["XGBoost", "scikit-learn", "Power BI", "Web Scraping"],
    },
  ],
  "content/experience.ts",
);
