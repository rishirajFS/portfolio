"use client";

import { useCallback, useEffect, useState } from "react";

import { InventoryScreen } from "@/components/inventory";
import { Hotbar } from "@/components/pixel/hotbar";
import { Hero } from "@/components/sections/hero";

/**
 * Screen 2a, plus the transition into 4a.
 *
 * The handoff treats the inventory as a state of the home screen rather than a
 * separate page: the world stays behind it, paused, and the panel scales in over
 * ~120ms. So this owns one boolean and renders the inventory as an overlay.
 *
 * `/projects` renders the same InventoryScreen standalone, which keeps the
 * screen deep-linkable and shareable without duplicating the GUI.
 *
 * This is the only client boundary on the home page. Everything below the hero
 * stays a server component.
 */
export function HomeStage() {
  const [inventoryOpen, setInventoryOpen] = useState(false);

  const open = useCallback(() => setInventoryOpen(true), []);
  const close = useCallback(() => setInventoryOpen(false), []);

  // `E` toggles the inventory, as it does in the game. Ignored while the user is
  // typing, so the inventory's own search field does not close the screen it
  // lives in, and ignored when a modifier is held so browser shortcuts survive.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "e" && event.key !== "E") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable);
      if (typing) return;

      event.preventDefault();
      setInventoryOpen((v) => !v);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock the page behind the overlay so scrolling does not move the world while
  // the GUI is up, and flag the state on <body>.
  //
  // The flag drives one CSS rule in globals.css that hides the top bar. The
  // handoff has the *world* showing through the scrim, not the site chrome, and
  // leaving the header visible let it bleed through the gaps in the tab strip.
  useEffect(() => {
    document.body.style.overflow = inventoryOpen ? "hidden" : "";
    document.body.toggleAttribute("data-inventory-open", inventoryOpen);
    return () => {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-inventory-open");
    };
  }, [inventoryOpen]);

  return (
    <>
      <Hero onOpenInventory={open} />

      {/* The hotbar is fixed to the bottom of the viewport and is primary nav,
          so it sits outside the hero and stays put as the page scrolls. */}
      <Hotbar onOpenInventory={open} />

      {inventoryOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Inventory: all repositories"
          className="fixed inset-0 z-50 overflow-auto"
        >
          <InventoryScreen onClose={close} />
        </div>
      )}
    </>
  );
}
