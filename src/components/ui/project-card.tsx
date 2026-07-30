import Link from "next/link";
import type { ReactNode } from "react";

import { ItemChip, Panel, Slot, Subpanel } from "@/components/pixel/panel";
import type { Metric, Project, ProjectTier, Rarity } from "@/content";
import { cn } from "@/lib/cn";
import { dateRange } from "@/lib/format";
import { languageColor, rarityColor, rarityLabel } from "@/lib/languages";

/**
 * Project cards, in the GUI language.
 *
 * A project is a piece of loot: it sits in an item slot, it has a rarity frame,
 * and its numbers read as a stat block. The three exported cards are the three
 * sizes that loot comes in.
 *
 *   FeaturedProjectCard  two panels: the write-up and its stat block.
 *   ProjectCard          one panel, grid sized.
 *   ProjectRow           a single subpanel row, for work with no detail page.
 *
 * The small pieces (rarity tag, stat row, item frame) are exported because the
 * project detail page builds the same item out of them at a larger size, and
 * the tier-to-rarity mapping must not drift between the two.
 */

/** Item rarity mirrors project tier. This is what colours every frame. */
export function rarityForTier(tier: ProjectTier): Rarity {
  if (tier === "featured") return "legendary";
  if (tier === "secondary") return "rare";
  return "common";
}

/**
 * The chip colour for a project: the first stack entry linguist has a colour
 * for, so "Python" reads blue rather than every card being the unknown gray.
 */
function projectChipColor(project: Project): string {
  const unknown = languageColor(null);
  const known = project.stack.find((s) => languageColor(s) !== unknown);
  return languageColor(known);
}

/**
 * Rarity plate. Gold on the light panel face would be unreadable, so the tag
 * carries its own dark backing, which is also how a game draws a rarity line.
 */
export function RarityTag({
  rarity,
  className,
}: {
  rarity: Rarity;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block border-[3px] px-1.5 py-1 font-display text-2xs uppercase leading-none",
        className,
      )}
      style={{
        backgroundColor: "var(--tooltip-bg-solid)",
        borderColor: rarityColor(rarity),
        color: rarityColor(rarity),
      }}
    >
      {rarityLabel(rarity)}
    </span>
  );
}

/** The item slot: a chip in an inset hole, framed in the rarity colour. */
export function ItemFrame({
  project,
  size = 56,
  className,
}: {
  project: Project;
  size?: number;
  className?: string;
}) {
  return (
    <Slot
      className={cn("flex shrink-0 items-center justify-center", className)}
      style={{
        width: size,
        height: size,
        // Drawn inside the slot, like the hotbar's selection outline, so the
        // rarity frame never shifts layout by a pixel.
        outline: `3px solid ${rarityColor(rarityForTier(project.tier))}`,
        outlineOffset: -3,
      }}
    >
      <ItemChip color={projectChipColor(project)} size={Math.round(size / 2)} />
    </Slot>
  );
}

/** A number in a recessed dark readout. Gold needs a dark surface to read on. */
const VALUE_SIZE = {
  sm: "text-2xs",
  base: "text-xs",
  lg: "text-base",
} as const;

function StatValue({
  children,
  size = "base",
}: {
  children: ReactNode;
  size?: keyof typeof VALUE_SIZE;
}) {
  return (
    <span
      data-numeric
      className={cn(
        "shrink-0 whitespace-nowrap border-[3px] px-1.5 py-1 font-display leading-none text-gold",
        VALUE_SIZE[size],
      )}
      style={{
        backgroundColor: "var(--panel-ring)",
        borderColor: "#000000 #4a4a4a #4a4a4a #000000",
      }}
    >
      {children}
    </span>
  );
}

/** One line of the stat block: label left, value right, qualifier under it. */
export function StatRow({
  metric,
  size = "base",
}: {
  metric: Metric;
  size?: "sm" | "base";
}) {
  return (
    <Subpanel className="px-2 py-2">
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "emboss min-w-0 font-display uppercase leading-snug text-chrome-soft",
            size === "sm" ? "text-2xs" : "text-xs",
          )}
        >
          {metric.label}
        </span>
        {/* `emphasis` is set per metric in content: the number the project is
            actually about gets one step more type. */}
        <StatValue
          size={metric.emphasis ? (size === "sm" ? "base" : "lg") : size}
        >
          {metric.value}
        </StatValue>
      </div>
      {metric.note && (
        <p className="mt-1 font-display text-2xs leading-normal text-chrome-dim">
          {metric.note}
        </p>
      )}
    </Subpanel>
  );
}

/** Stack entries as little item slots. The label treatment is the repo-cell one. */
function StackSlots({
  items,
  max,
  className,
}: {
  items: readonly string[];
  max?: number;
  className?: string;
}) {
  if (items.length === 0) return null;
  const shown = max ? items.slice(0, max) : items;
  const hidden = max ? items.length - shown.length : 0;

  return (
    <ul className={cn("flex flex-wrap gap-1", className)}>
      {shown.map((item) => (
        <li key={item}>
          <Slot className="flex h-7 items-center gap-1.5 px-1.5">
            <ItemChip color={languageColor(item)} size={10} />
            <span
              className="font-display text-2xs leading-none"
              style={{ color: "#f2f2f2", textShadow: "1px 1px 0 #3a3a3a" }}
            >
              {item}
            </span>
          </Slot>
        </li>
      ))}
      {hidden > 0 && (
        <li>
          <Slot className="flex h-7 items-center px-1.5">
            <span
              className="font-display text-2xs leading-none"
              style={{ color: "#d8d8d8" }}
              data-numeric
            >
              +{hidden}
            </span>
          </Slot>
        </li>
      )}
    </ul>
  );
}

