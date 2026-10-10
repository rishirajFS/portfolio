import NextLink from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { leavesApp, opensNewTab } from "@/lib/links";

/**
 * Beveled GUI buttons.
 *
 * Three variants, all from the handoff:
 *   primary    green, 4px bevel + black ring. One per screen.
 *   secondary  gray, same geometry.
 *   nav        smaller, 3px bevel, no ring. Top-bar navigation only.
 *
 * The press state flips the bevel so the button physically depresses. That is
 * handled in globals.css (`.bevel-btn:active`) rather than here, so it applies
 * to both the button and the link form without duplication.
 */

type Variant = "primary" | "secondary" | "nav";
type Size = "sm" | "base" | "lg";

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-2xs",
  base: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3.5 text-base",
};

// Nav buttons use the spec's tighter padding rather than the shared scale.
const NAV_SIZES: Record<Size, string> = {
  sm: "px-2.5 py-1.5 text-2xs",
  base: "px-3 py-[7px] text-sm",
  lg: "px-4 py-2 text-sm",
};

function classes(variant: Variant, size: Size, className?: string) {
  const base =
    variant === "nav" ? cn("btn-nav", NAV_SIZES[size]) : cn("bevel-btn", SIZES[size]);
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none",
    "leading-none tracking-wide",
    base,
    variant === "primary" && "btn-primary",
    variant === "secondary" && "btn-secondary",
    "disabled:pointer-events-none disabled:opacity-50",
    className,
  );
}

type Common = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Small colour chip before the label, standing in for an item icon. */
  chip?: string;
};

function Chip({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="block size-3 shrink-0 pixelated"
      style={{
        backgroundColor: color,
        boxShadow:
          "inset 1px 1px 0 rgba(255,255,255,.3), inset -1px -1px 0 rgba(0,0,0,.3)",
      }}
    />
  );
}

export function PixelButton({
  children,
  variant = "primary",
  size = "base",
  className,
  chip,
  ...rest
}: Common & ComponentProps<"button">) {
  return (
    <button className={classes(variant, size, className)} {...rest}>
      {chip && <Chip color={chip} />}
      {children}
    </button>
  );
}

export function PixelButtonLink({
  children,
  href,
  variant = "primary",
  size = "base",
  className,
  chip,
  external,
  ...rest
}: Common & { href: string; external?: boolean } & Omit<
    ComponentProps<typeof NextLink>,
    "href" | "children" | "className"
  >) {
  // `leavesApp` also catches static files like the résumé PDF. Those must not go
  // through next/link, which would prefetch them as an RSC route and 404.
  // `||` not `??`: the content schema defaults `external` to false, and an
  // explicit false from a social link must not override file detection.
  const isExternal = external || leavesApp(href);
  const newTab = opensNewTab(href);

  const inner = (
    <>
      {chip && <Chip color={chip} />}
      {children}
      {newTab && <span className="sr-only">(opens in a new tab)</span>}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes(variant, size, className)}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : null)}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {inner}
      </a>
    );
  }

  return (
    <NextLink
      href={href}
      className={classes(variant, size, className)}
      {...rest}
    >
      {inner}
    </NextLink>
  );
}
