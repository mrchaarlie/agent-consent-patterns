"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ReadingLevel } from "./lvl";

export const READING_LEVELS: { value: ReadingLevel; label: string }[] = [
  { value: "caveman", label: "Caveman" },
  { value: "human", label: "Default" },
  { value: "academic", label: "Academic" },
];

export const READING_LEVEL_STORAGE_KEY = "acp-reading-level";

const LEVEL_CHANGE_EVENT = "acp-levelchange";

// The source of truth is <html data-level>, set pre-paint by the inline script
// in the root layout and updated here. Modelled as an external store so the
// control stays in sync with cross-tab changes without effect-driven setState.
function subscribe(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key !== READING_LEVEL_STORAGE_KEY) return;
    const next = e.newValue as ReadingLevel | null;
    if (next && READING_LEVELS.some((l) => l.value === next)) {
      document.documentElement.dataset.level = next;
      onChange();
    }
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(LEVEL_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(LEVEL_CHANGE_EVENT, onChange);
  };
}

function getSnapshot(): ReadingLevel {
  const applied = document.documentElement.dataset.level as
    | ReadingLevel
    | undefined;
  return applied && READING_LEVELS.some((l) => l.value === applied)
    ? applied
    : "human";
}

function getServerSnapshot(): ReadingLevel {
  return "human";
}

/** Apply + persist a level, then notify subscribed switch instances. */
function setDocumentLevel(next: ReadingLevel) {
  document.documentElement.dataset.level = next;
  try {
    localStorage.setItem(READING_LEVEL_STORAGE_KEY, next);
  } catch {
    // Private mode / storage denied: the level still applies for this page.
  }
  window.dispatchEvent(new Event(LEVEL_CHANGE_EVENT));
}

/**
 * Sets the site-wide reading level. Collapsed to a book icon (with the current
 * level as its accessible name); clicking opens a menu whose heading spells out
 * "Reading level" and lists the three levels as checkable options. Sits beside
 * the brand, mirroring the version dropdown pattern on docs sites. Persists in
 * localStorage; a pre-hydration inline script in the root layout applies the
 * stored level before first paint, so there is no flash. Content switching is
 * pure CSS keyed off <html data-level>, so hydration never mismatches.
 */
export function ReadingLevelSwitch() {
  const level = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dismissOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const dismissEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("keydown", dismissEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("keydown", dismissEscape);
    };
  }, []);

  const currentLabel =
    READING_LEVELS.find((l) => l.value === level)?.label ?? "Default";

  return (
    <div ref={rootRef} data-acp="reading-level" className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Reading level: ${currentLabel}`}
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 cursor-pointer items-center gap-1 rounded-md border border-line bg-surface-raised px-2 text-ink-muted hover:border-line-strong hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <BookGlyph className="h-[1.05rem] w-[1.05rem]" />
        <ChevronGlyph
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Reading level"
          className="absolute left-0 z-50 mt-2 w-44 rounded-lg border border-line bg-surface-raised p-2 shadow-lg shadow-black/10"
        >
          <p className="px-2 pb-1 pt-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-faint">
            Reading level
          </p>
          {READING_LEVELS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="menuitemradio"
              aria-checked={value === level}
              onClick={() => {
                setDocumentLevel(value);
                setOpen(false);
              }}
              className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-surface-sunken hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                value === level ? "text-ink" : "text-ink-muted"
              }`}
            >
              {label}
              {value === level && <CheckGlyph className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BookGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M8 4c-1.4-1-3.4-1-4.8 0v8c1.4-1 3.4-1 4.8 0m0-8c1.4-1 3.4-1 4.8 0v8c-1.4-1-3.4-1-4.8 0m0-8v8" />
    </svg>
  );
}

function ChevronGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}

function CheckGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m3.5 8 3 3 6-6" />
    </svg>
  );
}
