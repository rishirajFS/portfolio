import type { CSSProperties, ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * The GUI surface kit.
 *
 * Four primitives carry the entire interface, and the only thing separating
 * them is which way the bevel runs:
 *
 *   Panel     raised, 4px bevel + black ring. The window chrome.
 *   Subpanel  raised, 3px bevel, no ring. A group inside a panel.
 *   Slot      INSET, 3px bevel. A hole you put an item in.
 *   Tooltip   the floating dark card. The only violet surface in the design.
 *
 * Raised vs. inset is the load-bearing distinction. If a new surface is
 * ambiguous, ask whether a player would drop something into it.
 */

type PanelProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
  /** The 4px black outer ring. On by default; off for nested panels. */
  ring?: boolean;
};

export function Panel({
  children,
  className,
  style,
  as: Tag = "div",
  ring = true,
}: PanelProps) {
  return (
    <Tag
      className={cn("bevel-panel", ring && "bevel-ring", className)}
      style={style}
    >
      {children}
    </Tag>
  );
}

export function Subpanel({
  children,
  className,
  style,
  as: Tag = "div",
}: Omit<PanelProps, "ring">) {
  return (
    <Tag className={cn("bevel-subpanel", className)} style={style}>
      {children}
    </Tag>
  );
}

type SlotProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Draws the white selection outline inside the slot. */
  selected?: boolean;
  /** Lightens the fill on hover. Leave off for purely decorative slots. */
  interactive?: boolean;
  as?: ElementType;
  title?: string;
};

export function Slot({
  children,
  className,
  style,
  selected = false,
  interactive = false,
  as: Tag = "div",
  title,
}: SlotProps) {
  return (
    <Tag
      title={title}
      className={cn(
        "bevel-slot",
        interactive && "bevel-slot-hover cursor-pointer",
        selected && "slot-selected",
        className,
      )}
      style={style}
    >
      {children}
    </Tag>
  );
}

/**
 * A flat colour square standing in for pixel art.
 *
 * The handoff ships no sprites and explicitly forbids shipping ripped game
 * assets, so every item icon is a colour chip until real art exists. Keeping
 * that behind one component means dropping in sprites later is a single edit.
 */
export function ItemChip({
  color,
  size = 28,
  className,
  bob = false,
  label,
}: {
  color: string;
  size?: number;
  className?: string;
  /** Two-frame hover bob, for items that read as pickups. */
  bob?: boolean;
  label?: string;
}) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("block shrink-0 pixelated", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        // A 2px inner highlight gives the chip a die-cut, pixel-art edge
        // instead of reading as a plain CSS rectangle.
        boxShadow: `inset 2px 2px 0 rgba(255,255,255,.28), inset -2px -2px 0 rgba(0,0,0,.32)`,
        animation: bob
          ? `sprite-bob var(--bob-duration) steps(2, end) infinite`
          : undefined,
      }}
    />
  );
}

/**
 * The floating dark card: item tooltips, repo detail, anything that hovers
 * above the GUI rather than sitting in it.
 */
export function Tooltip({
  children,
  className,
  style,
  solid = false,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Opaque background, for a docked panel rather than a floating tip. */
  solid?: boolean;
}) {
  return (
    <div
      className={cn("tooltip-panel", className)}
      style={{
        backgroundColor: solid ? "var(--tooltip-bg-solid)" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Tooltip body rows, so the type scale stays consistent across every tip. */
export function TooltipTitle({ children }: { children: ReactNode }) {
  return (
    <p className="font-display text-base leading-snug text-tooltip-title">
      {children}
    </p>
  );
}

export function TooltipMeta({ children }: { children: ReactNode }) {
  return (
    <p className="font-display text-xs leading-relaxed text-tooltip-meta">
      {children}
    </p>
  );
}

export function TooltipMuted({ children }: { children: ReactNode }) {
  return (
    <p className="font-display text-xs leading-relaxed text-tooltip-muted">
      {children}
    </p>
  );
}

export function TooltipDim({ children }: { children: ReactNode }) {
  return (
    <p className="font-display text-xs leading-relaxed text-tooltip-dim">
      {children}
    </p>
  );
}

/** Panel heading: embossed, uppercase, the label stamped on GUI chrome. */
export function PanelHeading({
  children,
  className,
  right,
}: {
  children: ReactNode;
  className?: string;
  /** Right-aligned counterpart, e.g. a count. */
  right?: ReactNode;
}) {
  return (
    <div className={cn("flex items-baseline justify-between gap-3", className)}>
      <span className="emboss font-display text-base uppercase text-chrome-soft">
        {children}
      </span>
      {right && (
        <span className="font-display text-2xs uppercase text-chrome-dim">
          {right}
        </span>
      )}
    </div>
  );
}
