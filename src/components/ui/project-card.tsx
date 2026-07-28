import Link from "next/link";
import type { ReactNode } from "react";

import { ItemChip, Panel, PanelHeading, Slot, Subpanel } from "@/components/pixel/panel";
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

const STATUS_LABEL: Record<Project["status"], string> = {
  active: "Active",
  "in-progress": "In progress",
  "in-review": "Under review",
  shipped: "Shipped",
  archived: "Archived",
};

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

/** The meta line every card carries: rarity, status, dates. */
function ItemMeta({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <RarityTag rarity={rarityForTier(project.tier)} />
      <span className="emboss font-display text-2xs uppercase text-chrome-soft">
        {STATUS_LABEL[project.status]}
      </span>
      <span className="font-display text-2xs text-chrome-dim">
        {dateRange(project.start, project.end)}
      </span>
    </div>
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
 * Featured project: the write-up panel beside its stat block.
 * `index` renders the counter and decides which side the stats sit on.
 */
export function FeaturedProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const flip = index % 2 === 1;

  return (
    <article className="group relative">
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`${project.title}: ${project.tagline}`}
      />

      <div
        className={cn(
          "grid items-start gap-4 lg:grid-cols-12",
          flip && "lg:[&>*:first-child]:order-2",
        )}
      >
        {/* Write-up */}
        <Panel className="flex flex-col gap-3 p-4 group-hover:brightness-105 lg:col-span-7">
          <div className="flex items-start gap-3">
            <ItemFrame project={project} size={56} />
            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex items-baseline gap-2">
                <span
                  className="font-display text-2xs text-chrome-dim"
                  data-numeric
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="emboss font-display text-md leading-snug text-chrome">
                  {project.title}
                </h3>
              </div>
              <ItemMeta project={project} />
            </div>
          </div>

          <p className="font-display text-xs leading-normal text-chrome-soft">
            {project.tagline}
          </p>

          {/* The reading face, because three sentences of Silkscreen is a wall. */}
          <p className="font-read text-base leading-relaxed text-chrome-soft">
            {project.summary}
          </p>

          <StackSlots items={project.stack} max={7} className="mt-1" />

          <div className="mt-1">
            <OpenLabel>Read the write-up</OpenLabel>
          </div>
        </Panel>

        {/* Stat block. Stands in for a screenshot until one exists. */}
        <Panel className="flex flex-col gap-3 p-4 group-hover:brightness-105 lg:col-span-5">
          <PanelHeading
            right={
              project.metrics.length > 0
                ? `${Math.min(project.metrics.length, 4)} recorded`
                : undefined
            }
          >
            {project.metrics.length > 0 ? "Stats" : "Item"}
          </PanelHeading>

          {project.metrics.length > 0 ? (
            <div className="flex flex-col gap-1">
              {project.metrics.slice(0, 4).map((metric) => (
                <StatRow key={metric.label} metric={metric} />
              ))}
            </div>
          ) : (
            <Slot className="flex min-h-[176px] items-center justify-center">
              <ItemChip color={projectChipColor(project)} size={48} bob />
            </Slot>
          )}
        </Panel>
      </div>
    </article>
  );
}

/** Compact card for the grid. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative h-full">
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`${project.title}: ${project.tagline}`}
      />

      <Panel className="flex h-full flex-col gap-3 p-3 group-hover:brightness-105">
        <div className="flex items-start gap-3">
          <ItemFrame project={project} size={48} />
          <div className="flex min-w-0 flex-col gap-2">
            <h3 className="emboss font-display text-base leading-snug text-chrome">
              {project.title}
            </h3>
            <RarityTag rarity={rarityForTier(project.tier)} />
          </div>
        </div>

        <p className="font-display text-2xs leading-normal text-chrome-soft">
          {project.tagline}
        </p>

        {project.metrics.length > 0 && (
          <div className="flex flex-col gap-1">
            {project.metrics.slice(0, 2).map((metric) => (
              <StatRow key={metric.label} metric={metric} size="sm" />
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-col gap-3 pt-1">
          <StackSlots items={project.stack} max={4} />
          <OpenLabel>Open</OpenLabel>
        </div>
      </Panel>
    </article>
  );
}

/** One-line entry for work with no detail page. */
export function ProjectRow({ project }: { project: Project }) {
  return (
    <Subpanel className="mt-1 flex flex-col gap-1 px-3 py-2 first:mt-0 sm:flex-row sm:items-baseline sm:gap-4">
      <span className="flex items-center gap-2 sm:w-56 sm:shrink-0">
        <ItemChip color={projectChipColor(project)} size={10} />
        <span className="emboss font-display text-xs leading-snug text-chrome">
          {project.title}
        </span>
      </span>
      <span className="flex-1 font-display text-2xs leading-normal text-chrome-soft">
        {project.tagline}
      </span>
      <span className="font-display text-2xs text-chrome-dim sm:shrink-0">
        {dateRange(project.start, project.end)}
      </span>
    </Subpanel>
  );
}
