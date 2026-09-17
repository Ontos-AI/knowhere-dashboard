"use client";

import { useEffect } from "react";

const PALETTE_ATTRIBUTES = ["data-theme", "class"] as const;

/**
 * The prototype re-reads its palette whenever the theme changes and tells every
 * canvas visual about it with a `main-palette-change` event. The canvases here
 * already listen for that event, but nothing dispatched it.
 *
 * next-themes owns the theme attribute, so watch the attribute instead of the
 * React state: it is applied from an effect, and a `MutationObserver` callback
 * runs after the browser has the new values.
 */
export const useMainPaletteChange = (): void => {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      window.dispatchEvent(new CustomEvent("main-palette-change"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [...PALETTE_ATTRIBUTES],
    });

    return () => observer.disconnect();
  }, []);
};
