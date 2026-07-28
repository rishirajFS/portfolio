"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently in view.
 *
 * IntersectionObserver rather than a scroll listener, so it costs nothing while
 * idle. The negative top margin accounts for the sticky header: a section only
 * counts as active once it clears the header, which is what a reader perceives.
 */
export function useScrollSpy(
  ids: string[],
  { rootMargin = "-20% 0px -70% 0px" } = {},
) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          // Topmost wins when two sections straddle the band.
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin, threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, rootMargin]);

  return activeId;
}

/** True once the window has scrolled past `threshold` px. */
export function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
