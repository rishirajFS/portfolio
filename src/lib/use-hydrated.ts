"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * True once the component has hydrated on the client, false during SSR and the
 * hydration pass.
 *
 * Use this instead of the `useState(false)` + `useEffect(() => setMounted(true))`
 * idiom: that pattern triggers a cascading render (and React 19's
 * `react-hooks/set-state-in-effect` rule rightly flags it). `useSyncExternalStore`
 * with a never-firing subscription gets the same answer with no extra render:
 * React simply reads the server snapshot first, then the client one.
 *
 * Needed wherever the correct output is genuinely unknowable on the server.
 * The theme toggle, for instance, cannot know the user's stored preference until
 * it runs in the browser.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
}
