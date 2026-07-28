"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/layout/theme";
import { PixelButton, PixelButtonLink } from "@/components/pixel/button";
import { ItemChip, Panel, Slot } from "@/components/pixel/panel";
import { site } from "@/content";
import { cn } from "@/lib/cn";
import { useScrollSpy } from "@/lib/use-scroll-spy";

/**
 * The top bar: a raised GUI panel pinned to the top of the world.
 *
 * Geometry is the handoff's: 56px tall, inset 32px from the edges, 28px down
 * from the top, 4px bevel plus the 4px black ring. The wordmark sits in a 32px
 * item slot on the left; navigation is a row of beveled buttons on the right.
 *
 * Active state is a PRESSED button, not an underline. Nothing in a game GUI
 * underlines itself, and the inverted bevel already means "this one is
 * currently chosen" everywhere else in the interface.
 */

/** Anchor ids derived from nav hrefs like "/#projects". */
const SECTION_IDS = site.nav
  .map((item) => item.href.split("#")[1])
  .filter((id): id is string => Boolean(id));

/** Stable empty array, so the spy's effect is not re-bound every render. */
const NO_IDS: string[] = [];

/** The one green button. Contact by name, the last item as a fallback. */
const PRIMARY_HREF =
  site.nav.find((item) => /#contact$/.test(item.href))?.href ??
  site.nav[site.nav.length - 1].href;

/** Bevel flipped: the button is held in. */
const PRESSED_NAV: CSSProperties = {
  backgroundColor: "#9b9b9b",
  borderColor: "#6a6a6a #d8d8d8 #d8d8d8 #6a6a6a",
  color: "var(--chrome-text)",
};

const PRESSED_PRIMARY: CSSProperties = {
  borderColor:
    "var(--primary-bevel-dark) var(--primary-bevel-light) var(--primary-bevel-light) var(--primary-bevel-dark)",
};

/** The wordmark reads as a domain, and it follows the real one in content. */
const WORDMARK = site.siteUrl.replace(/^https?:\/\/(www\.)?/, "");

export function SiteHeader() {
  const pathname = usePathname();
  // The sheet's open state is stored as "which route it was opened for", so a
  // route change closes it by derivation: no effect, no ref, no stale-open frame.
  const [openForPath, setOpenForPath] = useState<string | null>(null);
  const menuOpen = openForPath === pathname;
  const setMenuOpen = (open: boolean) => setOpenForPath(open ? pathname : null);

  const onHome = pathname === "/";
  // Scroll spy is meaningless off the home page, since the sections aren't there.
  const activeId = useScrollSpy(onHome ? SECTION_IDS : NO_IDS);

  // Lock body scroll while the sheet is open. A genuine external-system effect.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Escape closes the sheet. Calls setOpenForPath directly, since the useState
  // setter is referentially stable, so the listener is bound once.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenForPath(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => {
    const id = href.split("#")[1];
    return onHome && Boolean(id) && id === activeId;
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 pt-7">
        <div className="container-page">
          <Panel className="flex h-14 items-center justify-between gap-4 px-2">
            {/* Wordmark: a 32px item slot plus the domain, stamped into the
                panel with the 2px light shadow the spec calls for. */}
            <Link
              href="/"
              className="flex min-w-0 items-center gap-2"
              aria-label={`${site.name}, home`}
            >
              <Slot
                className="grid place-items-center"
                style={{ width: 32, height: 32 }}
              >
                <ItemChip color="var(--gold)" size={16} />
              </Slot>
              <span className="emboss-strong truncate font-display text-md leading-none text-chrome">
                {WORDMARK}
              </span>
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Main" className="hidden md:block">
              {/* 8px gap: the primary button's black ring is drawn 4px outside
                  its box, so a 4px gap would let it touch its neighbour. */}
              <ul className="flex items-center gap-2">
                {site.nav.map((item) => {
                  const active = isActive(item.href);
                  const primary = item.href === PRIMARY_HREF;
                  return (
                    <li key={item.href}>
                      <PixelButtonLink
                        href={item.href}
                        variant={primary ? "primary" : "nav"}
                        size={primary ? "sm" : "base"}
                        // The primary variant carries a 4px bevel and a ring
                        // where nav buttons have 3px and none, so its padding is
                        // trimmed to keep both rows of caps optically level.
                        className={primary ? "px-3 py-[3px] text-sm" : undefined}
                        aria-current={active ? "true" : undefined}
                        style={
                          active
                            ? primary
                              ? PRESSED_PRIMARY
                              : PRESSED_NAV
                            : undefined
                        }
                      >
                        {item.label}
                      </PixelButtonLink>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              {/* Restyled at the call site only: the toggle itself is shared
                  chrome, so the pill radius is squared off from here. */}
              <ThemeToggle className="hidden rounded-none border-0 bevel-slot p-[2px] sm:inline-flex [&>button]:rounded-none" />

              <PixelButton
                type="button"
                variant="nav"
                size="base"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="md:hidden"
              >
                {menuOpen ? (
                  <X size={14} aria-hidden />
                ) : (
                  <Menu size={14} aria-hidden />
                )}
              </PixelButton>
            </div>
          </Panel>
        </div>
      </header>

      {/* Mobile sheet. Opaque dirt, so nothing shows through it. */}
      <div
        id="mobile-nav"
        hidden={!menuOpen}
        className="fixed inset-0 z-20 overflow-y-auto bg-dirt bg-grid pb-8 pt-24 md:hidden"
      >
        <nav aria-label="Mobile" className="container-page flex flex-col gap-4">
          <Panel className="flex flex-col gap-2 p-2">
            {site.nav.map((item, i) => {
              const active = isActive(item.href);
              const primary = item.href === PRIMARY_HREF;
              return (
                <PixelButtonLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  variant={primary ? "primary" : "nav"}
                  size="lg"
                  className={cn(
                    "w-full justify-start",
                    // Same trim as the desktop row, so every item in the stack
                    // is the same height.
                    primary && "px-4 py-[7px] text-sm",
                  )}
                  aria-current={active ? "true" : undefined}
                  style={
                    active
                      ? primary
                        ? PRESSED_PRIMARY
                        : PRESSED_NAV
                      : undefined
                  }
                >
                  <span
                    aria-hidden
                    className="text-2xs opacity-70"
                    data-numeric
                  >
                    {i + 1}
                  </span>
                  {item.label}
                </PixelButtonLink>
              );
            })}
          </Panel>

          <Panel className="flex flex-wrap items-center gap-2 p-2">
            {site.socials.map((social) => (
              <PixelButtonLink
                key={social.label}
                href={social.href}
                external={social.external}
                variant="nav"
                size="base"
                onClick={() => setMenuOpen(false)}
              >
                {social.label}
              </PixelButtonLink>
            ))}
            <ThemeToggle className="rounded-none border-0 bevel-slot p-[2px] [&>button]:rounded-none" />
          </Panel>
        </nav>
      </div>
    </>
  );
}
