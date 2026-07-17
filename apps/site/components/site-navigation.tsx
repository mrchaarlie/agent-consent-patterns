"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "/patterns/", label: "Patterns" },
  { href: "/research/", label: "Research" },
  { href: "/principles/", label: "Principles" },
] as const;

const BUILD = {
  label: "Build",
  items: [
    { href: "/library/", label: "React library" },
    { href: "/skill/", label: "Agent skill" },
  ],
} as const;

/**
 * Header navigation: the primary destinations are flat, always-visible links
 * (a dropdown was why the research section went undiscovered); only the
 * secondary Build docs stay grouped behind a dismissible menu.
 */
export function SiteNavigation() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const dismissOutside = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpen(false);
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

  return (
    <nav ref={navRef} aria-label="Site">
      <ul className="flex items-center gap-3 text-sm text-ink-muted sm:gap-4 md:gap-6">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li className="relative">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="site-nav-build"
            onClick={() => setOpen((current) => !current)}
            className="flex cursor-pointer items-center gap-1 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {BUILD.label}
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className={`h-3.5 w-3.5 transition-transform ${
                open ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="m4 6 4 4 4-4" />
            </svg>
          </button>
          {open && (
            <ul
              id="site-nav-build"
              className="absolute right-0 mt-3 w-44 rounded-lg border border-line bg-surface-raised p-2 shadow-lg shadow-black/10"
            >
              {BUILD.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2 hover:bg-surface-sunken hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}
