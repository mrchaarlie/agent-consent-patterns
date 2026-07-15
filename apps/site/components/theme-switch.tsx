"use client";

import { useSyncExternalStore } from "react";

export type ThemePreference = "system" | "light" | "dark";

const THEMES: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export const THEME_STORAGE_KEY = "acp-theme";

const THEME_CHANGE_EVENT = "acp-themechange";

function applyTheme(next: ThemePreference) {
  if (next === "system") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = next;
  }
}

// The source of truth is <html data-theme>, set pre-paint by the inline
// script in the root layout and updated here. Modelled as an external store
// so the control stays in sync with cross-tab changes without effect-driven
// setState — mirrors ReadingLevelSwitch.
function subscribe(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key !== THEME_STORAGE_KEY) return;
    applyTheme(e.newValue === "light" || e.newValue === "dark" ? e.newValue : "system");
    onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}

function getSnapshot(): ThemePreference {
  const applied = document.documentElement.dataset.theme;
  return applied === "light" || applied === "dark" ? applied : "system";
}

function getServerSnapshot(): ThemePreference {
  return "system";
}

/** Apply + persist a theme preference, then notify subscribed switch instances. */
function setTheme(next: ThemePreference) {
  applyTheme(next);
  try {
    if (next === "system") {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    }
  } catch {
    // Private mode / storage denied: the theme still applies for this page.
  }
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

/**
 * Labelled theme dropdown (system/light/dark). Persists in localStorage; a
 * pre-hydration inline script in the root layout applies the stored
 * preference before first paint, so there is no flash. "System" clears the
 * override and falls back to prefers-color-scheme.
 */
export function ThemeSwitch() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div data-acp="theme-switch" className="flex items-center gap-2">
      <label
        htmlFor="theme"
        className="font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-faint"
      >
        Theme
      </label>
      <select
        id="theme"
        value={theme}
        onChange={(e) => setTheme(e.target.value as ThemePreference)}
        className="cursor-pointer rounded-md border border-line bg-surface-raised px-2 py-1 text-xs text-ink hover:border-line-strong"
      >
        {THEMES.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
