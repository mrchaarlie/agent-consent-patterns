"use client";

import { animate } from "animejs";
import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * App Router re-mounts template.tsx on every navigation, so it is the seam for
 * a per-page enter animation. We fade + lift the page content in with anime.js.
 *
 * Two guards keep it safe:
 *  - prefers-reduced-motion: reduce → no animation at all (content stays put).
 *  - the from-state (opacity 0) is applied by JS at run time, never in the
 *    server markup, so no-JS and reduced-motion users never see hidden content
 *    and the static HTML remains fully visible to crawlers.
 * Playwright runs with reducedMotion:"reduce", so axe always scans the settled,
 * full-opacity DOM (a mid-transition composite would fail color-contrast).
 */

// Run on the client before paint to avoid a flash of the pre-animation frame;
// fall back to useEffect during SSR where useLayoutEffect is a no-op + warns.
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

// DOM mutation is hoisted to module scope (react-hooks/immutability forbids it
// inside a component, even in effects). Returns a cleanup that clears inline
// styles if the page unmounts mid-animation.
function runEnter(el: HTMLElement): () => void {
  el.style.opacity = "0";
  const animation = animate(el, {
    opacity: [0, 1],
    translateY: [8, 0],
    duration: 320,
    ease: "outQuad",
  });
  return () => {
    animation.pause();
    el.style.opacity = "";
    el.style.transform = "";
  };
}

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return runEnter(el);
  }, []);

  return <div ref={ref}>{children}</div>;
}
