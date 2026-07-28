import type { ElementType, ReactNode } from "react";

import { Reveal } from "@/components/motion/motion-primitives";
import { cn } from "@/lib/cn";

/**
 * Section shell. Owns the vertical rhythm, the anchor id, and the eyebrow +
 * heading pattern, so every section on the page lines up without repeating
 * spacing classes. Never set section padding by hand. Pass `size`.
 *
 * The API is unchanged from the pre-pixel version on purpose: several pages
 * call it. Only the header's presentation moved into the GUI language.
 */
export function Section({
  id,
  children,
  className,
  size = "base",
  container = "page",
  as: Tag = "section",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  size?: "sm" | "base" | "lg" | "none";
  container?: "page" | "wide" | "none";
  as?: ElementType;
}) {
  const pad = {
    none: "",
    sm: "py-[calc(var(--section-py)*0.6)]",
    base: "py-(--section-py)",
    lg: "py-(--section-py-lg)",
  }[size];

  const wrap = {
    page: "container-page",
    wide: "container-wide",
    none: "",
  }[container];

  return (
    <Tag
      id={id}
      // Anchored sections need to clear the sticky header when linked to.
      className={cn("relative scroll-mt-(--header-h)", pad, className)}
    >
      <div className={wrap}>{children}</div>
    </Tag>
  );
}

/**
 * Section header: eyebrow, title, optional lede and trailing action.
 *
 * This sits on the world, not on GUI chrome, so it is treated the way a game
 * treats world-space text: the eyebrow is a small stamped plate (a raised
 * subpanel, since it is chrome sitting on the dirt), the title is pixel type in
 * white with a hard 4px drop shadow, and the lede goes on the dark body plate
 * from the hero so long copy stays readable over texture.
 *
 * `index` renders as a gold counter, the way a quest log numbers entries.
 */
export function SectionHeader({
  eyebrow,
  title,
  lede,
  action,
  index,
  className,
  align = "start",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  action?: ReactNode;
  index?: string;
  className?: string;
  align?: "start" | "center";
}) {
  return (
    <Reveal
      className={cn(
        "mb-8 flex flex-col gap-4 sm:mb-12",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {(eyebrow || index) && (
        <div
          className={cn(
            "flex flex-wrap items-center gap-2",
            align === "center" && "justify-center",
          )}
        >
          {index && (
            <span
              data-numeric
              className="text-drop font-display text-xs text-gold"
            >
              {index}
            </span>
          )}
          {eyebrow && (
            <span className="bevel-subpanel emboss px-2 py-1 font-display text-2xs uppercase tracking-wide text-chrome-soft">
              {eyebrow}
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8",
          align === "center" && "sm:flex-col sm:items-center",
        )}
      >
        <h2 className="text-drop-lg max-w-[24ch] font-display text-xl uppercase leading-tight text-white sm:text-2xl">
          {title}
        </h2>
        {action && <div className="flex-none">{action}</div>}
      </div>

      {lede && (
        <p
          className={cn(
            "max-w-[64ch] border-4 border-ring-black bg-plate px-4 py-3",
            "font-display text-xs leading-relaxed text-plate-text",
            align === "center" && "mx-auto",
          )}
        >
          {lede}
        </p>
      )}
    </Reveal>
  );
}
