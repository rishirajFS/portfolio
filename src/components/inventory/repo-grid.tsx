"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

import {
  ItemChip,
  PanelHeading,
  Slot,
  Tooltip,
  TooltipDim,
  TooltipMuted,
  TooltipTitle,
} from "@/components/pixel/panel";
import {
  recentRepos,
  reposIn,
  type Repo,
  type RepoCategoryId,
} from "@/content";
import { cn } from "@/lib/cn";
import { languageColor, rarityColor, rarityLabel } from "@/lib/languages";

import { repoPath } from "./repo-detail";

/**
 * Inventory column 2: the repo grid.
 *
 * Four labelled sections of 80px item cells, a terminal-prompt search field, and
 * a hover tooltip portalled to the body so the cell's own `overflow: hidden`
 * cannot clip it.
 */

/** A viewport rect, kept as plain numbers rather than a live DOMRect. */
export type CellRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

/**
 * The hovered cell, plus the two rects the tooltip needs to place itself: its
 * own, and the grid column it must stay inside. Both are captured on hover, so
 * rendering the tooltip never has to measure anything.
 */
export type HoveredRepo = {
  repo: Repo;
  rect: CellRect;
  bounds: CellRect | null;
} | null;

const SEARCH_ID = "inventory-search";
const CELL = 80;
const CHIP = 26;
const TIP_WIDTH = 284;

/** Spec offset: the tooltip opens from inside the cell, down and to the right. */
const TIP_OFFSET_X = 64;
const TIP_OFFSET_Y = 44;
const TIP_MARGIN = 8;

type Section = { id: string; label: string; items: Repo[] };

const SECTIONS: Section[] = [
  { id: "recent", label: "Recently pushed", items: [...recentRepos] },
  { id: "ml", label: "Machine learning", items: reposIn("ml") },
  { id: "swe", label: "Software engineering", items: reposIn("swe") },
  { id: "fun", label: "Just for fun", items: reposIn("fun") },
];

function matches(repo: Repo, tab: RepoCategoryId, query: string): boolean {
  if (tab !== "all" && repo.category !== tab) return false;

  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  return (
    repo.name.toLowerCase().includes(needle) ||
    (repo.description ?? "").toLowerCase().includes(needle)
  );
}

function toRect(element: HTMLElement): CellRect {
  const box = element.getBoundingClientRect();
  return { left: box.left, top: box.top, right: box.right, bottom: box.bottom };
}

/* ---------------------------------------------------------------- item cell */

function RepoCell({
  repo,
  selected,
  onSelect,
  onShow,
  onHide,
}: {
  repo: Repo;
  selected: boolean;
  onSelect: (repo: Repo) => void;
  onShow: (repo: Repo, cell: HTMLElement, viaPointer: boolean) => void;
  onHide: () => void;
}) {
  // Legendary and rare repos wear their rarity as a 2px inset frame, so the
  // featured builds read as loot rather than as more of the same grey.
  const frame =
    repo.rarity === "common"
      ? undefined
      : `inset 0 0 0 2px ${rarityColor(repo.rarity)}`;

  // Slot is frozen and takes no event handlers, so the real <button> lives
  // inside it and fills it: the slot keeps the bevel, the hover lightening and
  // the selection outline, the button keeps the semantics.
  return (
    <Slot
      interactive
      selected={selected}
      className="overflow-hidden"
      style={{ height: CELL, boxSizing: "border-box", boxShadow: frame }}
    >
      <button
        type="button"
        data-repo-cell={repo.name}
        aria-label={`${repo.name}, ${repo.language ?? "no language"}, ${rarityLabel(repo.rarity)}`}
        aria-current={selected ? "true" : undefined}
        onClick={() => onSelect(repo)}
        onMouseEnter={(event) => onShow(repo, event.currentTarget, true)}
        onMouseLeave={onHide}
        onFocus={(event) => onShow(repo, event.currentTarget, false)}
        onBlur={onHide}
        className="flex size-full cursor-pointer flex-col items-center justify-center overflow-hidden text-center"
        style={{ gap: 5, padding: 4, boxSizing: "border-box" }}
      >
        <ItemChip color={languageColor(repo.language)} size={CHIP} />
        <span
          aria-hidden
          className="font-display"
          style={{
            fontSize: "var(--text-cell)",
            lineHeight: 1.35,
            color: "#f2f2f2",
            textShadow: "1px 1px 0 #3a3a3a",
            overflowWrap: "anywhere",
          }}
        >
          {repo.name}
        </span>
      </button>
    </Slot>
  );
}

