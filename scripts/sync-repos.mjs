#!/usr/bin/env node
/**
 * Regenerates src/content/repos.ts from the GitHub API.
 *
 * The design handoff calls for repo data to be fetched at build time and
 * committed, not called from the browser, so this is a manual step you run when
 * the repo list changes rather than something the app does at runtime.
 *
 *   npm run sync:repos
 *
 * Uses GITHUB_TOKEN if present (raises the rate limit from 60/hr to 5,000/hr
 * and is required to see private repos). Works unauthenticated for public ones.
 *
 * CATEGORY and RARITY below are hand-maintained. The API carries neither.
 * Anything not listed falls back to category "fun" and rarity "common", which
 * is the right default for coursework and experiments.
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const USER = "rishirajFS";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "../src/content/repos.ts");

const CATEGORY = {
  ml: [
    "vllm-kv-tier", "llm-sycophancy", "self-healing-agent", "self-healing-agent-test",
    "pokerai", "idlhw4", "llmsyshw4", "llmsyshw_redo", "llmsys_hw3", "llmsyshw3",
    "llmsys_hw1",
  ],
  swe: [
    "claude-session-manager", "pa-broadband-inequality", "cloud-docker-k8s", "cloud-dock",
    "clood", "cloud-p5", "cloud-sql-nosql", "cloud-hw3", "cloud-computing-ELASTICITY",
    "cloud-computing-proj0",
  ],
};

/** Mirrors project tier in projects.ts. [rarity, projectSlug]. */
const RARITY = {
  "vllm-kv-tier": ["legendary", "kv-cache-eviction"],
  // Listed, but deliberately not linked: the paper is unpublished.
  "llm-sycophancy": ["legendary", null],
  "self-healing-agent": ["legendary", "self-healing-agent"],
  pokerai: ["legendary", "poker-ai"],
  "claude-session-manager": ["rare", "claude-session-manager"],
  "pa-broadband-inequality": ["rare", "pa-broadband-inequality"],
};

const CAT = Object.fromEntries(
  Object.entries(CATEGORY).flatMap(([c, names]) => names.map((n) => [n, c])),
);

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

async function gh(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub ${res.status} on ${path}`);
  return res.json();
}

const repos = await gh(`/users/${USER}/repos?per_page=100&sort=pushed`);
console.log(`fetched ${repos.length} repos`);

const rows = [];
for (const r of repos) {
  const langs = await gh(`/repos/${USER}/${r.name}/languages`).catch(() => ({}));
  const total = Object.values(langs).reduce((a, b) => a + b, 0) || 1;
  const languages = Object.entries(langs)
    .map(([name, bytes]) => ({ name, pct: Math.round((bytes * 1000) / total) / 10 }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);

  const [rarity, projectSlug] = RARITY[r.name] ?? ["common", null];
  rows.push({
    name: r.name,
    description: r.description,
    language: r.language,
    pushedAt: r.pushed_at.slice(0, 10),
    createdAt: r.created_at.slice(0, 10),
    stars: r.stargazers_count,
    url: r.html_url,
    defaultBranch: r.default_branch,
    sizeKb: r.size,
    topics: r.topics ?? [],
    languages,
    category: CAT[r.name] ?? "fun",
    rarity,
    projectSlug,
  });
}

const header = `import { define, reposSchema } from "./schema";

/**
 * GitHub repositories, newest push first.
 *
 * GENERATED FILE. Do not edit by hand: run \`npm run sync:repos\`.
 * The category and rarity maps live in scripts/sync-repos.mjs.
 *
 * \`category\` is hand-maintained (the API does not carry it) and falls back to
 * "fun". \`rarity\` mirrors a project's tier in projects.ts, which is what drives
 * the item-frame colour in the inventory: legendary for the four featured
 * builds, rare for the secondary ones, common for coursework and experiments.
 *
 * \`projectSlug\` links a repo to its written page. llm-sycophancy deliberately
 * has none: the paper is unpublished, so that repo is listed but not linked.
 * See VERIFICATION.md section 2.
 */
const data = `;

const footer = ` as const;

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
`;

writeFileSync(OUT, header + JSON.stringify(rows, null, 2) + footer);
console.log(`wrote ${OUT}`);
console.log(
  "categories:",
  ["ml", "swe", "fun"].map((c) => `${c}=${rows.filter((r) => r.category === c).length}`).join(" "),
);
