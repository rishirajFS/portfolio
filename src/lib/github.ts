/**
 * Optional live GitHub stats.
 *
 * Server-side only, revalidated hourly. Every function degrades to `null`
 * rather than throwing. An unauthenticated rate-limit or a renamed repo must
 * never break a page render. Set GITHUB_TOKEN in the environment to raise the
 * rate limit from 60/hr to 5,000/hr (a read-only, no-scope token is enough).
 */

const REVALIDATE_SECONDS = 60 * 60;

export type RepoStats = {
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  pushedAt: string;
  topics: string[];
  htmlUrl: string;
};

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

async function ghFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`https://api.github.com${path}`, {
      headers: headers(),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** `owner/name` → stats, or null if unavailable. */
export async function getRepoStats(repo: string): Promise<RepoStats | null> {
  type Payload = {
    full_name: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    pushed_at: string;
    topics?: string[];
    html_url: string;
  };

  const data = await ghFetch<Payload>(`/repos/${repo}`);
  if (!data) return null;

  return {
    fullName: data.full_name,
    description: data.description,
    stars: data.stargazers_count,
    forks: data.forks_count,
    language: data.language,
    pushedAt: data.pushed_at,
    topics: data.topics ?? [],
    htmlUrl: data.html_url,
  };
}

/** Resolves several repos at once, dropping the ones that fail. */
export async function getManyRepoStats(
  repos: string[],
): Promise<Record<string, RepoStats>> {
  const settled = await Promise.all(repos.map((r) => getRepoStats(r)));
  const out: Record<string, RepoStats> = {};
  settled.forEach((stats, i) => {
    if (stats) out[repos[i]] = stats;
  });
  return out;
}

/** Language byte counts, largest first. */
export async function getRepoLanguages(
  repo: string,
): Promise<Array<{ name: string; bytes: number; share: number }> | null> {
  const data = await ghFetch<Record<string, number>>(`/repos/${repo}/languages`);
  if (!data) return null;

  const total = Object.values(data).reduce((a, b) => a + b, 0);
  if (total === 0) return [];

  return Object.entries(data)
    .map(([name, bytes]) => ({ name, bytes, share: bytes / total }))
    .sort((a, b) => b.bytes - a.bytes);
}
