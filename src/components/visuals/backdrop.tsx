/**
 * Decorative backdrops.
 *
 * THIS IS THE THEME SLOT. When a visual direction lands, most of it goes here
 * and nothing else has to change: <HeroBackdrop> is a single element inside the
 * hero, and every color it uses is a token. Swap the internals for a canvas, a
 * shader, an SVG system, whatever the theme calls for.
 *
 * Current placeholder is intentionally restrained: a token-driven radial glow,
 * a faint grid, and a grain overlay. All pure CSS, zero JS, zero layout cost.
 */

import { cn } from "@/lib/cn";

/** Fine-grain noise as an inline SVG data URI, no network request. */
const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")";

/** Site-wide grain. Mounted once in the root layout. */
export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] mix-blend-overlay"
      style={{
        backgroundImage: GRAIN_URI,
        opacity: "var(--grain-opacity)",
      }}
    />
  );
}

export function HeroBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      {/* Accent glow, driven by --gradient-hero. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "var(--gradient-hero)",
          opacity: "var(--glow-opacity)",
        }}
      />

      {/* Grid, faded out toward the bottom so it never fights the copy. */}
      <div className="absolute inset-0 bg-grid opacity-70 mask-fade-radial" />

      {/* Two soft accent orbs for depth. */}
      <div
        className="absolute -left-32 top-1/4 size-[28rem] rounded-full blur-[120px]"
        style={{
          background:
            "oklch(0.6 var(--accent-c) var(--accent-h) / 0.14)",
          opacity: "var(--glow-opacity)",
        }}
      />
      <div
        className="absolute -right-24 top-0 size-[22rem] rounded-full blur-[110px]"
        style={{
          background:
            "oklch(0.62 var(--accent-2-c) var(--accent-2-h) / 0.12)",
          opacity: "var(--glow-opacity)",
        }}
      />

      {/* Fade into the page background at the seam. */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}

/** Lighter backdrop for mid-page sections that need a little separation. */
export function SectionBackdrop({
  variant = "grid",
  className,
}: {
  variant?: "grid" | "dots" | "none";
  className?: string;
}) {
  if (variant === "none") return null;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10",
        variant === "grid" ? "bg-grid" : "bg-dots",
        "opacity-40 mask-fade-radial",
        className,
      )}
    />
  );
}
