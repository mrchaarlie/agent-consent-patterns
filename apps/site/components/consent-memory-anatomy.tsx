const PARTS = [
  {
    name: "Permission question",
    note: "The grant being asked for, phrased as a question (\"Allow the agent to send email?\") so the durability choice below has a clear subject.",
  },
  {
    name: "Durability options",
    note: "A radio group over how long the answer lasts: once, this session, a scoped standing grant, an unconditional one. The choice is explicit, never a checkbox afterthought.",
  },
  {
    name: "Durability hint",
    note: "A text tag on each option, \"This time\" or \"Standing · always\", that names the persistence, so standing grants read as standing at a glance.",
  },
  {
    name: "Consequence line",
    note: "The future each choice commits to, in plain language and bound to the option for screen readers. This is the pattern: the standing implication sits one line from the choice.",
  },
  {
    name: "Standing weight",
    note: "The broadest \"always\" option carries a heavier accent than the safe default, so the fastest way out of the prompt is never visually the lightest.",
  },
  {
    name: "Confirm, labelled by choice",
    note: "The primary button names what it will do, \"Allow once\" vs \"Allow always\", so the durability is legible right up to the click.",
  },
];

/**
 * Anatomy diagram for the Consent Memory pattern. The SVG is decorative
 * (wireframe + numbered callouts); the ordered list below carries the
 * accessible description of each part.
 */
export function ConsentMemoryAnatomy() {
  return (
    <figure className="my-8">
      <div className="rounded-lg border border-line bg-surface-raised p-6">
        <svg
          viewBox="0 0 520 336"
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
            height="304"
            rx="12"
            fill="var(--acp-color-surface)"
            stroke="var(--acp-color-line-strong)"
          />
          {/* 1: permission question */}
          <rect x="88" y="34" width="196" height="12" rx="6" fill="var(--acp-color-ink-muted)" />

          {/* three routine options */}
          {[
            { y: 66, sel: false },
            { y: 116, sel: false },
          ].map(({ y }) => (
            <g key={y}>
              <rect
                x="88"
                y={y}
                width="294"
                height="42"
                rx="8"
                fill="var(--acp-color-surface)"
                stroke="var(--acp-color-line)"
              />
              {/* 2: radio */}
              <circle cx="106" cy={y + 15} r="7" fill="var(--acp-color-surface)" stroke="var(--acp-color-line-strong)" />
              <rect x="124" y={y + 9} width="90" height="8" rx="4" fill="var(--acp-color-ink-muted)" />
              {/* 3: hint tag */}
              <rect x={300} y={y + 8} width="66" height="14" rx="4" fill="var(--acp-color-agent-surface)" />
              {/* 4: consequence */}
              <rect x="124" y={y + 26} width="210" height="6" rx="3" fill="var(--acp-color-ink-faint)" />
            </g>
          ))}

          {/* 5: standing "always" option, heavier accent, selected */}
          <rect
            x="88"
            y="166"
            width="294"
            height="42"
            rx="8"
            fill="var(--acp-color-untrusted-surface)"
            stroke="var(--acp-color-untrusted)"
          />
          <circle cx="106" cy="181" r="7" fill="var(--acp-color-untrusted)" stroke="var(--acp-color-untrusted)" />
          <circle cx="106" cy="181" r="2.5" fill="var(--acp-color-surface)" />
          <rect x="124" y="175" width="110" height="8" rx="4" fill="var(--acp-color-ink-muted)" />
          <rect x="300" y="174" width="66" height="14" rx="4" fill="var(--acp-color-untrusted)" />
          <rect x="124" y="192" width="210" height="6" rx="3" fill="var(--acp-color-ink-faint)" />

          {/* actions */}
          <rect x="212" y="252" width="72" height="30" rx="8" fill="none" stroke="var(--acp-color-line-strong)" />
          {/* 6: confirm */}
          <rect x="292" y="252" width="90" height="30" rx="8" fill="var(--acp-color-untrusted)" />

          {/* callouts */}
          {[
            { n: 1, cx: 28, cy: 40, x2: 84, y2: 40 },
            { n: 2, cx: 28, cy: 81, x2: 100, y2: 81 },
            { n: 3, cx: 462, cy: 74, x2: 368, y2: 74 },
            { n: 4, cx: 462, cy: 142, x2: 336, y2: 142 },
            { n: 5, cx: 28, cy: 187, x2: 84, y2: 187 },
            { n: 6, cx: 462, cy: 267, x2: 384, y2: 267 },
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
        Anatomy of the Consent Memory prompt, with parts numbered as listed
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
