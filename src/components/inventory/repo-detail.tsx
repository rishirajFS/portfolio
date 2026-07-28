import { PixelButtonLink } from "@/components/pixel/button";
import {
  Subpanel,
  Tooltip,
  TooltipDim,
  TooltipMuted,
  TooltipTitle,
} from "@/components/pixel/panel";
import { repos, repoStats, type Repo } from "@/content";
import { cn } from "@/lib/cn";
import { languageColor, rarityColor, rarityLabel } from "@/lib/languages";

/**
 * Inventory column 3: the item card for the selected repo.
 *
 * One repo is deliberately unlinkable. llm-sycophancy backs a paper that is not
 * published yet, so the code is not public: this component renders a note in
 * place of the GitHub button and never emits a link to it. See the comment in
 * content/repos.ts and VERIFICATION.md section 2.
 */
const UNPUBLISHED_REPO = "llm-sycophancy";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * "2026-04-29" -> "Apr 2026", parsed from the string rather than via Date, so
 * the label cannot shift a month between a UTC server and a local browser.
 */
export function pushedLabel(iso: string): string {
  const [year, month] = iso.split("-");
  const name = MONTHS[Number(month) - 1];
  return name ? `${name} ${year}` : year;
}

/** "rishirajFS/vllm-kv-tier", read off the repo URL rather than hardcoded. */
export function repoPath(repo: Repo): string {
  try {
    return new URL(repo.url).pathname.replace(/^\/+/, "");
  } catch {
    return repo.name;
  }
}

/** "github.com/rishirajFS", also read off the data. */
function ownerHome(): string {
  const first = repos[0];
  if (!first) return "github.com";
  try {
    const url = new URL(first.url);
    const owner = url.pathname.split("/").filter(Boolean)[0];
    return owner ? `${url.host}/${owner}` : url.host;
  } catch {
    return "github.com";
  }
}

const OWNER_HOME = ownerHome();

function LanguageBar({ repo }: { repo: Repo }) {
  const parts = repo.languages.filter((lang) => lang.pct > 0);

  if (parts.length === 0) {
    return (
      <span className="font-display text-2xs leading-normal text-chrome-dim">
        No language data
      </span>
    );
  }

  return (
    <>
      <div
        role="img"
        aria-label={parts
          .map((lang) => `${lang.name} ${lang.pct} percent`)
          .join(", ")}
        className="flex w-full pixelated"
        style={{ height: 12, boxShadow: "0 0 0 2px #4a4a4a" }}
      >
        {parts.map((lang) => (
          <span
            key={lang.name}
            className="block h-full"
            style={{
              width: `${lang.pct}%`,
              backgroundColor: languageColor(lang.name),
            }}
          />
        ))}
      </div>

      <ul aria-hidden className="flex flex-wrap gap-x-3 gap-y-1">
        {parts.map((lang) => (
          <li key={lang.name} className="flex items-center gap-1">
            <span
              className="block pixelated"
              style={{
                width: 8,
                height: 8,
                backgroundColor: languageColor(lang.name),
              }}
            />
            <span className="font-display text-2xs leading-none text-chrome">
              {lang.name} {lang.pct}%
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

export function RepoDetail({
  repo,
  className,
}: {
  repo: Repo;
  className?: string;
}) {
  const isUnpublished = repo.name === UNPUBLISHED_REPO;

  return (
    <div
      className={cn(
        "flex min-h-0 shrink-0 flex-col gap-2 overflow-y-auto",
        className,
      )}
    >
      <Tooltip solid className="flex flex-col gap-1.5" style={{ padding: 12 }}>
        <TooltipTitle>{repo.name}</TooltipTitle>

        {repo.description ? (
          <TooltipMuted>{repo.description}</TooltipMuted>
        ) : (
          <TooltipDim>No description set</TooltipDim>
        )}

        <p
          className="font-display text-xs leading-relaxed"
          style={{ color: rarityColor(repo.rarity) }}
        >
          {rarityLabel(repo.rarity)}
        </p>

        <div className="flex items-center gap-2">
          <span
            className="block pixelated"
            style={{
              width: 10,
              height: 10,
              backgroundColor: languageColor(repo.language),
            }}
          />
          <span className="font-display text-xs leading-none text-[#d8d8e8]">
            {repo.language ?? "No language"}
          </span>
        </div>

        <p className="font-display text-xs leading-relaxed text-gold">
          {repo.defaultBranch} · pushed {pushedLabel(repo.pushedAt)}
        </p>
      </Tooltip>

      <Subpanel className="flex flex-col gap-2" style={{ padding: 12 }}>
        <span className="font-display text-2xs uppercase leading-none text-chrome-dim">
          Languages
        </span>
        <LanguageBar repo={repo} />
      </Subpanel>

      {/* 4px of breathing room so the buttons' black rings do not collide with
          the panel bevel. */}
      <div className="flex flex-col gap-2 px-1">
        {isUnpublished ? (
          <Subpanel style={{ padding: 12 }}>
            <p className="font-display text-2xs leading-relaxed text-chrome">
              The paper behind this one is not published yet, so the code is not
              public. The write-up goes up when the paper does.
            </p>
          </Subpanel>
        ) : (
          <PixelButtonLink
            href={repo.url}
            external
            variant="primary"
            size="base"
            className="w-full"
          >
            Open on GitHub
          </PixelButtonLink>
        )}

        {repo.projectSlug && (
          <PixelButtonLink
            href={`/projects/${repo.projectSlug}`}
            variant="secondary"
            size="base"
            className="w-full"
          >
            Read the write-up
          </PixelButtonLink>
        )}
      </div>

      <p className="mt-auto pt-2 font-display text-2xs leading-relaxed text-chrome-soft">
        {repoStats.repos} repos synced from {OWNER_HOME}
      </p>
    </div>
  );
}
