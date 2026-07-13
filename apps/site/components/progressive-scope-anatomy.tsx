const PARTS = [
  {
    name: "The ask",
    note: "Stated plainly and specifically: \"Inbox Assistant needs to send email\", not a generic \"grant more access\".",
  },
  {
    name: "Reason",
    note: "Why now, tied to the concrete action the agent is blocked on. The justification arrives with the request, in context.",
  },
  {
    name: "Requested capability",
    note: "Exactly one new scope, with its access level as a text badge. The minimal escalation, never a re-grant of everything.",
  },
  {
    name: "Current grant",
    note: "What the agent already holds, so the ask reads as additive: you allowed read; it now needs this one more thing.",
  },
  {
    name: "Deny",
    note: "The calm, least-escalation resting choice. In modal mode it receives initial focus; Escape triggers it.",
  },
  {
    name: "Allow once",
    note: "Grant the capability for just the blocked action; the agent stays un-escalated afterward.",
  },
  {
    name: "Allow always",
    note: "Escalate the capability into the standing grant. Deliberately styled subordinate to \"once\" so the UI never nudges toward over-granting.",
  },
];

/**
 * Anatomy diagram for the Progressive Scope pattern. The SVG is decorative
 * (wireframe + numbered callouts); the ordered list below carries the
 * accessible description of each part.
 */
export function ProgressiveScopeAnatomy() {
  return (
    <figure className="my-8">
      <div className="rounded-lg border border-line bg-surface-raised p-6">
        <svg
          viewBox="0 0 520 300"
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
            height="236"
            rx="12"
            fill="var(--acp-color-surface)"
            stroke="var(--acp-color-line-strong)"
          />
          {/* escalation accent stripe */}
          <rect x="72" y="30" width="3" height="208" rx="1.5" fill="var(--acp-color-untrusted)" />
          {/* icon */}
          <rect
            x="92"
            y="40"
            width="32"
            height="32"
            rx="8"
            fill="var(--acp-color-agent-surface)"
            stroke="var(--acp-color-agent)"
          />
          {/* 1: the ask (title) */}
          <rect x="136" y="50" width="168" height="12" rx="6" fill="var(--acp-color-ink-muted)" />
          {/* 2: reason */}
          <rect x="92" y="86" width="296" height="8" rx="4" fill="var(--acp-color-ink-faint)" />
          <rect x="92" y="100" width="210" height="8" rx="4" fill="var(--acp-color-ink-faint)" />
          {/* 3: requested capability */}
          <rect x="92" y="118" width="296" height="46" rx="8" fill="var(--acp-color-surface-sunken)" />
          <rect
            x="104"
            y="128"
            width="42"
            height="14"
            rx="4"
            fill="var(--acp-color-untrusted-surface)"
            stroke="var(--acp-color-untrusted)"
          />
          <rect x="156" y="130" width="150" height="10" rx="5" fill="var(--acp-color-ink-muted)" />
          <rect x="104" y="150" width="230" height="6" rx="3" fill="var(--acp-color-ink-faint)" />
          {/* 4: current grant */}
          <path
            d="M 92 181 l 3 3 5 -6"
            fill="none"
            stroke="var(--acp-color-approve)"
            strokeWidth="1.6"
          />
          <rect x="108" y="178" width="220" height="8" rx="4" fill="var(--acp-color-ink-faint)" />
          {/* 5: deny */}
          <rect
            x="164"
            y="210"
            width="56"
            height="30"
            rx="8"
            fill="none"
            stroke="var(--acp-color-line-strong)"
          />
          {/* 7: allow always (subordinate outline) */}
          <rect
            x="228"
            y="210"
            width="72"
            height="30"
            rx="8"
            fill="none"
            stroke="var(--acp-color-line-strong)"
          />
          {/* 6: allow once (primary) */}
          <rect x="308" y="210" width="80" height="30" rx="8" fill="var(--acp-color-approve)" />

          {/* callouts */}
          {[
            { n: 1, cx: 462, cy: 56, x2: 308, y2: 56 },
            { n: 2, cx: 462, cy: 93, x2: 390, y2: 93 },
            { n: 3, cx: 28, cy: 135, x2: 102, y2: 135 },
            { n: 4, cx: 28, cy: 182, x2: 90, y2: 182 },
            { n: 5, cx: 28, cy: 225, x2: 162, y2: 225 },
            { n: 6, cx: 462, cy: 225, x2: 390, y2: 225 },
            { n: 7, cx: 264, cy: 284, x2: 264, y2: 242 },
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
        Anatomy of the Progressive Scope request, with parts numbered as listed
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
