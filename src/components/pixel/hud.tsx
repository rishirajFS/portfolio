import { cn } from "@/lib/cn";

/**
 * The HUD: hearts, armor, XP bar.
 *
 * Shapes come from the handoff as clip-path polygons rather than images, which
 * keeps them resolution-independent and recolourable from tokens. Sizes are
 * fixed at 18x16 because the polygons were authored against that box.
 *
 * The rows are decorative status dressing, not real data, so the whole thing is
 * aria-hidden with a single readable summary for assistive tech.
 */

const HEART_CLIP =
  "polygon(18% 0, 50% 18%, 82% 0, 100% 32%, 50% 100%, 0 32%)";
const ARMOR_CLIP = "polygon(0 0, 100% 0, 100% 55%, 50% 100%, 0 55%)";

function IconRow({
  count,
  filled,
  clip,
  fullColor,
  emptyColor,
}: {
  count: number;
  filled: number;
  clip: string;
  fullColor: string;
  emptyColor: string;
}) {
  return (
    <div aria-hidden className="flex gap-0.5">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="block pixelated"
          style={{
            width: 18,
            height: 16,
            clipPath: clip,
            backgroundColor: i < filled ? fullColor : emptyColor,
          }}
        />
      ))}
    </div>
  );
}

export function Hearts({
  filled = 7,
  count = 9,
  className,
}: {
  filled?: number;
  count?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <IconRow
        count={count}
        filled={filled}
        clip={HEART_CLIP}
        fullColor="var(--health-full)"
        emptyColor="var(--health-empty)"
      />
    </div>
  );
}

export function Armor({
  filled = 5,
  count = 6,
  className,
}: {
  filled?: number;
  count?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <IconRow
        count={count}
        filled={filled}
        clip={ARMOR_CLIP}
        fullColor="var(--armor-full)"
        emptyColor="var(--armor-empty)"
      />
    </div>
  );
}

/**
 * XP bar with the level number above it.
 *
 * `level` and `progress` are wired to real content by the caller (years of
 * study, repos shipped) so the bar means something rather than being noise.
 */
export function XpBar({
  level,
  progress = 0.78,
  width = 520,
  className,
  label,
}: {
  level: number | string;
  /** 0 to 1. */
  progress?: number;
  width?: number;
  className?: string;
  /** Screen-reader description of what the bar represents. */
  label?: string;
}) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <span
        className="font-display text-md leading-none text-xp"
        style={{ textShadow: "2px 2px 0 #1a3a10" }}
        data-numeric
      >
        {level}
      </span>
      <div
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        className="relative pixelated"
        style={{
          width,
          maxWidth: "100%",
          height: 12,
          backgroundColor: "var(--xp-track)",
          boxShadow: "0 0 0 2px #000",
        }}
      >
        <div
          className="absolute inset-y-0 left-0"
          style={{ width: `${pct}%`, backgroundColor: "var(--xp-fill)" }}
        />
      </div>
    </div>
  );
}

/**
 * The full status block: hearts and armor stacked left, XP centered.
 * Composed here so the hero does not have to know the arrangement.
 */
export function Hud({
  level,
  progress,
  xpLabel,
  className,
}: {
  level: number | string;
  progress?: number;
  xpLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col gap-1">
        <Hearts />
        <Armor />
      </div>
      <XpBar level={level} progress={progress} label={xpLabel} />
    </div>
  );
}
