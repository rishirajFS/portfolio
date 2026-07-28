import type { Metadata } from "next";

import { InventoryScreen } from "@/components/inventory";
import { World } from "@/components/pixel/world";
import { repoStats } from "@/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Inventory",
  description: `All ${repoStats.repos} public repositories, grouped and searchable.`,
  path: "/inventory",
});

/**
 * Screen 4a, standalone.
 *
 * On the home page the inventory is an overlay, which is what the handoff
 * describes. This route renders the same component on its own so the screen is
 * linkable and shareable, and so it still works for anyone who arrives without
 * the home page's client state (or without JavaScript at all).
 *
 * No onClose is passed: there is nothing to close back to here, so the GUI omits
 * its close button and the header stays visible for navigation.
 */
export default function InventoryPage() {
  return (
    <div className="relative isolate min-h-[100svh]">
      <World dimmed />
      {/* Clears the fixed top bar: 28px offset + 56px panel + 4px ring. In the
          home-page overlay the header is hidden instead, so no padding is needed
          there and this stays local to the standalone route. */}
      <InventoryScreen className="pt-[88px]" />
    </div>
  );
}
