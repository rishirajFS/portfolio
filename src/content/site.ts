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
    role: "ML Systems Engineer",

    headline: "I build LLM systems, then try to prove they actually work.",
    subheadline:
      "ML systems engineer and master's candidate at Carnegie Mellon. I work on making language models cheaper to serve, agent pipelines that survive production, and evaluation honest enough to tell me when I'm wrong.",

    location: "Pittsburgh, PA",
    availability: "Open to Summer 2027 and full-time roles from Dec 2026",

    email: "rishi.nagarajan.work@gmail.com",
    phone: "(412) 339-6925",

    bio: {
      short:
        "ML systems engineer at Different Labs and a master's candidate at Carnegie Mellon. I work where model quality meets serving cost: cache eviction, agent pipelines, and evaluation that survives contact with reality.",
      long: "I'm finishing a Master of Computational Data Science at Carnegie Mellon in December 2026, and I work as an ML systems engineer at Different Labs. Most of what I do sits at the seam between a model and the system serving it: cache eviction policies for LLM inference, a pipeline that learns editing preferences from human edits and gates them behind a verifier, an agent that reads production error logs and opens pull requests. Alongside that I research language model sycophancy at the Language Technologies Institute, where I built a benchmark for how conversation erodes honest judgment. The recurring theme is measurement. I care less about a number going up than about whether it was measured in a way that could have gone down.",
    },

    throughLine:
      "I distrust the measurement before I distrust the model. In each of these projects the load-bearing work was the thing that could have falsified the result: a cross-validation split that broke a published benchmark and left me with an honest baseline instead of a good number, a verifier that re-reads every proposed rule's cited evidence against the source before the rule is allowed to influence anything, a benchmark designed to attribute an effect rather than just observe it, and a cache study whose real finding was that the code path I was optimizing never ran. A speedup is cheap. The harness that lets it fail is the expensive part, so I build that first and report what it says.",

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
