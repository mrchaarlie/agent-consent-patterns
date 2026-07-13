"use client";

import { useState, useSyncExternalStore } from "react";

type FrameTheme = "light" | "dark";

function resolveSiteTheme(): FrameTheme {
  const override = document.documentElement.dataset.theme;
  if (override === "light" || override === "dark") return override;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// External store over the site's resolved theme (its own override, or
// prefers-color-scheme) — avoids effect-driven setState, mirrors ThemeSwitch.
function subscribe(onChange: () => void) {
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", onChange);
  window.addEventListener("acp-themechange", onChange);
  return () => {
    mql.removeEventListener("change", onChange);
    window.removeEventListener("acp-themechange", onChange);
  };
}

function getServerSnapshot(): FrameTheme {
  return "light";
}

/**
 * Device-neutral frame for live component demos. Defaults to matching the
 * site's current theme, then keeps tracking it live — until the reader
 * clicks light/dark below, which pins this one frame so it can be inspected
 * independent of the page theme.
 */
export function DemoFrame({
  label = "Live demo",
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  const siteTheme = useSyncExternalStore(subscribe, resolveSiteTheme, getServerSnapshot);
  const [pinnedTheme, setPinnedTheme] = useState<FrameTheme | null>(null);
  const theme = pinnedTheme ?? siteTheme;

  function handleSetTheme(next: FrameTheme) {
    setPinnedTheme(next);
  }

  return (
    <figure className="my-8 overflow-hidden rounded-lg border border-line">
      <figcaption className="flex items-center justify-between border-b border-line bg-surface-raised px-4 py-2">
        <span className="eyebrow">{label}</span>
        <div
          role="group"
          aria-label="Demo theme"
          className="flex gap-1 font-mono text-xs"
        >
          {(["light", "dark"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleSetTheme(t)}
              aria-pressed={theme === t}
              className="rounded px-2 py-1 text-ink-muted aria-pressed:bg-surface-sunken aria-pressed:text-ink"
            >
              {t}
            </button>
          ))}
        </div>
      </figcaption>
      <div
        data-theme={theme}
        className="grid place-items-center px-6 py-10"
        style={{
          background: "var(--acp-color-surface)",
          backgroundImage:
            "radial-gradient(var(--acp-color-line) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      >
        {children}
      </div>
    </figure>
  );
}
