"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { KIND_LABEL, SEARCH_INDEX, searchDocs } from "@/lib/search-index";

// The ⌘/Ctrl hint is a device-only fact, so it is modelled as an external
// store: SSR and the first client render show "⌘", then useSyncExternalStore
// re-syncs to the real platform after hydration without an effect-driven
// setState (which eslint react-hooks/set-state-in-effect forbids).
const noopSubscribe = () => () => {};
function getModifierKey() {
  const platform = navigator.platform || navigator.userAgent;
  return /mac|iphone|ipad/i.test(platform) ? "⌘" : "Ctrl ";
}
function getModifierKeyServer() {
  return "⌘";
}

/**
 * Site-wide search in the header. Collapsed to an icon button by default;
 * clicking it reveals an input that overlays the nav links, so search never
 * has to claim a permanent column of the header. Typing filters the static
 * SEARCH_INDEX (title/description/keywords, AND-substring) into an APG-style
 * combobox: ArrowUp/Down move the active option, Enter navigates to it, Escape
 * clears then closes the listbox then collapses the input. No portal, no deps.
 */
export function SiteSearch() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const mod = useSyncExternalStore(
    noopSubscribe,
    getModifierKey,
    getModifierKeyServer,
  );

  const results = useMemo(() => searchDocs(SEARCH_INDEX, query), [query]);
  const expanded = revealed && open && query.trim().length > 0;

  useEffect(() => {
    const dismissOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setRevealed(false);
      }
    };
    document.addEventListener("pointerdown", dismissOutside);
    return () => document.removeEventListener("pointerdown", dismissOutside);
  }, []);

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setRevealed(true);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  const reveal = () => {
    setRevealed(true);
    // Focus once the input has mounted this frame.
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const collapse = () => {
    setRevealed(false);
    setOpen(false);
    setQuery("");
  };

  const navigateTo = (index: number) => {
    const doc = results[index];
    if (!doc) return;
    collapse();
    router.push(doc.href);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      if (expanded) setOpen(false);
      else if (query) setQuery("");
      else collapse();
      return;
    }
    if (!expanded && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) =>
        results.length ? (i - 1 + results.length) % results.length : 0,
      );
    } else if (event.key === "Home" && expanded) {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End" && expanded) {
      event.preventDefault();
      setActiveIndex(Math.max(results.length - 1, 0));
    } else if (event.key === "Enter") {
      if (expanded && results.length > 0) {
        event.preventDefault();
        navigateTo(Math.min(activeIndex, results.length - 1));
      }
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  const clampedActive = Math.min(activeIndex, Math.max(results.length - 1, 0));
  const activeId =
    expanded && results.length > 0
      ? `site-search-opt-${clampedActive}`
      : undefined;

  return (
    <div
      ref={rootRef}
      data-acp="site-search"
      className="relative flex shrink-0 items-center"
    >
      <button
        type="button"
        aria-label="Search site"
        aria-keyshortcuts="Meta+K Control+K"
        aria-expanded={revealed}
        onClick={() => (revealed ? collapse() : reveal())}
        className="flex h-8 items-center gap-2 rounded-md border border-line bg-surface-raised pl-2 pr-1.5 text-ink-muted hover:border-line-strong hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <SearchGlyph className="h-4 w-4" />
        <kbd className="hidden items-center rounded border border-line px-1 py-px font-mono text-[0.625rem] font-medium text-ink-faint sm:flex">
          {mod}K
        </kbd>
      </button>
      {revealed && (
        <div className="acp-search-reveal absolute right-0 top-1/2 z-50 w-[min(20rem,calc(100vw-3rem))] -translate-y-1/2">
          <div className="relative">
            <SearchGlyph className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={expanded}
              aria-controls="site-search-listbox"
              aria-activedescendant={activeId}
              aria-autocomplete="list"
              aria-label="Search site"
              autoComplete="off"
              placeholder="Search…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              className="h-8 w-full rounded-md border border-line bg-surface-raised pl-8 pr-8 text-sm text-ink placeholder:text-ink-faint hover:border-line-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={collapse}
              className="absolute right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-ink-faint hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <CloseGlyph className="h-3.5 w-3.5" />
            </button>
          </div>
          <span role="status" className="sr-only">
            {expanded ? `${results.length} results` : ""}
          </span>
          {expanded && (
            <ul
              id="site-search-listbox"
              role="listbox"
              aria-label="Search results"
              className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-auto rounded-lg border border-line bg-surface-raised p-2 shadow-lg shadow-black/10"
            >
              {results.length === 0 ? (
                <li
                  role="presentation"
                  className="px-3 py-2 text-sm text-ink-muted"
                >
                  No results
                </li>
              ) : (
                results.map((doc, i) => (
                  <li
                    key={doc.href}
                    id={`site-search-opt-${i}`}
                    role="option"
                    aria-selected={i === clampedActive}
                    onPointerDown={(e) => {
                      // pointerdown (not click) so the outside-dismiss listener
                      // never races the selection.
                      e.preventDefault();
                      navigateTo(i);
                    }}
                    onPointerMove={() => setActiveIndex(i)}
                    className={`cursor-pointer rounded-md px-3 py-2 ${
                      i === clampedActive ? "bg-surface-sunken" : ""
                    }`}
                  >
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="text-sm font-medium text-ink">
                        {doc.title}
                      </span>
                      <span className="shrink-0 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-muted">
                        {KIND_LABEL[doc.kind]}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-ink-muted">
                      {doc.description}
                    </span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function SearchGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="m10.5 10.5 3 3" strokeLinecap="round" />
    </svg>
  );
}

function CloseGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
    </svg>
  );
}
