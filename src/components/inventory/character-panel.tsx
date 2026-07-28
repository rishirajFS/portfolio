import { ItemChip, Slot, Subpanel } from "@/components/pixel/panel";
import { repos, repoStats, site } from "@/content";
import { cn } from "@/lib/cn";
import { languageColor } from "@/lib/languages";

/**
 * Inventory column 1: the character sheet.
 *
 * Everything here is derived from content, never typed in twice:
 *   - the name and the "class" line come from site
 *   - the equipped languages are the four Rishi actually writes most, by share
 *     of code across every repo
 *   - the stats box is repoStats
 *   - the contribution strip is one square per week, shaded by how many repos
 *     were pushed that week
 *
 * The strip deliberately does NOT use Date.now(). It is anchored to the most
 * recent push in the data, so the same squares render on the server and in the
 * browser, and the graph does not silently drain as the data goes stale.
 */

/* ------------------------------------------------------------ equipped gear */

/** Top languages by share of code across all repos. Ties break alphabetically. */
function topLanguages(count: number): string[] {
  const totals = new Map<string, number>();
  for (const repo of repos) {
    for (const lang of repo.languages) {
      totals.set(lang.name, (totals.get(lang.name) ?? 0) + lang.pct);
    }
  }
  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, count)
    .map(([name]) => name);
}

const EQUIPPED = topLanguages(4);

/* -------------------------------------------------------------- achievements */

/**
 * GitHub profile achievements, per the sync record in docs/PIXEL-HANDOFF.md
 * (section "Column 1 - character"). They have no home in content/ yet; when an
 * achievements collection exists, read them from there instead.
 */
const ACHIEVEMENTS = [
  { label: "YOLO", color: "var(--gold)" },
  { label: "Pull Shark", color: "#3f6ea8" },
] as const;

/* ------------------------------------------------------------- contributions */

const CONTRIB_WEEKS = 52;
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

/** One bucket per week, newest last, counting repos pushed in that week. */
function contributionWeeks(): number[] {
  const stamps = repos
    .map((repo) => Date.parse(`${repo.pushedAt}T00:00:00Z`))
    .filter((ms) => !Number.isNaN(ms));
  const weeks = new Array<number>(CONTRIB_WEEKS).fill(0);
  if (stamps.length === 0) return weeks;

  // Anchor on the newest push in the data, not on today, so the render is
  // deterministic across server and client.
  const anchor = Math.max(...stamps);
  for (const ms of stamps) {
    const weeksBack = Math.floor((anchor - ms) / MS_PER_WEEK);
    if (weeksBack >= 0 && weeksBack < CONTRIB_WEEKS) {
      weeks[CONTRIB_WEEKS - 1 - weeksBack] += 1;
    }
  }
  return weeks;
}

const CONTRIB = contributionWeeks();
const CONTRIB_TOTAL = CONTRIB.reduce((sum, n) => sum + n, 0);

function contribColor(pushes: number): string {
  if (pushes <= 0) return "var(--contrib-0)";
  if (pushes === 1) return "var(--contrib-1)";
  if (pushes === 2) return "var(--contrib-2)";
  return "var(--contrib-3)";
}

/* -------------------------------------------------------------------- pieces */

function StatRow({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="font-display text-xs uppercase leading-none text-chrome">
        {label}
      </span>
      <span
        className="font-display text-xs leading-none text-chrome"
        data-numeric
      >
        {value}
      </span>
    </div>
  );
}

function GearSlots({ size = 52, chip = 24 }: { size?: number; chip?: number }) {
  return (
    <div className="flex flex-wrap gap-1">
      {EQUIPPED.map((lang) => (
        <Slot
          key={lang}
          className="flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <ItemChip color={languageColor(lang)} size={chip} label={lang} />
        </Slot>
      ))}
    </div>
  );
}

