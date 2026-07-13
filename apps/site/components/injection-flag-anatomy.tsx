const PARTS = [
  {
    name: "The flag",
    note: "The surface exists at all. An instruction from untrusted content stops and shows itself instead of executing silently. The whole card carries the untrusted accent so it never reads like a routine prompt.",
  },
  {
    name: "Provenance",
    note: "Where the instruction came from, in plain words (\"a web page you asked me to summarise\", with a specific pointer), so the user knows this did not come from them.",
  },
  {
    name: "Verbatim quote",
    note: "The instruction shown exactly as it appeared, visually fenced as foreign text, not paraphrased. Seeing the literal words is what lets the user judge it.",
  },
  {
    name: "Consequence",
    note: "What following the instruction would actually do, stated concretely, so the stakes of proceeding are legible rather than hidden behind a neutral button.",
  },
  {
    name: "Dismiss (default)",
    note: "Ignore the instruction and keep doing what the user asked. This is the emphasised, safe resting choice, and in modal mode it takes initial focus.",
  },
  {
    name: "Proceed (subordinate)",
    note: "Following the instruction is possible but deliberately understated and danger-tinted, so the interface never nudges the user toward obeying untrusted content.",
  },
];

/**
 * Anatomy diagram for the Injection Flag pattern. The SVG is decorative
 * (wireframe + numbered callouts); the ordered list below carries the
 * accessible description of each part.
 */
export function InjectionFlagAnatomy() {
  return (
    <figure className="my-8">
      <div className="rounded-lg border border-line bg-surface-raised p-6">
        <svg
          viewBox="0 0 520 340"
          role="img"
          aria-hidden="true"
          className="mx-auto block w-full max-w-lg"
          fontFamily="var(--acp-font-mono)"
        >
          {/* card outline, untrusted border */}
          <rect
            x="60"
            y="16"
            width="352"
            height="308"
            rx="12"
            fill="var(--acp-color-surface)"
            stroke="var(--acp-color-untrusted)"
          />
          {/* icon + title */}
          <rect x="78" y="34" width="22" height="22" rx="5" fill="var(--acp-color-untrusted-surface)" stroke="var(--acp-color-untrusted)" />
          <rect x="110" y="40" width="180" height="10" rx="5" fill="var(--acp-color-ink-muted)" />

          {/* 2: provenance row */}
          <rect x="78" y="72" width="60" height="8" rx="4" fill="var(--acp-color-ink-faint)" />
          <rect x="144" y="72" width="120" height="8" rx="4" fill="var(--acp-color-untrusted)" />

          {/* 3: verbatim quote, fenced block */}
          <rect x="78" y="96" width="316" height="70" rx="4" fill="var(--acp-color-untrusted-surface)" />
          <rect x="78" y="96" width="4" height="70" fill="var(--acp-color-untrusted)" />
          <rect x="96" y="108" width="280" height="7" rx="3.5" fill="var(--acp-color-ink-muted)" />
          <rect x="96" y="124" width="264" height="7" rx="3.5" fill="var(--acp-color-ink-muted)" />
          <rect x="96" y="140" width="230" height="7" rx="3.5" fill="var(--acp-color-ink-muted)" />

          {/* 4: consequence */}
          <rect x="78" y="182" width="300" height="8" rx="4" fill="var(--acp-color-ink)" />
          <rect x="78" y="196" width="250" height="8" rx="4" fill="var(--acp-color-ink)" />

          {/* actions row */}
          {/* 5: dismiss, emphasised */}
          <rect x="188" y="270" width="120" height="30" rx="6" fill="var(--acp-color-agent)" />
          {/* 6: proceed, subordinate/danger outline */}
          <rect x="316" y="270" width="78" height="30" rx="6" fill="transparent" stroke="var(--acp-color-danger)" />

          {/* callouts */}
          {[
            { n: 1, cx: 26, cy: 45, x2: 74, y2: 45 },
            { n: 2, cx: 26, cy: 76, x2: 74, y2: 76 },
            { n: 3, cx: 26, cy: 131, x2: 74, y2: 131 },
            { n: 4, cx: 26, cy: 192, x2: 74, y2: 192 },
            { n: 5, cx: 484, cy: 250, x2: 248, y2: 268 },
            { n: 6, cx: 484, cy: 300, x2: 396, y2: 285 },
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
        Anatomy of the Injection Flag surface, with parts numbered as listed
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
