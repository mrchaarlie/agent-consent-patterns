"use client";

import { useEffect, useState } from "react";

/** Wraps the page header so it can toggle a shadow once the page scrolls past the top. */
export function SiteHeader({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line bg-surface transition-shadow ${
        scrolled ? "shadow-md shadow-black/5" : "shadow-none"
      }`}
    >
      {children}
    </header>
  );
}
