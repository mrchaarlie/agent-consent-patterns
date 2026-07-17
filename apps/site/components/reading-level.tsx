"use client";

import { useSyncExternalStore } from "react";
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
 * Compact dropdown that sets the site-wide reading level. The visible cue is
 * an "Aa" glyph; the accessible name stays "Reading level" via the sr-only
 * label. Persists in localStorage; a pre-hydration inline script in the root
 * layout applies the stored level before first paint, so there is no flash.
 * Content switching is pure CSS keyed off <html data-level>, so hydration
 * never mismatches.
 */
export function ReadingLevelSwitch() {
  const level = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div data-acp="reading-level" className="flex shrink-0 items-center gap-1.5">
      <label htmlFor="reading-level" className="sr-only">
        Reading level
      </label>
      <span
        aria-hidden
        className="font-mono text-[0.6875rem] text-ink-faint"
        title="Reading level"
      >
        Aa
      </span>
      <select
        id="reading-level"
        value={level}
        onChange={(e) => setDocumentLevel(e.target.value as ReadingLevel)}
        title="Reading level"
        className="h-8 cursor-pointer rounded-md border border-line bg-surface-raised px-1.5 text-xs text-ink hover:border-line-strong"
      >
        {READING_LEVELS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