/* ------------------------------------------------------------ hover tooltip */

function HoverTooltip({
  hovered,
  onDismiss,
}: {
  hovered: HoveredRepo;
  onDismiss: () => void;
}) {
  // Any scroll or resize invalidates the captured rect, so drop the tip rather
  // than leave it stranded. Capture phase catches the grid's own scroller.
  useEffect(() => {
    if (!hovered) return;
    window.addEventListener("scroll", onDismiss, true);
    window.addEventListener("resize", onDismiss);
    return () => {
      window.removeEventListener("scroll", onDismiss, true);
      window.removeEventListener("resize", onDismiss);
    };
  }, [hovered, onDismiss]);

  // Never true during SSR: nothing can be hovered before hydration, so the
  // portal and the window reads below are always client-side.
  if (!hovered) return null;

  const { repo, rect: cell, bounds } = hovered;
  const viewW = window.innerWidth;
  const viewH = window.innerHeight;

  // Open to the right; flip left when the tip would leave the grid column.
  const limitRight = Math.min(bounds?.right ?? viewW, viewW - TIP_MARGIN);
  let left = cell.left + TIP_OFFSET_X;
  if (left + TIP_WIDTH > limitRight) {
    left = cell.right - TIP_OFFSET_X - TIP_WIDTH;
  }
  left = Math.max(
    TIP_MARGIN,
    Math.min(left, viewW - TIP_WIDTH - TIP_MARGIN),
  );

  // Open downward; flip up for cells low in the viewport. Anchoring the flipped
  // tip by its bottom edge means the height never has to be measured.
  const flipUp = cell.top + TIP_OFFSET_Y > viewH * 0.55;
  const vertical = flipUp
    ? { bottom: Math.max(TIP_MARGIN, viewH - cell.top + TIP_MARGIN) }
    : { top: Math.max(TIP_MARGIN, cell.top + TIP_OFFSET_Y) };

  return createPortal(
    <div
      aria-hidden
      className="pointer-events-none fixed"
      style={{ left, width: TIP_WIDTH, zIndex: 60, ...vertical }}
    >
      <Tooltip className="flex flex-col gap-1" style={{ padding: "10px 12px" }}>
        <TooltipTitle>{repo.name}</TooltipTitle>
        {repo.description ? (
          <TooltipMuted>{repo.description}</TooltipMuted>
        ) : (
          <TooltipDim>No description set</TooltipDim>
        )}
        <TooltipMuted>
          {repo.language ?? "No language"} · {repo.defaultBranch}
        </TooltipMuted>
        <TooltipDim>{repoPath(repo)}</TooltipDim>
      </Tooltip>
    </div>,
    document.body,
  );
}

/* --------------------------------------------------------------- the column */

