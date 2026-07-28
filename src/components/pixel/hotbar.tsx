"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { useEffect, useRef } from "react";

import { ItemChip, Panel, Slot } from "@/components/pixel/panel";
import { site } from "@/content";
import { cn } from "@/lib/cn";
import { leavesApp, opensNewTab } from "@/lib/links";
import { useScrollSpy } from "@/lib/use-scroll-spy";

/**
 * The hotbar: nine 56x56 slots, and the site's primary navigation.
 *
 * Two rules from the handoff drive the geometry:
 *
 *   - No gap between slots. They share edges, so the row reads as one strip of
 *     holes punched into the panel rather than nine separate buttons.
 *   - The selected slot gets `outline: 4px solid #fff; outline-offset: -1px`.
 *     That is a hair different from the shared `.slot-selected` utility
 *     (3px / -3px, tuned for the inventory's 80px cells), so it is applied
 *     inline here rather than by widening the utility for everyone.
 *
 * Entries are derived from `site.nav` plus the résumé and email links, so the
 * hotbar can never drift out of sync with the top bar. Anything past nine is
 * dropped; short of nine, the remaining slots render empty, exactly like a
 * player who has not filled their inventory.
 */

const SLOT_COUNT = 9;
const SLOT_SIZE = 56;
const CHIP_SIZE = 28;

/** Selected-slot outline, per the handoff. Not the same as `.slot-selected`. */
const SELECTED: React.CSSProperties = {
  outline: "4px solid #fff",
  outlineOffset: -1,
};

/**
 * One colour per entry, so a returning visitor navigates by chip rather than by
 * reading. Drawn from the design palette (language colours, gold, rarity
 * violet) so nothing new enters the scheme. Real 32x32 sprites replace these
 * when the art exists; only this array changes.
 */
const NAV_CHIPS = [
  "#3572A5", // python blue
  "#ffcc33", // gold
  "#a8a8ff", // rarity violet
  "#e34c26", // html orange
  "#4a8f2c", // primary green
  "#89e051", // shell green
  "#b07219", // java brown
];

const RESUME_CHIP = "#d8d8d8";
const EMAIL_CHIP = "#f1e05a";

type Entry = {
  label: string;
  href: string;
  chip: string;
  /** Leaves the app: mailto, an absolute URL, or a static file like the PDF. */
  external: boolean;
  /** Anchor id this entry points at, for scroll-spy selection. */
  sectionId: string | null;
};

function entryFor(label: string, href: string, chip: string): Entry {
  return {
    label,
    href,
    chip,
    external: leavesApp(href),
    sectionId: href.split("#")[1] ?? null,
  };
}

const resumeLink = site.socials.find((s) => s.icon === "file");
const emailLink = site.socials.find((s) => s.icon === "mail");

const ENTRIES: Entry[] = [
  ...site.nav.map((item, i) =>
    entryFor(item.label, item.href, NAV_CHIPS[i % NAV_CHIPS.length]),
  ),
  entryFor(resumeLink?.label ?? "Resume", site.resumePath, RESUME_CHIP),
  ...(emailLink ? [entryFor(emailLink.label, emailLink.href, EMAIL_CHIP)] : []),
].slice(0, SLOT_COUNT);

const SECTION_IDS = ENTRIES.map((e) => e.sectionId).filter(
  (id): id is string => Boolean(id),
);
/** Stable empty array, so the spy's effect is not re-bound every render. */
const NO_IDS: string[] = [];

/** An anchor that is either a router link or a plain one, depending on target. */
function SlotLink({
  href,
  external,
  ref,
  ...rest
}: ComponentProps<"a"> & { href: string; external: boolean }) {
  if (external) {
    const newTab = opensNewTab(href);
    return (
      <a
        ref={ref}
        href={href}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : null)}
        {...rest}
      />
    );
  }
  return <Link ref={ref} href={href} {...rest} />;
}

export function Hotbar({
  className,
  /**
   * When supplied, the Projects slot opens the inventory overlay instead of
   * scrolling to the section, which is what the handoff asks for (hotbar slot,
   * `E`, or the button all reach 4a). Without it the slot degrades to the plain
   * anchor, so the hotbar still works on pages that have no overlay state.
   */
  onOpenInventory,
}: {
  className?: string;
  onOpenInventory?: () => void;
}) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  // Sections only exist on the home page; elsewhere nothing is selected.
  const activeId = useScrollSpy(onHome ? SECTION_IDS : NO_IDS);
  const activeIndex = ENTRIES.findIndex(
    (e) => e.sectionId !== null && e.sectionId === activeId,
  );

  // Anchors and buttons both live here, so the number-key handler can click
  // whichever element a slot happens to be.
  const links = useRef<Array<HTMLElement | null>>([]);

  // Number keys 1-9 activate a slot, as in the game. Clicking the real anchor
  // keeps one code path for router links, mailto and the PDF alike.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.isContentEditable ||
          /^(input|textarea|select)$/i.test(el.tagName))
      ) {
        return;
      }

      const n = Number(e.key);
      if (!Number.isInteger(n) || n < 1 || n > SLOT_COUNT) return;

      const target = links.current[n - 1];
      if (!target) return;

      e.preventDefault();
      target.focus();
      target.click();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <nav
      aria-label="Hotbar"
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center px-4",
        className,
      )}
    >
      <Panel className="pointer-events-auto max-w-full p-1">
        {/* Narrow screens scroll the strip rather than shrinking the slots:
            56px is the slot, and a 48px slot is a different design. */}
        <ul className="flex max-w-full overflow-x-auto">
          {Array.from({ length: SLOT_COUNT }, (_, i) => {
            const entry = ENTRIES[i];
            const digit = i + 1;

            if (!entry) {
              return (
                <li key={`empty-${digit}`} aria-hidden className="shrink-0">
                  <Slot style={{ width: SLOT_SIZE, height: SLOT_SIZE }} />
                </li>
              );
            }

            // The face of the slot is identical either way; only the element
            // wrapping it changes.
            const face = (
              <>
                <Slot
                  interactive
                  className="relative grid place-items-center"
                  style={{
                    width: SLOT_SIZE,
                    height: SLOT_SIZE,
                    ...(i === activeIndex ? SELECTED : null),
                  }}
                >
                  <ItemChip color={entry.chip} size={CHIP_SIZE} />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-[3px] top-[1px] font-display text-2xs leading-none text-[#e0e0e0]"
                    style={{ textShadow: "1px 1px 0 #1a1a1a" }}
                    data-numeric
                  >
                    {digit}
                  </span>
                </Slot>
                <span className="sr-only">
                  {entry.label} (press {digit})
                </span>
              </>
            );

            const opensInventory =
              Boolean(onOpenInventory) && entry.sectionId === "projects";

            return (
              <li key={entry.href} className="shrink-0">
                {opensInventory ? (
                  <button
                    type="button"
                    onClick={onOpenInventory}
                    ref={(el) => {
                      links.current[i] = el;
                    }}
                    title={`${entry.label} (opens the inventory)`}
                    aria-keyshortcuts={String(digit)}
                    className="block"
                  >
                    {face}
                  </button>
                ) : (
                  <SlotLink
                    href={entry.href}
                    external={entry.external}
                    ref={(el) => {
                      links.current[i] = el;
                    }}
                    title={entry.label}
                    aria-keyshortcuts={String(digit)}
                    aria-current={i === activeIndex ? "true" : undefined}
                    className="block"
                  >
                    {face}
                  </SlotLink>
                )}
              </li>
            );
          })}
        </ul>
      </Panel>
    </nav>
  );
}
