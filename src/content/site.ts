import { define, siteSchema } from "./schema";

/**
 * Site-level identity and navigation.
 *
 * House style: the first sentence of anything here has to land for a reader with
 * no ML background. No em dashes; use a period, a comma, a colon, or parentheses.
 */
export const site = define(
  siteSchema,
  {
    name: "Rishiraj Nagarajan",
    shortName: "Rishiraj",
    role: "Machine Learning Engineer",

    // The hero says what the work is, then lists it with numbers. No adjectives:
    // the projects are the argument, this is just the index.
    headline: "ML systems, applied LLMs, and evaluation that can say no.",
    heroWords: ["Rishiraj", "builds", "systems"],
    subheadline:
      "I've shipped ML systems since 2025. That includes a cache eviction policy co-authored for SGLang that cut P99 first-token latency 37.7% in benchmarks, a benchmark showing LLM honesty drifting from 1% to 24% over five turns of conversation, an RL environment for agents facing silently changing APIs, and shared memory that saved 300 user-hours a month.",

    location: "Pittsburgh, PA",
    availability: "Open to Summer 2027 and full-time roles from Dec 2026",

    highlights: [
      "CMU MCDS, Dec 2026",
      "Different Labs ML intern",
      "SGLang eviction policy",
      "EMNLP 2026, under review",
    ],

    email: "rishi.nagarajan.work@gmail.com",
    phone: "(412) 339-6925",

    // One bio, not two. The old pair ran to 160 words and the long one mostly
    // restated the project list that is already on the page.
    bio: {
      short:
        "Machine learning engineer finishing a Master of Computational Data Science at Carnegie Mellon in December 2026. Most recently an ML intern at Different Labs. I work at the seam between a model and the system serving it.",
      long: "I work at the seam between a model and the system serving it: cache eviction for inference, memory that keeps generation pipelines from repeating mistakes, agents that adapt when their tools change. Alongside that I research language model sycophancy at the Language Technologies Institute and TA the LLM Systems course.",
    },

    // Cut from 105 words. The examples it listed are all on the page already.
    throughLine:
      "I distrust the measurement before I distrust the model. A speedup is cheap; the harness that lets it fail is the expensive part, so I build that first and report what it says, including when it says the effect was smaller than I hoped.",

    resumePath: "/Rishiraj_Nagarajan_Resume.pdf",

    // Drives OG tags, canonical URLs, sitemap.xml and robots.txt. Currently the
    // Vercel alias; swap in the real domain once one is registered and nothing
    // else needs to change.
    siteUrl: "https://rishinagarajan.vercel.app",

    socials: [
      {
        label: "GitHub",
        href: "https://github.com/rishirajFS",
        icon: "github",
        external: true,
      },
      {
        label: "LinkedIn",
        href: "https://linkedin.com/in/rishirajn",
        icon: "linkedin",
        external: true,
      },
      {
        label: "Email",
        href: "mailto:rishi.nagarajan.work@gmail.com",
        icon: "mail",
      },
      {
        label: "Résumé",
        href: "/Rishiraj_Nagarajan_Resume.pdf",
        icon: "file",
      },
    ],

    nav: [
      { label: "Work", href: "/#experience" },
      { label: "Projects", href: "/#projects" },
      { label: "Research", href: "/#research" },
      { label: "Stack", href: "/#skills" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  "content/site.ts",
);