/**
 * The context line: discipline, where it happened, dates. Mid-dot separated,
 * one line, no wrapping onto four rows of badges. This replaced a rarity plate,
 * a status word and a date range stacked on top of each other.
 */
function KindLine({ project }: { project: Project }) {
  return (
    <p className="font-display text-2xs leading-normal text-chrome-dim">
      {project.kind}
      <span aria-hidden className="mx-1.5">
        ·
      </span>
      {dateRange(project.start, project.end)}
    </p>
  );
}

/**
 * The stat line: every number on one row, separated by mid-dots.
 *
 * The stat block treatment (label above, value in a recessed readout) is still
 * used on detail pages via StatRow, where there is room for it. In a card it
 * cost three lines per metric, so cards get this instead: the numbers, inline,
 * scannable in one pass.
 */
export function StatLine({
  metrics,
  className,
  /**
   * Which surface this sits on. The label colour has to flip: `chrome-soft` is
   * #3a3a3a, which is correct on the #c6c6c6 panel face and nearly invisible on
   * the dark readout. Defaults to "dark" because that is where cards put it.
   */
  tone = "dark",
}: {
  metrics: readonly Metric[];
  className?: string;
  tone?: "dark" | "light";
}) {
  if (metrics.length === 0) return null;

  const label = tone === "dark" ? "text-[#b4b4c0]" : "text-chrome-soft";
  const sep = tone === "dark" ? "text-[#6a6a78]" : "text-chrome-dim";

  return (
    <p className={cn("font-display text-2xs leading-relaxed", className)}>
      {metrics.map((m, i) => (
        <span key={m.label}>
          {i > 0 && (
            <span aria-hidden className={cn("mx-1.5", sep)}>
              ·
            </span>
          )}
          <span data-numeric className="text-gold">
            {m.value}
          </span>{" "}
          <span className={label}>{m.label.toLowerCase()}</span>
        </span>
      ))}
    </p>
  );
}

/** The "go read it" line. A label, not a button: the whole card is the link. */
function OpenLabel({ children }: { children: ReactNode }) {
  return (
    <span className="emboss font-display text-2xs uppercase leading-none text-chrome-soft duration-fast group-hover:text-chrome">
      {children}{" "}
      <span aria-hidden>{">"}</span>
    </span>
  );
}

/**
 * Featured project. One panel: numbered title, context line, the paragraph, the
 * stat line, the stack.
 *
 * Previously two panels side by side, one holding five prose blocks and the
 * other a four-cell stat grid. With the description capped at 55 words there is
 * nothing to justify the split, and a single column reads faster.
 */
export function FeaturedProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article className="group relative">
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`${project.title}: ${project.description}`}
      />

      <Panel className="p-4 duration-fast group-hover:brightness-105 sm:p-5">
        <div className="flex items-start gap-4">
          <ItemFrame project={project} size={56} />

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span
                data-numeric
                className="font-display text-2xs text-chrome-dim"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="emboss font-display text-base leading-snug text-chrome">
                {project.title}
              </h3>
            </div>
            <KindLine project={project} />
          </div>
        </div>

        {/* The one paragraph. On the dark readout because that is where prose is
            legible in this theme. */}
        <div
          className="mt-4 border-[3px] p-3 sm:p-4"
          style={{
            backgroundColor: "var(--panel-ring)",
            borderColor: "#000000 #4a4a4a #4a4a4a #000000",
          }}
        >
          <p className="prose-site !text-[13px]">{project.description}</p>
          <StatLine metrics={project.metrics} className="mt-3" />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <StackSlots items={project.stack} max={6} />
          <OpenLabel>Read</OpenLabel>
        </div>
      </Panel>
    </article>
  );
}

/** Grid card. Same anatomy, tighter, no counter. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative h-full">
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`${project.title}: ${project.description}`}
      />

      <Panel className="flex h-full flex-col p-4 duration-fast group-hover:brightness-105">
        <div className="flex items-start gap-3">
          <ItemFrame project={project} size={44} />
          <div className="min-w-0 flex-1">
            <h3 className="emboss font-display text-xs leading-snug text-chrome">
              {project.title}
            </h3>
            <KindLine project={project} />
          </div>
        </div>

        <div
          className="mt-3 border-[3px] p-3"
          style={{
            backgroundColor: "var(--panel-ring)",
            borderColor: "#000000 #4a4a4a #4a4a4a #000000",
          }}
        >
          <p className="prose-site !text-[12px]">{project.description}</p>
          <StatLine metrics={project.metrics.slice(0, 3)} className="mt-2" />
        </div>

        <div className="mt-auto pt-3">
          <StackSlots items={project.stack} max={4} />
        </div>
      </Panel>
    </article>
  );
}

/** One row, for work with no detail page. */
export function ProjectRow({ project }: { project: Project }) {
  return (
    <Subpanel className="flex flex-col gap-1 px-3 py-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <span className="emboss font-display text-2xs uppercase text-chrome">
          {project.title}
        </span>
        <span className="font-display text-2xs text-chrome-dim">
          {project.kind}
        </span>
      </div>
      <p className="font-display text-2xs leading-relaxed text-chrome-soft">
        {project.description}
      </p>
      <StatLine metrics={project.metrics} tone="light" />
    </Subpanel>
  );
}
