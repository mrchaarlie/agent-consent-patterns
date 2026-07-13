const PARTS = [
  {
    name: "The question",
    note: "One surface, one framing (\"what can this agent do on its own?\"), so standing authority lives in a single reviewable place instead of scattered across prompts.",
  },
  {
    name: "Authority summary",
    note: "A live tally (\"2 automatic · 2 ask first · 1 off-limits\"), so the total amount of standing power is visible at a glance, not inferred row by row.",
  },
  {
    name: "Capability",
    note: "One thing the agent can do, named in plain language with a read / write / delete badge so the stakes of each row are legible.",
  },
  {
    name: "Segmented control",
    note: "The heart of the row: each capability sits on exactly one level (Automatic, Ask first, or Never) as a single, explicit choice.",
  },
  {
    name: "Ask-first / off-limits",
    note: "The two non-automatic levels answer the second half of the question: what the agent must always confirm, and what it may never do at all.",
  },
  {
    name: "Forbidden level",
    note: "A high-stakes capability can bar Automatic entirely, struck through and unselectable. The surface refuses to grant standing authority to the irreversible.",
  },
];

/**
 * Anatomy diagram for the Authority Boundary pattern. The SVG is decorative
 * (wireframe + numbered callouts); the ordered list below carries the
 * accessible description of each part.
 */
export function AuthorityBoundaryAnatomy() {
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
          <rect x="78" y="58" width="150" height="8" rx="4" fill="var(--acp-color-agent)" />

          {/* three capability rows: auto, ask, never(forbidden auto) */}
          {[
            { y: 86, level: "auto" as const },
            { y: 140, level: "ask" as const },
            { y: 194, level: "never" as const },
          ].map(({ y, level }) => {
            const accent =
              level === "auto"
                ? "var(--acp-color-agent)"
                : level === "never"
                  ? "var(--acp-color-danger)"
                  : "var(--acp-color-line)";
            return (
              <g key={y}>
                {/* left level accent */}
                <rect x="66" y={y} width="3" height="34" rx="1.5" fill={accent} />
                {/* 3: capability name + badge */}
                <rect x="82" y={y + 4} width="30" height="12" rx="3" fill="var(--acp-color-surface-sunken)" stroke="var(--acp-color-line)" />
                <rect x="120" y={y + 6} width="96" height="8" rx="4" fill="var(--acp-color-ink-muted)" />
                <rect x="82" y={y + 22} width="140" height="6" rx="3" fill="var(--acp-color-ink-faint)" />
                {/* 4: segmented control */}
                <rect x="256" y={y + 4} width="140" height="24" rx="6" fill="var(--acp-color-surface)" stroke="var(--acp-color-line-strong)" />
                <line x1="303" y1={y + 4} x2="303" y2={y + 28} stroke="var(--acp-color-line)" />
                <line x1="350" y1={y + 4} x2="350" y2={y + 28} stroke="var(--acp-color-line)" />
                {/* filled segment reflects the level */}
                {level === "auto" && (
                  <rect x="256" y={y + 4} width="47" height="24" rx="6" fill="var(--acp-color-agent)" />
                )}
                {level === "ask" && (
                  <rect x="303" y={y + 4} width="47" height="24" fill="var(--acp-color-surface-sunken)" />
                )}
                {level === "never" && (
                  <>
                    <rect x="350" y={y + 4} width="46" height="24" rx="6" fill="var(--acp-color-danger)" />
                    {/* 6: forbidden auto, struck through */}
                    <line x1="264" y1={y + 16} x2="296" y2={y + 16} stroke="var(--acp-color-ink-faint)" />
                  </>
                )}
              </g>
            );
          })}

          {/* callouts */}
          {[
            { n: 1, cx: 26, cy: 40, x2: 74, y2: 40 },
            { n: 2, cx: 26, cy: 62, x2: 74, y2: 62 },
            { n: 3, cx: 26, cy: 103, x2: 78, y2: 103 },
            { n: 4, cx: 484, cy: 103, x2: 400, y2: 103 },
            { n: 5, cx: 484, cy: 157, x2: 400, y2: 157 },
            { n: 6, cx: 484, cy: 211, x2: 400, y2: 211 },
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
        Anatomy of the Authority Boundary surface, with parts numbered as listed
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
