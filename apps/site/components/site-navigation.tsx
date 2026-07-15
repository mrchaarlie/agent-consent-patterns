"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NAV = [
  {
    label: "Reference",
    items: [
      { href: "/patterns/", label: "Patterns" },
      { href: "/principles/", label: "Principles" },
      { href: "/glossary/", label: "Glossary" },
    ],
  },
  {
    label: "Build",
    items: [
      { href: "/library/", label: "React library" },
      { href: "/skill/", label: "Agent skill" },
    ],
  },
] as const;

/** Header navigation with one mutually exclusive, dismissible menu at a time. */
export function SiteNavigation() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const dismissOutside = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenGroup(null);
    };
    const dismissEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenGroup(null);
    };
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("keydown", dismissEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("keydown", dismissEscape);
    };
  }, []);

  return (
    <nav ref={navRef} aria-label="Site">
      <ul className="flex gap-3 text-sm text-ink-muted sm:gap-4 md:gap-6">
        {NAV.map((group) => {
          const isOpen = openGroup === group.label;
          const menuId = `site-nav-${group.label.toLowerCase()}`;
          return (
            <li key={group.label} className="relative">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={menuId}
                onClick={() =>
                  setOpenGroup((current) =>
                    current === group.label ? null : group.label,
                  )
                }
                className="flex cursor-pointer items-center gap-1 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                {group.label}
                <svg
                  aria-hidden
                  viewBox="0 0 16 16"
                  className={`h-3.5 w-3.5 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="m4 6 4 4 4-4" />
                </svg>
              </button>
              {isOpen && (
                <ul
                  id={menuId}
                  className="absolute right-0 mt-3 w-44 rounded-lg border border-line bg-surface-raised p-2 shadow-lg shadow-black/10"
                >
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpenGroup(null)}
                        className="block rounded-md px-3 py-2 hover:bg-surface-sunken hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
