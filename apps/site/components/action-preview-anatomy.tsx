const PARTS = [
  {
    name: "Title",
    note: "The action as a verb phrase with its object: \"Send email to Dana Ito\", never \"Confirm action\".",
  },
  {
    name: "Agent icon",
    note: "Identifies this surface as agent-initiated, visually distinct from user-initiated confirmations.",
  },
  {
    name: "Fields",
    note: "The exact facts of the action: recipient, subject, amount. Values are verbatim, not summarized.",
  },
  {
    name: "Content disclosure",
    note: "Long payloads (message body, diff) available before approving, collapsed by default so facts stay scannable.",
  },
  {
    name: "Source line",
    note: "Which agent is asking and under what authority (the task or grant it is acting from).",
  },
  {
    name: "Reject action",
    note: "Visually calm, never alarming. In modal mode it receives initial focus; Escape triggers it.",
  },
  {
    name: "Approve action",
    note: "Labeled with the action's verb (\"Send email\"). Weighted to consequence, with destructive styling when irreversible.",
  },
];

/**
 * Anatomy diagram for the Action Preview pattern. The SVG is decorative
 * (wireframe + numbered callouts); the ordered list below carries the
 * accessible description of each part.
 */
export function ActionPreviewAnatomy() {
  return (
    <figure className="my-8">
      <div className="rounded-lg border border-line bg-surface-raised p-6">
        <svg
          viewBox="0 0 520 330"
          role="img"
          aria-hidden="true"
          className="mx-auto block w-full max-w-lg"
          fontFamily="var(--acp-font-mono)"
        >
          {/* card outline */}
          <rect
            x="70"
            y="16"
            width="330"
            height="298"
            rx="12"
            fill="var(--acp-color-surface)"
            stroke="var(--acp-color-line-strong)"
          />
          {/* 2: icon */}
          <rect
            x="94"
            y="40"
            width="32"
            height="32"
            rx="8"
            fill="var(--acp-color-agent-surface)"
            stroke="var(--acp-color-agent)"
          />
          {/* 1: title bar */}
          <rect x="140" y="50" width="180" height="12" rx="6" fill="var(--acp-color-ink-muted)" />
          {/* 3: field rows */}
          <line x1="94" y1="94" x2="376" y2="94" stroke="var(--acp-color-line)" />
          {[104, 132, 160].map((y) => (
            <g key={y}>
              <rect x="94" y={y} width="56" height="8" rx="4" fill="var(--acp-color-ink-faint)" />
              <rect x="170" y={y} width="150" height="8" rx="4" fill="var(--acp-color-ink-muted)" />
              <line x1="94" y1={y + 20} x2="376" y2={y + 20} stroke="var(--acp-color-line)" />
            </g>
          ))}
          {/* 4: content disclosure */}
          <path d="M 94 199 l 8 5 -8 5 z" fill="var(--acp-color-ink-muted)" />
          <rect x="110" y="200" width="96" height="8" rx="4" fill="var(--acp-color-ink-faint)" />
          {/* 5: source line */}
          <rect x="94" y="232" width="72" height="8" rx="4" fill="var(--acp-color-agent)" />
          <rect x="174" y="232" width="104" height="8" rx="4" fill="var(--acp-color-ink-faint)" />
          {/* 6: reject */}
          <rect
            x="216"
            y="262"
            width="72"
            height="30"
            rx="8"
            fill="none"
            stroke="var(--acp-color-line-strong)"
          />
          {/* 7: approve */}
          <rect x="296" y="262" width="80" height="30" rx="8" fill="var(--acp-color-approve)" />

          {/* callouts */}
          {[
            { n: 1, cx: 462, cy: 56, x2: 324, y2: 56 },
            { n: 2, cx: 28, cy: 56, x2: 90, y2: 56 },
            { n: 3, cx: 462, cy: 136, x2: 324, y2: 136 },
            { n: 4, cx: 462, cy: 205, x2: 210, y2: 205 },
            { n: 5, cx: 28, cy: 236, x2: 90, y2: 236 },
            { n: 6, cx: 28, cy: 277, x2: 212, y2: 277 },
            { n: 7, cx: 462, cy: 277, x2: 380, y2: 277 },
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
        Anatomy of the Action Preview card, with parts numbered as listed
        below.
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
