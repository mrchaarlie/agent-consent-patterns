const PARTS = [
  {
    name: "What happened",
    note: "The action stated in the past tense (\"Sent email to Dana Ito\"), with an outcome badge (Completed / Undone / Failed) so the result is legible at a glance, in text and not colour alone.",
  },
  {
    name: "Exact details",
    note: "The concrete facts of what was done (recipient, subject, amount), the same values the user would have seen in an Action Preview, now preserved as the record.",
  },
  {
    name: "Under what authority",
    note: "The receipt's distinct job: naming the grant, approval, or standing rule the action ran under, so the user can see why the agent was allowed to do this, not just that it did.",
  },
  {
    name: "When",
    note: "A timestamp and reference, so the receipt sits in an auditable timeline and a specific action can be pointed to later.",
  },
  {
    name: "Undo",
    note: "A real reversal for a reversible action. It's the interactive heart of the receipt, consent that extends past approval into the ability to take it back.",
  },
  {
    name: "Honest absence of undo",
    note: "When the action can't be reversed, or already has been, the button becomes an inert note (\"Can't be undone\", \"Undone\"). The surface never dangles an undo it can't honour.",
  },
];

/**
 * Anatomy diagram for the Action Receipt pattern. The SVG is decorative
 * (wireframe + numbered callouts); the ordered list below carries the
 * accessible description of each part.
 */
export function ActionReceiptAnatomy() {
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
            x="60"
            y="16"
            width="352"
            height="298"
            rx="12"
            fill="var(--acp-color-surface)"
            stroke="var(--acp-color-line-strong)"
          />
          {/* icon + title + outcome badge */}
          <rect x="78" y="32" width="22" height="22" rx="5" fill="var(--acp-color-agent-surface)" stroke="var(--acp-color-agent)" />
          <rect x="110" y="38" width="150" height="10" rx="5" fill="var(--acp-color-ink-muted)" />
          <rect x="330" y="36" width="64" height="16" rx="4" fill="var(--acp-color-agent-surface)" />

          {/* 2: detail rows */}
          <line x1="78" y1="72" x2="394" y2="72" stroke="var(--acp-color-line)" />
          {[84, 108].map((y) => (
            <g key={y}>
              <rect x="78" y={y} width="44" height="7" rx="3.5" fill="var(--acp-color-ink-faint)" />
              <rect x="150" y={y} width="150" height="7" rx="3.5" fill="var(--acp-color-ink-muted)" />
              <line x1="78" y1={y + 16} x2="394" y2={y + 16} stroke="var(--acp-color-line)" />
            </g>
          ))}

          {/* 3: authority block, agent-tinted */}
          <rect x="78" y="146" width="316" height="30" rx="6" fill="var(--acp-color-agent-surface)" />
          <rect x="90" y="157" width="70" height="8" rx="4" fill="var(--acp-color-ink-faint)" />
          <rect x="170" y="157" width="120" height="8" rx="4" fill="var(--acp-color-agent)" />

          {/* 4: meta row */}
          <rect x="78" y="192" width="40" height="6" rx="3" fill="var(--acp-color-ink-faint)" />
          <rect x="126" y="192" width="70" height="6" rx="3" fill="var(--acp-color-ink-muted)" />
          <rect x="214" y="192" width="46" height="6" rx="3" fill="var(--acp-color-ink-faint)" />
          <rect x="268" y="192" width="60" height="6" rx="3" fill="var(--acp-color-ink-muted)" />

          {/* 5/6: undo action */}
          <line x1="78" y1="222" x2="394" y2="222" stroke="var(--acp-color-line)" />
          <rect x="78" y="236" width="86" height="28" rx="6" fill="transparent" stroke="var(--acp-color-line-strong)" />
          <rect x="94" y="246" width="54" height="8" rx="4" fill="var(--acp-color-ink-muted)" />

          {/* callouts */}
          {[
            { n: 1, cx: 26, cy: 44, x2: 74, y2: 44 },
            { n: 2, cx: 26, cy: 92, x2: 74, y2: 92 },
            { n: 3, cx: 26, cy: 161, x2: 74, y2: 161 },
            { n: 4, cx: 26, cy: 195, x2: 74, y2: 195 },
            { n: 5, cx: 484, cy: 240, x2: 168, y2: 250 },
            { n: 6, cx: 484, cy: 290, x2: 168, y2: 258 },
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
        Anatomy of the Action Receipt surface, with parts numbered as listed
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
