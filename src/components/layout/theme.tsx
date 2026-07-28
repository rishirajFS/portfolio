"use client";

import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { useHydrated } from "@/lib/use-hydrated";

/**
 * Theme provider. Writes `class="dark"` / `class="light"` on <html>, which is
 * what styles/tokens.css and the Tailwind `dark:` variant key off.
 * `disableTransitionOnChange` prevents every transition on the page from firing
 * at once during a toggle.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}

const OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "system", label: "System", Icon: Monitor },
  { value: "dark", label: "Dark", Icon: Moon },
] as const;

/**
 * Three-state segmented toggle: day / system / night.
 *
 * Built from the GUI grammar: an inset slot strip holding three cells, and the
 * selected cell is a raised subpanel. Same raised-versus-inset logic as the
 * hotbar, so the toggle reads as part of the interface rather than a web widget.
 *
 * Renders a fixed-size placeholder before mount so the header does not shift.
 * `theme` is unknowable during SSR, and guessing causes a visible flip.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useHydrated();

  if (!mounted) {
    return (
      <div
        aria-hidden
        className={cn("bevel-slot h-8 w-[5.5rem]", className)}
      />
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className={cn("bevel-slot inline-flex items-center p-[2px]", className)}
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              "duration-fast grid size-6 place-items-center transition-[filter]",
              active
                ? "bevel-subpanel text-chrome"
                : "text-[#d0d0d0] hover:text-white",
            )}
          >
            <Icon size={14} strokeWidth={1.75} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
