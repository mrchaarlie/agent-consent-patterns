const PARTS = [
  {
    name: "Identity",
    note: "Who is connected to what. The agent and the service together, so the card names a relationship, not just an app.",
  },
  {
    name: "Status",
    note: "The lifecycle state as text (active, paused, needs re-auth, expired), never signalled by color alone.",
  },
  {
    name: "Grant state",
    note: "The capabilities currently active, each with its access level. This is the standing grant made visible after the fact.",
  },
  {
    name: "Recency",
    note: "When the agent last used the connection, and ideally what it did. The thread back to the Action Receipt.",
  },
  {
    name: "Manage",
    note: "A path back into the grant itself (Scoped Grant) to widen or narrow capabilities without disconnecting.",
  },
  {
    name: "Pause",
    note: "A reversible stop, halt the agent's access without tearing down the connection or re-doing consent.",
  },
  {
    name: "Revoke",
    note: "The destructive disconnect, styled with caution. A consequential revoke can compose with the Irreversibility Gate.",
  },
];

/**
 * Anatomy diagram for the Connection Card pattern. The SVG is decorative
 * (wireframe + numbered callouts); the ordered list below carries the
 * accessible description of each part.
 */
export function ConnectionCardAnatomy() {
  return (
    <figure className="my-8">
      <div className="rounded-lg border border-line bg-surface-raised p-6">
        <svg
          viewBox="0 0 520 260"
          role="img"
          aria-hidden="true"
          className="mx-auto block w-full max-w-lg"
          fontFamily="var(--acp-font-mono)"
        >
          {/* card outline */}
          <rect
            x="60"
            y="16"
            width="400"
            height="206"
            rx="12"
            fill="var(--acp-color-surface)"
            stroke="var(--acp-color-line-strong)"
          />
          {/* 1: identity, icon + title */}
          <rect
            x="80"
            y="36"
            width="32"
            height="32"
            rx="8"
            fill="var(--acp-color-agent-surface)"
            stroke="var(--acp-color-agent)"
          />
          <rect x="122" y="46" width="150" height="12" rx="6" fill="var(--acp-color-ink-muted)" />
          {/* 2: status badge */}
          <rect
            x="372"
            y="40"
            width="64"
            height="18"
            rx="4"
            fill="var(--acp-color-agent-surface)"
            stroke="var(--acp-color-agent)"
          />
          {/* 3: grant state, scope chips */}
          <rect x="80" y="92" width="40" height="14" rx="4" fill="var(--acp-color-agent-surface)" stroke="var(--acp-color-agent)" />
          <rect x="126" y="94" width="92" height="9" rx="4" fill="var(--acp-color-ink-muted)" />
          <rect x="234" y="92" width="42" height="14" rx="4" fill="var(--acp-color-untrusted-surface)" stroke="var(--acp-color-untrusted)" />
          <rect x="282" y="94" width="80" height="9" rx="4" fill="var(--acp-color-ink-muted)" />
          {/* 4: recency + dates */}
          <rect x="80" y="128" width="56" height="7" rx="3" fill="var(--acp-color-ink-faint)" />
          <rect x="146" y="128" width="80" height="7" rx="3" fill="var(--acp-color-ink-muted)" />
          <rect x="256" y="128" width="56" height="7" rx="3" fill="var(--acp-color-ink-faint)" />
          <rect x="322" y="128" width="60" height="7" rx="3" fill="var(--acp-color-ink-muted)" />
          {/* divider */}
          <line x1="80" y1="158" x2="440" y2="158" stroke="var(--acp-color-line)" />
          {/* 5: manage */}
          <rect x="80" y="172" width="66" height="28" rx="8" fill="none" stroke="var(--acp-color-line-strong)" />
          {/* 6: pause */}
          <rect x="154" y="172" width="60" height="28" rx="8" fill="none" stroke="var(--acp-color-line-strong)" />
          {/* 7: revoke (danger) */}
          <rect x="384" y="172" width="56" height="28" rx="8" fill="none" stroke="var(--acp-color-danger)" />

          {/* callouts */}
          {[
            { n: 1, cx: 24, cy: 52, x2: 78, y2: 52 },
            { n: 2, cx: 496, cy: 49, x2: 438, y2: 49 },
            { n: 3, cx: 24, cy: 99, x2: 78, y2: 99 },
            { n: 4, cx: 496, cy: 131, x2: 384, y2: 131 },
            { n: 5, cx: 24, cy: 186, x2: 78, y2: 186 },
            { n: 6, cx: 184, cy: 244, x2: 184, y2: 200 },
            { n: 7, cx: 496, cy: 186, x2: 442, y2: 186 },
          ].map(({ n, cx, cy, x2, y2 }) => (
            <g key={n}>
              <line
                x1={cx}
                y1={cy}
                x2={x2}
                y2={y2}
                stroke="var(--acp-color-ink-faint)"
                strokeDasharray="3 3"
              />
              <circle
                cx={cx}
                cy={cy}
                r="12"
                fill="var(--acp-color-surface)"
                stroke="var(--acp-color-ink)"
              />
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                fontSize="12"
                fill="var(--acp-color-ink)"
              >
                {n}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="sr-only">
        Anatomy of the Connection Card, with parts numbered as listed below.
      </figcaption>
      <ol className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {PARTS.map((part, i) => (
          <li key={part.name} className="flex gap-3 text-sm">
            <span
              className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full border border-ink font-mono text-[11px]"
              aria-hidden
            >
              {i + 1}
            </span>
            <span>
              <strong className="font-semibold">{part.name}.</strong>{" "}
              <span className="text-ink-muted">{part.note}</span>
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
