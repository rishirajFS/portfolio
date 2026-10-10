import { define, reposSchema } from "./schema";

/**
 * GitHub repositories, newest push first.
 *
 * GENERATED FILE. Do not edit by hand: run `npm run sync:repos`.
 * The category and rarity maps live in scripts/sync-repos.mjs.
 *
 * `category` is hand-maintained (the API does not carry it) and falls back to
 * "fun". `rarity` mirrors a project's tier in projects.ts, which is what drives
 * the item-frame colour in the inventory: legendary for the four featured
 * builds, rare for the secondary ones, common for coursework and experiments.
 *
 * `projectSlug` links a repo to its written page. llm-sycophancy deliberately
 * has none: the paper is unpublished, so that repo is listed but not linked.
 * See VERIFICATION.md section 2.
 */
const data = [
  {
    "name": "neetcode-submissions",
    "description": "My NeetCode.io problem submissions",
    "language": "Python",
    "pushedAt": "2026-10-04",
    "createdAt": "2026-07-29",
    "stars": 0,
    "url": "https://github.com/rishirajFS/neetcode-submissions",
    "defaultBranch": "main",
    "sizeKb": 72,
    "topics": [],
    "languages": [
      {
        "name": "Python",
        "pct": 100
      }
    ],
    "category": "swe",
    "rarity": "common",
    "projectSlug": null
  },
  {
    "name": "apishift",
    "description": "RL environment + GRPO for tool-use agents adapting to silently evolving APIs",
    "language": "Python",
    "pushedAt": "2026-09-29",
    "createdAt": "2026-09-24",
    "stars": 0,
    "url": "https://github.com/rishirajFS/apishift",
    "defaultBranch": "main",
    "sizeKb": 37268,
    "topics": [],
    "languages": [
      {
        "name": "Python",
        "pct": 98.3
      },
      {
        "name": "Shell",
        "pct": 1.6
      },
      {
        "name": "Makefile",
        "pct": 0.1
      }
    ],
    "category": "ml",
    "rarity": "legendary",
    "projectSlug": "apishift"
  },
  {
    "name": "jev-router",
    "description": "Outcome-based evaluation of Jev as a cost-aware LLM router, on ground-truth benchmarks with three Claude tiers",
    "language": "Python",
    "pushedAt": "2026-09-29",
    "createdAt": "2026-09-29",
    "stars": 0,
    "url": "https://github.com/rishirajFS/jev-router",
    "defaultBranch": "main",
    "sizeKb": 771,
    "topics": [],
    "languages": [
      {
        "name": "Python",
        "pct": 100
      }
    ],
    "category": "ml",
    "rarity": "common",
    "projectSlug": null
  },
  {
    "name": "portfolio",
    "description": null,
    "language": "TypeScript",
    "pushedAt": "2026-07-30",
    "createdAt": "2026-07-28",
    "stars": 0,
    "url": "https://github.com/rishirajFS/portfolio",
    "defaultBranch": "main",
    "sizeKb": 284,
    "topics": [],
    "languages": [
      {
        "name": "TypeScript",
        "pct": 86.5
      },
      {
        "name": "CSS",
        "pct": 11.4
      },
      {
        "name": "JavaScript",
        "pct": 2.1
      }
    ],
    "category": "fun",
    "rarity": "common",
    "projectSlug": null
  },
  {
    "name": "llm-sycophancy",
    "description": null,
    "language": "Python",
    "pushedAt": "2026-04-29",
    "createdAt": "2026-04-20",
    "stars": 0,
    "url": "https://github.com/rishirajFS/llm-sycophancy",
    "defaultBranch": "main",
    "sizeKb": 39795,
    "topics": [],
    "languages": [
      {
        "name": "Python",
        "pct": 99.1
      },
      {
        "name": "Shell",
        "pct": 0.9
      }
    ],
    "category": "ml",
    "rarity": "legendary",
    "projectSlug": null
  },
  {
    "name": "vllm-kv-tier",
    "description": "Tiered KV Cache with Memory Aware Eviction Strategies",
    "language": "Python",
    "pushedAt": "2026-04-15",
    "createdAt": "2026-02-25",
    "stars": 0,
    "url": "https://github.com/rishirajFS/vllm-kv-tier",
    "defaultBranch": "main",
    "sizeKb": 166845,
    "topics": [],
    "languages": [
      {
        "name": "Python",
        "pct": 87.2
      },
      {
        "name": "Cuda",
        "pct": 6.7
      },
      {
        "name": "C++",
        "pct": 4.1
      },
      {
        "name": "Shell",
        "pct": 1.3
      },
      {
        "name": "CMake",
        "pct": 0.3
      }
    ],
    "category": "ml",
    "rarity": "legendary",
    "projectSlug": "kv-cache-eviction"
  },
  {
    "name": "claude-session-manager",
    "description": "macOS daemon that maximizes Claude Pro/Max sessions by auto-starting each 5-hour window at the optimal time",
    "language": "Python",
    "pushedAt": "2026-04-05",
    "createdAt": "2026-04-05",
    "stars": 0,
    "url": "https://github.com/rishirajFS/claude-session-manager",
    "defaultBranch": "main",
    "sizeKb": 20,
    "topics": [],
    "languages": [
      {
        "name": "Python",
        "pct": 92.6
      },
      {
        "name": "Shell",
        "pct": 7.4
      }
    ],
    "category": "swe",
    "rarity": "rare",
    "projectSlug": "claude-session-manager"
  },
  {
    "name": "self-healing-agent",
    "description": null,
    "language": "Python",
    "pushedAt": "2026-04-04",
    "createdAt": "2026-04-04",
    "stars": 0,
    "url": "https://github.com/rishirajFS/self-healing-agent",
    "defaultBranch": "main",
    "sizeKb": 31,
    "topics": [],
    "languages": [
      {
        "name": "Python",
        "pct": 95.9
      },
      {
        "name": "PLpgSQL",
        "pct": 4.1
      }
    ],
    "category": "ml",
    "rarity": "rare",
    "projectSlug": "self-healing-agent"
  },
  {
    "name": "pokerai",
    "description": null,
    "language": "Python",
    "pushedAt": "2026-04-04",
    "createdAt": "2026-04-04",
    "stars": 0,
    "url": "https://github.com/rishirajFS/pokerai",
    "defaultBranch": "main",
    "sizeKb": 3350,
    "topics": [],
    "languages": [
      {
        "name": "Python",
        "pct": 99.2
      },
      {
        "name": "Jupyter Notebook",
        "pct": 0.4
      },
      {
        "name": "Shell",
        "pct": 0.4
      }
    ],
    "category": "ml",
    "rarity": "rare",
    "projectSlug": "poker-ai"
  },
  {
    "name": "self-healing-agent-test",
    "description": "Test repo for self-healing-agent pipeline",
    "language": "Python",
    "pushedAt": "2026-04-01",
    "createdAt": "2026-04-01",
    "stars": 0,
    "url": "https://github.com/rishirajFS/self-healing-agent-test",
    "defaultBranch": "main",
    "sizeKb": 5,
    "topics": [],
    "languages": [
      {
        "name": "Python",
        "pct": 100
      }
    ],
    "category": "ml",
    "rarity": "common",
    "projectSlug": null
  },
  {
    "name": "pa-broadband-inequality",
    "description": "Interactive Streamlit dashboard analyzing broadband inequality across Pennsylvania using Ookla speedtest data, Census demographics, and FCC coverage data",
    "language": "Python",
    "pushedAt": "2026-04-01",
    "createdAt": "2026-04-01",
    "stars": 0,
    "url": "https://github.com/rishirajFS/pa-broadband-inequality",
    "defaultBranch": "master",
    "sizeKb": 2079,
    "topics": [
      "broadband",
      "census-data",
      "data-visualization",
      "digital-divide",
      "interactive-dashboard",
      "pennsylvania",
      "streamlit",
      "xgboost"
    ],
    "languages": [
      {
        "name": "Python",
        "pct": 100
      }
    ],
    "category": "swe",
    "rarity": "rare",
    "projectSlug": "pa-broadband-inequality"
  },
  {
    "name": "llmsyshw4",
    "description": null,
    "language": "Python",
    "pushedAt": "2026-03-09",
    "createdAt": "2026-02-19",
    "stars": 0,
    "url": "https://github.com/rishirajFS/llmsyshw4",
    "defaultBranch": "main",
    "sizeKb": 172,
    "topics": [],
    "languages": [
      {
        "name": "Python",
        "pct": 78.1
      },
      {
        "name": "Cuda",
        "pct": 11.9
      },
      {
        "name": "C++",
        "pct": 9.5
      },
      {
        "name": "Shell",
        "pct": 0.5
      }
    ],
    "category": "ml",
    "rarity": "common",
    "projectSlug": null
  },
  {
    "name": "cloud-p5",
    "description": null,
    "language": null,
    "pushedAt": "2026-03-03",
    "createdAt": "2026-03-03",
    "stars": 0,
    "url": "https://github.com/rishirajFS/cloud-p5",
    "defaultBranch": "main",
    "sizeKb": 0,
    "topics": [],
    "languages": [],
    "category": "swe",
    "rarity": "common",
    "projectSlug": null
  },
  {
    "name": "FettesSchwein.github.io",
    "description": "Trying stuff out",
    "language": "HTML",
    "pushedAt": "2026-02-19",
    "createdAt": "2025-04-01",
    "stars": 0,
    "url": "https://github.com/rishirajFS/FettesSchwein.github.io",
    "defaultBranch": "main",
    "sizeKb": 18167,
    "topics": [],
    "languages": [
      {
        "name": "HTML",
        "pct": 67.8
      },
      {
        "name": "Python",
        "pct": 32.2
      }
    ],
    "category": "fun",
    "rarity": "common",
    "projectSlug": null
  },
  {
    "name": "cloud-sql-nosql",
    "description": null,
    "language": "Java",
    "pushedAt": "2026-02-16",
    "createdAt": "2026-02-16",
    "stars": 0,
    "url": "https://github.com/rishirajFS/cloud-sql-nosql",
    "defaultBranch": "main",
    "sizeKb": 58,
    "topics": [],
    "languages": [
      {
        "name": "Java",
        "pct": 96.6
      },
      {
        "name": "Python",
        "pct": 3.4
      }
    ],
    "category": "swe",
    "rarity": "common",
    "projectSlug": null
  },
  {
    "name": "llmsyshw_redo",
    "description": null,
    "language": "Python",
    "pushedAt": "2026-02-14",
    "createdAt": "2026-02-14",
    "stars": 0,
    "url": "https://github.com/rishirajFS/llmsyshw_redo",
    "defaultBranch": "main",
    "sizeKb": 120561,
    "topics": [],
    "languages": [
      {
        "name": "Python",
        "pct": 93.9
      },
      {
        "name": "Cuda",
        "pct": 6
      },
      {
        "name": "Shell",
        "pct": 0
      }
    ],
    "category": "ml",
    "rarity": "common",
    "projectSlug": null
  },
  {
    "name": "llmsys_hw3",
    "description": null,
    "language": "Python",
    "pushedAt": "2026-02-14",
    "createdAt": "2026-02-12",
    "stars": 0,
    "url": "https://github.com/rishirajFS/llmsys_hw3",
    "defaultBranch": "main",
    "sizeKb": 120518,
    "topics": [],
    "languages": [
      {
        "name": "Python",
        "pct": 94.6
      },
      {
        "name": "Cuda",
        "pct": 5.4
      },
      {
        "name": "Shell",
        "pct": 0
      }
    ],
    "category": "ml",
    "rarity": "common",
    "projectSlug": null
  },
  {
    "name": "cloud-dock",
    "description": null,
    "language": "Java",
    "pushedAt": "2026-02-12",
    "createdAt": "2026-02-07",
    "stars": 0,
    "url": "https://github.com/rishirajFS/cloud-dock",
    "defaultBranch": "main",
    "sizeKb": 74436,
    "topics": [],
    "languages": [
      {
        "name": "Java",
        "pct": 62.1
      },
      {
        "name": "HTML",
        "pct": 24.7
      },
      {
        "name": "JavaScript",
        "pct": 10.9
      },
      {
        "name": "HCL",
        "pct": 1.4
      },
      {
        "name": "Dockerfile",
        "pct": 0.6
      }
    ],
    "category": "swe",
    "rarity": "common",
    "projectSlug": null
  },
  {
    "name": "clood",
    "description": null,
    "language": null,
    "pushedAt": "2026-02-10",
    "createdAt": "2026-02-10",
    "stars": 0,
    "url": "https://github.com/rishirajFS/clood",
    "defaultBranch": "main",
    "sizeKb": 0,
    "topics": [],
    "languages": [],
    "category": "swe",
    "rarity": "common",
    "projectSlug": null
  },
  {
    "name": "cloud-hw3",
    "description": null,
    "language": "Java",
    "pushedAt": "2026-02-06",
    "createdAt": "2026-02-06",
    "stars": 0,
    "url": "https://github.com/rishirajFS/cloud-hw3",
    "defaultBranch": "main",
    "sizeKb": 29267,
    "topics": [],
    "languages": [
      {
        "name": "Java",
        "pct": 84.6
      },
      {
        "name": "HCL",
        "pct": 10.2
      },
      {
        "name": "Mustache",
        "pct": 2.6
      },
      {
        "name": "Dockerfile",
        "pct": 2.5
      }
    ],
    "category": "swe",
    "rarity": "common",
    "projectSlug": null
  },
  {
    "name": "cloud-docker-k8s",
    "description": null,
    "language": "Java",
    "pushedAt": "2026-02-06",
    "createdAt": "2026-02-06",
    "stars": 0,
    "url": "https://github.com/rishirajFS/cloud-docker-k8s",
    "defaultBranch": "main",
    "sizeKb": 45111,
    "topics": [],
    "languages": [
      {
        "name": "Java",
        "pct": 59.3
      },
      {
        "name": "HTML",
        "pct": 27.7
      },
      {
        "name": "JavaScript",
        "pct": 12.2
      },
      {
        "name": "Dockerfile",
        "pct": 0.8
      }
    ],
    "category": "swe",
    "rarity": "common",
    "projectSlug": null
  },
  {
    "name": "llmsyshw3",
    "description": null,
    "language": "Python",
    "pushedAt": "2026-02-04",
    "createdAt": "2026-02-04",
    "stars": 0,
    "url": "https://github.com/rishirajFS/llmsyshw3",
    "defaultBranch": "main",
    "sizeKb": 120522,
    "topics": [],
    "languages": [
      {
        "name": "Python",
        "pct": 94.1
      },
      {
        "name": "Cuda",
        "pct": 5.9
      },
      {
        "name": "Shell",
        "pct": 0
      }
    ],
    "category": "ml",
    "rarity": "common",
    "projectSlug": null
  },
  {
    "name": "cloud-computing-ELASTICITY",
    "description": null,
    "language": "Python",
    "pushedAt": "2026-01-23",
    "createdAt": "2026-01-20",
    "stars": 0,
    "url": "https://github.com/rishirajFS/cloud-computing-ELASTICITY",
    "defaultBranch": "main",
    "sizeKb": 165687,
    "topics": [],
    "languages": [
      {
        "name": "Python",
        "pct": 83.9
      },
      {
        "name": "C++",
        "pct": 10.3
      },
      {
        "name": "Cython",
        "pct": 4.2
      },
      {
        "name": "C",
        "pct": 1.2
      },
      {
        "name": "Java",
        "pct": 0.1
      }
    ],
    "category": "swe",
    "rarity": "common",
    "projectSlug": null
  },
  {
    "name": "llmsys_hw1",
    "description": null,
    "language": null,
    "pushedAt": "2026-01-21",
    "createdAt": "2026-01-21",
    "stars": 0,
    "url": "https://github.com/rishirajFS/llmsys_hw1",
    "defaultBranch": "main",
    "sizeKb": 0,
    "topics": [],
    "languages": [],
    "category": "ml",
    "rarity": "common",
    "projectSlug": null
  },
  {
    "name": "cloud-computing-proj0",
    "description": null,
    "language": "Java",
    "pushedAt": "2026-01-14",
    "createdAt": "2026-01-14",
    "stars": 0,
    "url": "https://github.com/rishirajFS/cloud-computing-proj0",
    "defaultBranch": "main",
    "sizeKb": 45595,
    "topics": [],
    "languages": [
      {
        "name": "Java",
        "pct": 40.8
      },
      {
        "name": "Shell",
        "pct": 30.3
      },
      {
        "name": "Jupyter Notebook",
        "pct": 24.1
      },
      {
        "name": "HCL",
        "pct": 4.8
      }
    ],
    "category": "swe",
    "rarity": "common",
    "projectSlug": null
  },
  {
    "name": "idlhw4",
    "description": "Intro to Deep Learning 11785 HW4",
    "language": "Python",
    "pushedAt": "2025-12-04",
    "createdAt": "2025-12-04",
    "stars": 0,
    "url": "https://github.com/rishirajFS/idlhw4",
    "defaultBranch": "main",
    "sizeKb": 13934,
    "topics": [],
    "languages": [
      {
        "name": "Python",
        "pct": 100
      }
    ],
    "category": "ml",
    "rarity": "common",
    "projectSlug": null
  },
  {
    "name": "trial",
    "description": "Chatbot trial using deepseek r1",
    "language": "HTML",
    "pushedAt": "2025-04-01",
    "createdAt": "2025-04-01",
    "stars": 0,
    "url": "https://github.com/rishirajFS/trial",
    "defaultBranch": "main",
    "sizeKb": 3,
    "topics": [],
    "languages": [
      {
        "name": "HTML",
        "pct": 100
      }
    ],
    "category": "fun",
    "rarity": "common",
    "projectSlug": null
  },
  {
    "name": "rep1",
    "description": null,
    "language": null,
    "pushedAt": "2023-03-01",
    "createdAt": "2023-03-01",
    "stars": 0,
    "url": "https://github.com/rishirajFS/rep1",
    "defaultBranch": "main",
    "sizeKb": 1,
    "topics": [],
    "languages": [],
    "category": "fun",
    "rarity": "common",
    "projectSlug": null
  },
  {
    "name": "github-slideshow",
    "description": "A robot powered training repository :robot:",
    "language": "HTML",
    "pushedAt": "2021-06-02",
    "createdAt": "2021-06-02",
    "stars": 0,
    "url": "https://github.com/rishirajFS/github-slideshow",
    "defaultBranch": "main",
    "sizeKb": 3525,
    "topics": [],
    "languages": [
      {
        "name": "HTML",
        "pct": 56.5
      },
      {
        "name": "Shell",
        "pct": 40.7
      },
      {
        "name": "Ruby",
        "pct": 2.8
      }
    ],
    "category": "fun",
    "rarity": "common",
    "projectSlug": null
  }
] as const;

export const repos = define(reposSchema, data, "content/repos.ts");

/* ------------------------------------------------------------------- queries */

export const repoCategories = [
  { id: "all", label: "ALL" },
  { id: "ml", label: "ML" },
  { id: "swe", label: "SWE" },
  { id: "fun", label: "FUN" },
] as const;

export type RepoCategoryId = (typeof repoCategories)[number]["id"];

export function reposIn(category: RepoCategoryId) {
  return category === "all" ? repos : repos.filter((r) => r.category === category);
}

export function countIn(category: RepoCategoryId) {
  return reposIn(category).length;
}

/** The six most recently pushed, for the inventory's top shelf. */
export const recentRepos = repos.slice(0, 6);

export function getRepo(name: string) {
  return repos.find((r) => r.name === name);
}

/** Totals for the character panel's stats box. */
export const repoStats = {
  repos: repos.length,
  stars: repos.reduce((n, r) => n + r.stars, 0),
  languages: new Set(repos.flatMap((r) => r.languages.map((l) => l.name))).size,
};
