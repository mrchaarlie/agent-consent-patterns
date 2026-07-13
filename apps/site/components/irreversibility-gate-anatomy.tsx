const PARTS = [
  {
    name: "Severity icon",
    note: "Signals the friction tier at a glance and turns to a danger mark when the action is irreversible.",
  },
  {
    name: "Title",
    note: "The action as a verb phrase, \"Permanently delete 1,240 files\", stating the stakes in the name itself.",
  },
  {
    name: "Description",
    note: "One line of framing: who is asking and what they intend, above the specifics.",
  },
  {
    name: "Consequences",
    note: "The exact, enumerated effects, how many, how much, and plainly whether it can be undone. Never a vague \"are you sure?\".",
  },
  {
    name: "Type-to-confirm",
    note: "Appears only at the irreversible tier. A deliberate, screen-reader-legible gesture. The accessible alternative to hold-to-confirm.",
  },
  {
    name: "Cancel action",
    note: "Calm and never alarming. In modal mode it receives initial focus; Escape triggers it. Backing out is always the easy path.",
  },
  {
    name: "Confirm action",
    note: "Weighted to consequence, destructive styling at high severity, and disabled until the gate's condition is met.",
  },
];

/**
 * Anatomy diagram for the Irreversibility Gate pattern. The SVG is
 * decorative (wireframe + numbered callouts); the ordered list below carries
 * the accessible description of each part.
 */
export function IrreversibilityGateAnatomy() {
  return (
    <figure className="my-8">
      <div className="rounded-lg border border-line bg-surface-raised p-6">
        <svg
          viewBox="0 0 520 316"
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
            height="284"
            rx="12"
            fill="var(--acp-color-surface)"
            stroke="var(--acp-color-line-strong)"
          />
          {/* 1: severity icon */}
          <rect
            x="94"
            y="36"
            width="32"
            height="32"
            rx="8"
            fill="var(--acp-color-danger-surface)"
            stroke="var(--acp-color-danger)"
          />
          {/* 2: title bar */}
          <rect x="140" y="46" width="180" height="12" rx="6" fill="var(--acp-color-ink-muted)" />
          {/* 3: description line */}
          <rect x="94" y="84" width="228" height="8" rx="4" fill="var(--acp-color-ink-faint)" />
          {/* 4: consequences box */}
          <rect
            x="94"
            y="104"
            width="282"
            height="60"
            rx="8"
            fill="var(--acp-color-surface-sunken)"
          />
          {[122, 144].map((y) => (
            <g key={y}>
              <path d={`M 110 ${y} l 6 4 -6 4 z`} fill="var(--acp-color-danger)" />
              <rect x="124" y={y} width="228" height="8" rx="4" fill="var(--acp-color-ink-muted)" />
            </g>
          ))}
          {/* 5: type-to-confirm */}
          <rect x="94" y="182" width="120" height="8" rx="4" fill="var(--acp-color-ink-faint)" />
          <rect
            x="94"
            y="198"
            width="282"
            height="28"
            rx="8"
            fill="var(--acp-color-surface)"
            stroke="var(--acp-color-line-strong)"
          />
          {/* 6: cancel */}
          <rect
            x="212"
            y="248"
            width="72"
            height="30"
            rx="8"
            fill="none"
            stroke="var(--acp-color-line-strong)"
          />
          {/* 7: confirm */}
          <rect x="292" y="248" width="84" height="30" rx="8" fill="var(--acp-color-danger)" />

          {/* callouts */}
          {[
            { n: 1, cx: 28, cy: 52, x2: 90, y2: 52 },
            { n: 2, cx: 462, cy: 52, x2: 324, y2: 52 },
            { n: 3, cx: 462, cy: 88, x2: 326, y2: 88 },
            { n: 4, cx: 462, cy: 134, x2: 380, y2: 134 },
            { n: 5, cx: 28, cy: 212, x2: 90, y2: 212 },
            { n: 6, cx: 28, cy: 263, x2: 208, y2: 263 },
            { n: 7, cx: 462, cy: 263, x2: 380, y2: 263 },
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
        Anatomy of the Irreversibility Gate, with parts numbered as listed
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
