const PARTS = [
  {
    name: "The surface",
    note: "One place for every numeric guardrail (budget caps, action counts, time windows) instead of scattering them across billing pages and hidden defaults.",
  },
  {
    name: "Guardrail summary",
    note: "A live tally (\"1 cap reached · 1 near cap\"), so the user can see at a glance how close the agent is to the edges of what it may do alone.",
  },
  {
    name: "Limit",
    note: "One guardrail, named in plain language with a Budget or Rate badge so it's clear whether the cap meters money or a count of actions.",
  },
  {
    name: "Usage meter",
    note: "Consumption drawn against the cap, with the numbers in text. The boundary is legible, not a figure the user has to reconstruct from a receipt.",
  },
  {
    name: "Cap control",
    note: "The cap is an editable number with its unit and window, so the user can tighten or loosen the guardrail in place. The limit is a control, not a fixed setting.",
  },
  {
    name: "Reached cap",
    note: "A cap that's been hit reads as a consent event, not a failure: the agent pauses here and comes back to ask rather than silently stopping or pushing past.",
  },
];

/**
 * Anatomy diagram for the Spend & Rate Limits pattern. The SVG is decorative
 * (wireframe + numbered callouts); the ordered list below carries the
 * accessible description of each part.
 */
export function SpendLimitsAnatomy() {
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
          {/* 1: title */}
          <rect x="78" y="34" width="200" height="12" rx="6" fill="var(--acp-color-ink-muted)" />
          {/* 2: summary */}
          <rect x="78" y="58" width="150" height="8" rx="4" fill="var(--acp-color-danger)" />

          {/* three limit rows: ok, near cap, reached */}
          {[
            { y: 86, state: "ok" as const, fill: 0.35 },
            { y: 140, state: "warning" as const, fill: 0.85 },
            { y: 194, state: "reached" as const, fill: 1 },
          ].map(({ y, state, fill }) => {
            const accent =
              state === "reached"
                ? "var(--acp-color-danger)"
                : state === "warning"
                  ? "var(--acp-color-untrusted)"
                  : "var(--acp-color-agent)";
            const trackX = 82;
            const trackW = 150;
            return (
              <g key={y}>
                {/* left state accent */}
                <rect x="66" y={y} width="3" height="40" rx="1.5" fill={accent} />
                {/* 3: kind badge + limit name */}
                <rect x={trackX} y={y + 2} width="34" height="12" rx="3" fill="var(--acp-color-surface-sunken)" stroke="var(--acp-color-line)" />
                <rect x="124" y={y + 4} width="80" height="8" rx="4" fill="var(--acp-color-ink-muted)" />
                {/* 4: usage meter track + fill */}
                <rect x={trackX} y={y + 24} width={trackW} height="6" rx="3" fill="var(--acp-color-surface-sunken)" />
                <rect x={trackX} y={y + 24} width={trackW * fill} height="6" rx="3" fill={accent} />
                {/* 5: cap control */}
                <rect x="316" y={y + 6} width="80" height="24" rx="6" fill="var(--acp-color-surface)" stroke="var(--acp-color-line-strong)" />
                <rect x="324" y={y + 14} width="40" height="8" rx="4" fill="var(--acp-color-ink-muted)" />
              </g>
            );
          })}

          {/* callouts */}
          {[
            { n: 1, cx: 26, cy: 40, x2: 74, y2: 40 },
            { n: 2, cx: 26, cy: 62, x2: 74, y2: 62 },
            { n: 3, cx: 26, cy: 96, x2: 78, y2: 96 },
            { n: 4, cx: 26, cy: 218, x2: 78, y2: 218 },
            { n: 5, cx: 484, cy: 150, x2: 400, y2: 150 },
            { n: 6, cx: 484, cy: 208, x2: 400, y2: 208 },
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
        Anatomy of the Spend &amp; Rate Limits surface, with parts numbered as
        listed below.
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
