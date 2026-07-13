"use client";

import { useState } from "react";

/** A copyable command/code block. `code` is both the rendered text and what gets copied. */
export function CodeBlock({
  code,
  className = "mt-4",
}: {
  code: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable or permission denied; button stays as-is.
    }
  }

  return (
    <div className={`group relative ${className}`}>
      <pre
        tabIndex={0}
        className="overflow-x-auto rounded-lg border border-line bg-surface-sunken p-3 pr-11 font-mono text-xs leading-relaxed text-ink"
      >
        <code>{code}</code>
      </pre>
      {/* Long lines scroll under the fixed button; fade masks them so the button stays legible. */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-full w-12 rounded-r-lg bg-gradient-to-l from-surface-sunken from-40% to-transparent"
      />
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
        className="absolute right-2 top-2 rounded-md border border-line bg-surface-raised p-1.5 text-ink-faint shadow-sm transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-agent"
      >
        {copied ? (
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 8.5 6.5 12 13 4.5" />
          </svg>
        ) : (
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
            <path d="M3 10.5V3.5A1.5 1.5 0 0 1 4.5 2h7" />
          </svg>
        )}
      </button>
    </div>
  );
}
