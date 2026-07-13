const PARTS = [
  {
    name: "Title",
    note: "What is connecting to what, \"Connect Inbox Assistant to Gmail\", naming the agent, not just the service.",
  },
  {
    name: "Intent line",
    note: "Frames the grant: least-privilege by default, and that it can be changed or revoked later.",
  },
  {
    name: "Resource group",
    note: "Scopes clustered by the resource they touch, with the narrowing stated, \"Board 2026 label only\", never the whole account by default.",
  },
  {
    name: "Access badge",
    note: "The power level as text (read, write, or delete), so \"read one message\" and \"delete the inbox\" never look identical.",
  },
  {
    name: "Scope row",
    note: "One capability, individually toggleable, with a plain-language line describing what granting it actually lets the agent do.",
  },
  {
    name: "Required scope",
    note: "Mandatory for the connection to work: shown locked-on and labeled, never hidden or bundled silently into a broad grant.",
  },
  {
    name: "Grant action",
    note: "Reflects the live count (\"Connect · 3 permissions\") so the user commits to a number they can see. Declining is the calm path.",
  },
];

const ROWS = [
  { y: 144, access: "read", checked: true, required: true },
  { y: 176, access: "write", checked: false, required: false },
  { y: 208, access: "delete", checked: false, required: false },
] as const;

const BADGE_FILL: Record<string, string> = {
  read: "var(--acp-color-agent-surface)",
  write: "var(--acp-color-untrusted-surface)",
  delete: "var(--acp-color-danger-surface)",
};
const BADGE_STROKE: Record<string, string> = {
  read: "var(--acp-color-agent)",
  write: "var(--acp-color-untrusted)",
  delete: "var(--acp-color-danger)",
};

/**
 * Anatomy diagram for the Scoped Grant pattern. The SVG is decorative
 * (wireframe + numbered callouts); the ordered list below carries the
 * accessible description of each part.
 */
export function ScopedGrantAnatomy() {
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
            height="276"
            rx="12"
            fill="var(--acp-color-surface)"
            stroke="var(--acp-color-line-strong)"
          />
          {/* icon */}
          <rect
            x="94"
            y="40"
            width="32"
            height="32"
            rx="8"
            fill="var(--acp-color-agent-surface)"
            stroke="var(--acp-color-agent)"
          />
          {/* 1: title */}
          <rect x="140" y="50" width="168" height="12" rx="6" fill="var(--acp-color-ink-muted)" />
          {/* 2: intent line */}
          <rect x="94" y="86" width="224" height="8" rx="4" fill="var(--acp-color-ink-faint)" />
          {/* 3: resource group legend */}
          <rect x="94" y="112" width="56" height="10" rx="4" fill="var(--acp-color-ink-muted)" />
          <rect x="160" y="114" width="118" height="7" rx="3" fill="var(--acp-color-ink-faint)" />
          <line x1="94" y1="130" x2="376" y2="130" stroke="var(--acp-color-line)" />

          {/* scope rows */}
          {ROWS.map(({ y, access, checked, required }) => (
            <g key={y}>
              {/* checkbox */}
              <rect
                x="94"
                y={y}
                width="14"
                height="14"
                rx="3"
                fill={checked ? "var(--acp-color-approve)" : "var(--acp-color-surface)"}
                stroke={checked ? "var(--acp-color-approve)" : "var(--acp-color-line-strong)"}
              />
              {checked && (
                <path
                  d={`M 97 ${y + 7} l 3 3 5 -6`}
                  fill="none"
                  stroke="var(--acp-color-approve-ink)"
                  strokeWidth="1.6"
                />
              )}
              {/* access badge */}
              <rect
                x="118"
                y={y}
                width="42"
                height="14"
                rx="4"
                fill={BADGE_FILL[access]}
                stroke={BADGE_STROKE[access]}
              />
              {/* capability name */}
              <rect x="170" y={y + 3} width="118" height="8" rx="4" fill="var(--acp-color-ink-muted)" />
              {/* required tag */}
              {required && (
                <rect x="300" y={y + 4} width="40" height="6" rx="3" fill="var(--acp-color-ink-faint)" />
              )}
            </g>
          ))}

          {/* actions */}
          <rect
            x="212"
            y="248"
            width="80"
            height="30"
            rx="8"
            fill="none"
            stroke="var(--acp-color-line-strong)"
          />
          <rect x="300" y="248" width="76" height="30" rx="8" fill="var(--acp-color-approve)" />

          {/* callouts */}
          {[
            { n: 1, cx: 462, cy: 56, x2: 312, y2: 56 },
            { n: 2, cx: 462, cy: 90, x2: 322, y2: 90 },
            { n: 3, cx: 28, cy: 118, x2: 90, y2: 118 },
            { n: 4, cx: 28, cy: 151, x2: 114, y2: 151 },
            { n: 5, cx: 462, cy: 183, x2: 292, y2: 183 },
            { n: 6, cx: 462, cy: 151, x2: 344, y2: 151 },
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
        Anatomy of the Scoped Grant screen, with parts numbered as listed below.
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