function ContributionStrip() {
  return (
    <div
      role="img"
      aria-label={`Push activity: ${CONTRIB_TOTAL} repository pushes over the last ${CONTRIB_WEEKS} weeks.`}
      className="flex flex-wrap"
      style={{ gap: 2 }}
    >
      {CONTRIB.map((pushes, week) => (
        <span
          key={week}
          className="block pixelated"
          style={{
            width: 12,
            height: 12,
            backgroundColor: contribColor(pushes),
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------- full column */

function FullColumn({ className }: { className?: string }) {
  return (
    <div
      className={cn("min-h-0 shrink-0 flex-col gap-2 overflow-y-auto", className)}
      style={{ width: 280 }}
    >
      <div>
        <h3 className="emboss font-display text-base leading-none text-chrome-soft">
          {site.shortName}
        </h3>
        <p className="font-display text-2xs leading-relaxed text-chrome-dim">
          {site.role}
        </p>
      </div>

      {/* Character render. No sprite art exists yet, so this is the documented
          flat-colour placeholder rather than a stock asset. */}
      <Slot
        className="relative flex shrink-0 flex-col items-center justify-center gap-3"
        style={{ height: 268 }}
      >
        <div
          aria-hidden
          className="dither absolute inset-0 opacity-25"
          style={
            {
              "--dither-light": "rgba(255,255,255,.12)",
              "--dither-dark": "rgba(0,0,0,.12)",
            } as React.CSSProperties
          }
        />
        <ItemChip color="var(--primary)" size={48} bob className="relative" />
        <span className="relative font-display text-2xs leading-none text-common">
          SPRITE PENDING
        </span>
      </Slot>

      <div className="flex flex-col gap-1">
        <span className="font-display text-2xs uppercase leading-none text-chrome-dim">
          Equipped
        </span>
        <GearSlots />
      </div>

      <Subpanel className="flex shrink-0 flex-col gap-2" style={{ padding: 12 }}>
        <StatRow label="Repos" value={repoStats.repos} />
        <StatRow label="Stars" value={repoStats.stars} />
        <StatRow label="Languages" value={repoStats.languages} />
      </Subpanel>

      <Subpanel className="flex shrink-0 flex-col gap-2" style={{ padding: 12 }}>
        <span className="font-display text-2xs uppercase leading-none text-chrome-dim">
          Achievements
        </span>
        {ACHIEVEMENTS.map((achievement) => (
          <div key={achievement.label} className="flex items-center gap-2">
            <ItemChip color={achievement.color} size={12} />
            <span className="font-display text-xs leading-none text-chrome">
              {achievement.label}
            </span>
          </div>
        ))}
      </Subpanel>

      <Subpanel className="flex shrink-0 flex-col gap-2" style={{ padding: 12 }}>
        <span className="font-display text-2xs uppercase leading-none text-chrome-dim">
          Last {CONTRIB_WEEKS} weeks
        </span>
        <ContributionStrip />
      </Subpanel>
    </div>
  );
}

/* ----------------------------------------------------------- compact strip */

/**
 * Below the three-column breakpoint the character sheet collapses to one row:
 * name, class, gear, stats. The tall pieces (render slot, achievements, the
 * contribution strip) are dropped rather than squeezed.
 */
function CompactStrip({ className }: { className?: string }) {
  return (
    <Subpanel
      className={cn("shrink-0 flex-wrap items-center gap-x-4 gap-y-2", className)}
      style={{ padding: 8 }}
    >
      <div className="flex items-center gap-2">
        <Slot className="flex items-center justify-center" style={{ width: 32, height: 32 }}>
          <ItemChip color="var(--primary)" size={16} />
        </Slot>
        <div>
          <h3 className="font-display text-sm leading-none text-chrome">
            {site.shortName}
          </h3>
          <p className="font-display text-2xs leading-normal text-chrome-dim">
            {site.role}
          </p>
        </div>
      </div>

      <GearSlots size={32} chip={16} />

      <div className="flex flex-wrap gap-x-3 gap-y-1">
        <span className="font-display text-2xs uppercase leading-none text-chrome">
          {repoStats.repos} repos
        </span>
        <span className="font-display text-2xs uppercase leading-none text-chrome">
          {repoStats.stars} stars
        </span>
        <span className="font-display text-2xs uppercase leading-none text-chrome">
          {repoStats.languages} languages
        </span>
      </div>
    </Subpanel>
  );
}

/**
 * Renders both arrangements and lets CSS pick one, so there is no layout
 * measurement, no hydration mismatch and no flash of the wrong shape.
 */
export function CharacterPanel({ className }: { className?: string }) {
  return (
    <>
      <CompactStrip className={cn("flex min-[1180px]:hidden", className)} />
      <FullColumn className={cn("hidden min-[1180px]:flex", className)} />
    </>
  );
}
