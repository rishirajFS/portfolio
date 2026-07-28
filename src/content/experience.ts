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
        "Teaching a generation system what a human would have changed, and proving the lesson stuck.",
      bullets: [
        "Built a system that learns styling preferences by comparing a first draft to the human-edited final version, then feeds those preferences back in at generation time. A deterministic verifier re-checks each rule's cited evidence against the original edit before the rule is allowed to influence anything.",
        "Validated it with an eval harness measuring how far the output still sits from the human's final version, which is the metric that actually tracks whether a person had to fix it.",
        "Built the weekly pipeline around it on Apache Temporal, pairing a Java/Spring Boot orchestrator with a Python/FastAPI agent whose tool-use loop proposes, reinforces and retires rules by support-count voting.",
        "Shipped a brand-intelligence agent to production on Railway covering Meta, Google and LinkedIn, profiling brand voice from around 150 scraped ads per run. FastAPI, Redis, Postgres, multi-tenant, CI/CD.",
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
        "First author on a paper in preparation about how conversational context causes language models to abandon honest social judgments. Results available on request.",
        "Built a 100-scenario benchmark quantifying that drift across multi-turn advice conversations, and isolated the self-justification turn as the point most associated with it.",
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
        "Trained and benchmarked Random Forest and XGBoost models for national cement demand forecasting. XGBoost came in 15% more accurate by RMSE than the analyst-built Excel baseline it replaced.",
        "Rebuilt the whole workflow end to end, feeding an executive Power BI dashboard with a district-level map of India.",
        "Built the seasonality-aligned feature pipeline on web scrapers I wrote, with SMOTE for class imbalance, and presented the findings directly to the CEO.",
      ],
      tags: ["XGBoost", "scikit-learn", "Power BI", "Web Scraping"],
    },
  ],
  "content/experience.ts",
);
