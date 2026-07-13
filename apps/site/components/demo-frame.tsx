"use client";

import { useState } from "react";

type FrameTheme = "light" | "dark";

/**
 * Device-neutral frame for live component demos. The theme toggle scopes
 * data-theme to the frame subtree, so the demo can be inspected in both
 * palettes independent of the page theme.
 */
export function DemoFrame({
  label = "Live demo",
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<FrameTheme>("light");

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
              onClick={() => setTheme(t)}
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
