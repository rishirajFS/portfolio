"use client";

import { useEffect, useState } from "react";

import { Panel } from "@/components/pixel/panel";
import { WorldScrim } from "@/components/pixel/world";
import {
  countIn,
  repoCategories,
  repos,
  type Repo,
  type RepoCategoryId,
} from "@/content";
import { cn } from "@/lib/cn";

import { CharacterPanel } from "./character-panel";
import { RepoDetail } from "./repo-detail";
import { RepoGrid, type HoveredRepo } from "./repo-grid";

/**
 * Screen 4a: the inventory.
 *
 * A three-column GUI panel over the dimmed world. Column 1 is the character
 * sheet, column 2 the repo grid, column 3 the selected repo's item card. The
 * tab strip sits ON the panel's top edge: the active tab drops its bottom
 * border and hangs 8px into the panel, over the black ring and the white bevel,
 * so the two surfaces merge into one.
 *
 * Below the three-column breakpoint everything stacks: the character sheet
 * becomes a header strip, the grid reflows to as many 80px cells as fit, and the
 * detail card follows the grid.
 */

/**
 * The spec panel is 1120 wide on the 1240 canvas. It is 20px wider here, and
 * that is deliberate: 1120 with `box-sizing: border-box` leaves 1072 inside the
 * 4px bevel and the 20px padding, but the three columns plus their two 16px gaps
 * need 1080, and the grid column needs a further 12px for its scrollbar or it
 * silently drops from six cells per row to five. Every value the spec actually
 * names (280 / 500 / 268, gap 16, padding 20, 80px cells, 6 columns) is exact.
 */
const PANEL_WIDTH = 1140;

/** Opens on the first legendary item, the way a game shows off your best gear. */
const DEFAULT_REPO: Repo =
  repos.find((repo) => repo.rarity === "legendary") ?? repos[0];

function Tab({
  label,
  count,
  active,
  onSelect,
}: {
  label: string;
  count: number;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className="shrink-0 cursor-pointer font-display leading-none"
      style={{
        fontSize: "var(--text-sm)",
        borderStyle: "solid",
        boxSizing: "border-box",
        ...(active
          ? {
              backgroundColor: "var(--panel-face)",
              color: "var(--chrome-text)",
              borderWidth: "4px 4px 0 4px",
              borderColor:
                "var(--panel-bevel-light) var(--panel-bevel-dark) transparent var(--panel-bevel-light)",
              padding: "10px 16px 12px",
            }
          : {
              backgroundColor: "var(--tab-inactive)",
              color: "#e0e0e0",
              borderWidth: 4,
              borderColor:
                "var(--tab-inactive-bevel-light) var(--tab-inactive-bevel-dark) var(--tab-inactive-bevel-dark) var(--tab-inactive-bevel-light)",
              // 2px shorter than the active tab, so the active one reads as the
              // tab in front.
              padding: "8px 16px",
            }),
      }}
    >
      {label} {count}
    </button>
  );
}

export function InventoryScreen({
  onClose,
  className,
}: {
  onClose?: () => void;
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState<RepoCategoryId>("all");
  const [query, setQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<Repo>(DEFAULT_REPO);
  const [hovered, setHovered] = useState<HoveredRepo>(null);

  // Escape closes. Nothing else is intercepted: arrow keys belong to the grid,
  // every other key belongs to the page.
  useEffect(() => {
    if (!onClose) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <section
      aria-labelledby="inventory-title"
      className={cn(
        "relative isolate flex w-full flex-col items-center overflow-x-hidden",
        className,
      )}
    >
      <WorldScrim />

      <h2 id="inventory-title" className="sr-only">
        Inventory: every repository, grouped
      </h2>

      <div
        className="relative flex w-full max-w-full flex-col px-4 pb-8 pt-6 min-[1180px]:px-0"
        style={{ width: PANEL_WIDTH }}
      >
        {/* Tab strip. The -8px pulls it down onto the panel's top edge. */}
        <div
          role="group"
          aria-label="Filter repositories by category"
          className="relative z-20 flex flex-wrap items-end gap-1"
          style={{ marginBottom: -8 }}
        >
          {repoCategories.map((category) => (
            <Tab
              key={category.id}
              label={category.label}
              count={countIn(category.id)}
              active={activeTab === category.id}
              onSelect={() => setActiveTab(category.id)}
            />
          ))}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="btn-nav ml-auto shrink-0 self-end font-display leading-none"
              style={{
                fontSize: "var(--text-2xs)",
                padding: "8px 12px",
                marginBottom: 8,
              }}
            >
              Close (Esc)
            </button>
          )}
        </div>

        <Panel
          className={cn(
            "relative z-10 flex w-full max-w-full flex-col gap-4",
            // 716px is the design height; below the breakpoint the panel grows
            // with its content instead.
            "min-[1180px]:h-[716px] min-[1180px]:flex-row min-[1180px]:items-stretch",
          )}
          style={{
            padding: 20,
            boxSizing: "border-box",
            animation: "panel-in var(--dur-fast) var(--ease-out)",
          }}
        >
          <CharacterPanel />

          <RepoGrid
            activeTab={activeTab}
            query={query}
            onQueryChange={setQuery}
            selected={selectedRepo}
            onSelect={setSelectedRepo}
            hovered={hovered}
            onHoverChange={setHovered}
            className="w-full min-[1180px]:w-[512px]"
          />

          <RepoDetail
            repo={selectedRepo}
            className="w-full min-[1180px]:w-[268px]"
          />
        </Panel>
      </div>
    </section>
  );
}
