const PARTS = [
  {
    name: "The task",
    note: "What needs a secret, stated plainly (\"Sign in to Delta\", \"Pay $340\"), so the user knows exactly which exchange they're being asked to authorise.",
  },
  {
    name: "Trusted holder",
    note: "Who the secret goes to instead of the agent (a password manager, a passkey, the provider's own payment page), named with its kind, so the user recognises something they already trust.",
  },
  {
    name: "Exclusion boundary",
    note: "The pattern's heart: an explicit statement that the agent is outside this exchange. The password or card number flows from the user to the holder and never through the agent.",
  },
  {
    name: "What comes back",
    note: "What the agent receives in place of the secret (a scoped session, a one-time token, a confirmation), so least privilege is visible: it gets exactly enough to finish the task.",
  },
  {
    name: "Continue",
    note: "The primary action hands off into the trusted holder. It's a step out to a place the user controls, not a form that collects the secret in the agent's surface.",
  },
  {
    name: "Cancel",
    note: "Backing out is always available and costs nothing, nothing is signed in, nothing is charged, and the agent has seen nothing either way.",
  },
];

/**
 * Anatomy diagram for the Credential Handoff pattern. The SVG is decorative
 * (wireframe + numbered callouts); the ordered list below carries the
 * accessible description of each part.
 */
export function CredentialHandoffAnatomy() {
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
          {/* icon + title */}
          <rect x="78" y="32" width="22" height="22" rx="5" fill="var(--acp-color-agent-surface)" stroke="var(--acp-color-agent)" />
          <rect x="110" y="38" width="150" height="10" rx="5" fill="var(--acp-color-ink-muted)" />

          {/* 2: trusted holder row */}
          <rect x="78" y="70" width="316" height="28" rx="6" fill="var(--acp-color-surface-sunken)" />
          <rect x="90" y="80" width="64" height="10" rx="3" fill="var(--acp-color-agent-surface)" stroke="var(--acp-color-agent)" />
          <rect x="164" y="81" width="90" height="8" rx="4" fill="var(--acp-color-ink-muted)" />

          {/* 3: exclusion boundary, flow diagram: user → holder, agent outside */}
          <rect x="78" y="112" width="316" height="58" rx="6" fill="var(--acp-color-agent-surface)" />
          <rect x="78" y="112" width="4" height="58" fill="var(--acp-color-agent)" />
          {/* user node */}
          <circle cx="120" cy="141" r="12" fill="var(--acp-color-surface)" stroke="var(--acp-color-agent)" />
          {/* arrow to holder */}
          <line x1="134" y1="141" x2="188" y2="141" stroke="var(--acp-color-agent)" strokeWidth="2" />
          <path d="M188 137 L196 141 L188 145 Z" fill="var(--acp-color-agent)" />
          {/* holder node */}
          <rect x="198" y="129" width="24" height="24" rx="5" fill="var(--acp-color-surface)" stroke="var(--acp-color-agent)" />
          {/* agent node, outside, dashed/struck */}
          <rect x="330" y="126" width="52" height="30" rx="6" fill="var(--acp-color-surface)" stroke="var(--acp-color-ink-faint)" strokeDasharray="3 3" />
          <line x1="336" y1="141" x2="376" y2="141" stroke="var(--acp-color-danger)" />

          {/* 4: what comes back, checklist */}
          <rect x="78" y="188" width="60" height="6" rx="3" fill="var(--acp-color-ink-faint)" />
          {[204, 220].map((y) => (
            <g key={y}>
              <rect x="82" y={y} width="8" height="8" rx="2" fill="var(--acp-color-approve)" />
              <rect x="98" y={y + 1} width="200" height="6" rx="3" fill="var(--acp-color-ink-muted)" />
            </g>
          ))}

          {/* 5/6: actions */}
          <rect x="238" y="262" width="70" height="30" rx="6" fill="transparent" stroke="var(--acp-color-line-strong)" />
          <rect x="316" y="262" width="80" height="30" rx="6" fill="var(--acp-color-agent)" />

          {/* callouts */}
          {[
            { n: 1, cx: 26, cy: 44, x2: 74, y2: 44 },
            { n: 2, cx: 26, cy: 84, x2: 74, y2: 84 },
            { n: 3, cx: 26, cy: 141, x2: 74, y2: 141 },
            { n: 4, cx: 26, cy: 212, x2: 74, y2: 212 },
            { n: 5, cx: 484, cy: 300, x2: 396, y2: 285 },
            { n: 6, cx: 484, cy: 255, x2: 273, y2: 268 },
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
        Anatomy of the Credential Handoff surface, with parts numbered as listed
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