export function RepoGrid({
  activeTab,
  query,
  onQueryChange,
  selected,
  onSelect,
  hovered,
  onHoverChange,
  className,
}: {
  activeTab: RepoCategoryId;
  query: string;
  onQueryChange: (next: string) => void;
  selected: Repo;
  onSelect: (repo: Repo) => void;
  hovered: HoveredRepo;
  onHoverChange: (next: HoveredRepo) => void;
  className?: string;
}) {
  const columnRef = useRef<HTMLDivElement | null>(null);
  const gridsRef = useRef<HTMLDivElement | null>(null);

  const show = useCallback(
    (repo: Repo, cell: HTMLElement, viaPointer: boolean) => {
      // Coarse pointers have nothing to hover with, and a tooltip that latches
      // on tap is worse than no tooltip. Keyboard focus still opens it, but only
      // when the focus ring is showing, so a tap does not trigger it either.
      if (viaPointer) {
        if (!window.matchMedia("(pointer: fine)").matches) return;
      } else if (!cell.matches(":focus-visible")) {
        return;
      }

      const column = columnRef.current;
      onHoverChange({
        repo,
        rect: toRect(cell),
        bounds: column ? toRect(column) : null,
      });
    },
    [onHoverChange],
  );

  const hide = useCallback(() => onHoverChange(null), [onHoverChange]);

  const visible = SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((repo) => matches(repo, activeTab, query)),
  })).filter((section) => section.items.length > 0);

  /** Arrow keys walk the cells. Enter is the button's own default. */
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const horizontal = event.key === "ArrowLeft" || event.key === "ArrowRight";
    const vertical = event.key === "ArrowUp" || event.key === "ArrowDown";
    if (!horizontal && !vertical) return;

    const root = gridsRef.current;
    const active = document.activeElement;
    if (!root || !(active instanceof HTMLElement)) return;

    const cells = Array.from(
      root.querySelectorAll<HTMLButtonElement>("[data-repo-cell]"),
    );
    const index = cells.indexOf(active as HTMLButtonElement);
    if (index < 0) return;

    let step = 1;
    if (vertical) {
      // Read the real column count so this keeps working when the grid reflows
      // to fewer than six columns.
      const grid = active.closest("[data-cells]");
      const columns = grid
        ? window
            .getComputedStyle(grid)
            .gridTemplateColumns.split(" ")
            .filter(Boolean).length
        : 0;
      step = Math.max(1, columns);
    }

    const delta =
      event.key === "ArrowLeft" || event.key === "ArrowUp" ? -step : step;
    const next = cells[index + delta];
    if (!next) return;

    event.preventDefault();
    next.focus();
  };

  return (
    <div
      ref={columnRef}
      className={cn("flex min-h-0 shrink-0 flex-col gap-2", className)}
    >
      {/* Search: a real input in an inset slot, dressed as a terminal prompt. */}
      <label htmlFor={SEARCH_ID} className="sr-only">
        Search repos by name or description
      </label>
      {/* mr-3 keeps the field's right edge in line with the grid below it,
          which sits 12px short of the column because of the scrollbar gutter. */}
      <Slot
        className="flex shrink-0 items-center gap-2 min-[1180px]:mr-3"
        style={{ height: 32, paddingInline: 8 }}
      >
        <span
          aria-hidden
          className="font-display leading-none text-[#e8e8e8]"
          style={{ fontSize: "var(--text-sm)" }}
        >
          &gt;
        </span>
        <input
          id={SEARCH_ID}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="search repos"
          autoComplete="off"
          spellCheck={false}
          className="w-full bg-transparent font-display leading-none text-[#e8e8e8] outline-none placeholder:text-[#5f5f5f]"
          style={{ fontSize: "var(--text-sm)" }}
        />
      </Slot>

      <div
        ref={gridsRef}
        onKeyDown={onKeyDown}
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto"
      >
        {visible.length === 0 ? (
          <div className="flex flex-col gap-1 py-4">
            <p className="font-display text-xs leading-relaxed text-chrome-soft">
              Nothing in this bag matches.
            </p>
            <p className="font-display text-2xs leading-relaxed text-chrome-dim">
              Try a shorter search, or switch to ALL.
            </p>
          </div>
        ) : (
          visible.map((section) => (
            <section key={section.id} className="flex flex-col gap-1">
              <PanelHeading
                className="[&>span:first-child]:normal-case [&>span:first-child]:text-xs"
                right={section.items.length}
              >
                {section.label}
              </PanelHeading>
              {/* Six 80px cells at the design width, exactly 500px. Narrower
                  than that it fits as many 80px cells as it can, centred, so
                  the cells never land on a fractional pixel and soften the
                  bevels. */}
              <div
                data-cells
                className="grid grid-cols-[repeat(auto-fill,80px)] justify-center gap-1 min-[1180px]:grid-cols-[repeat(6,80px)] min-[1180px]:justify-start"
              >
                {section.items.map((repo) => (
                  <RepoCell
                    key={`${section.id}-${repo.name}`}
                    repo={repo}
                    selected={selected.name === repo.name}
                    onSelect={onSelect}
                    onShow={show}
                    onHide={hide}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      <HoverTooltip hovered={hovered} onDismiss={hide} />
    </div>
  );
}
