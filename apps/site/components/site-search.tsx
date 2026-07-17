"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { KIND_LABEL, SEARCH_INDEX, searchDocs } from "@/lib/search-index";

/**
 * Site-wide search in the header: an APG-style combobox over the static
 * SEARCH_INDEX. Typing filters (title/description/keywords, AND-substring);
 * ArrowUp/Down move the active option, Enter navigates to it, Escape closes.
 * No portal, no dependencies — the listbox is an absolutely positioned panel
 * styled like the nav dropdown.
 */
export function SiteSearch() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => searchDocs(SEARCH_INDEX, query), [query]);
  const expanded = open && query.trim().length > 0;

  useEffect(() => {
    const dismissOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismissOutside);
    return () => document.removeEventListener("pointerdown", dismissOutside);
  }, []);

  const navigateTo = (index: number) => {
    const doc = results[index];
    if (!doc) return;
    setOpen(false);
    setQuery("");
    router.push(doc.href);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      if (expanded) {
        setOpen(false);
      } else if (query) {
        setQuery("");
      }
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
    <div ref={rootRef} data-acp="site-search" className="relative w-full">
      <input
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
        className="h-8 w-full rounded-md border border-line bg-surface-raised px-2.5 text-sm text-ink placeholder:text-ink-faint hover:border-line-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      />
      <span role="status" className="sr-only">
        {expanded ? `${results.length} results` : ""}
      </span>
      {expanded && (
        <ul
          id="site-search-listbox"
          role="listbox"
          aria-label="Search results"
          className="absolute right-0 z-50 mt-2 max-h-80 w-72 overflow-auto rounded-lg border border-line bg-surface-raised p-2 shadow-lg shadow-black/10 sm:w-80"
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
  );
}
