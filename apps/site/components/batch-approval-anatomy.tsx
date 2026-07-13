const PARTS = [
  {
    name: "Queue header",
    note: "Names the run and its size (\"Agent proposed 6 actions\"), so the user knows the scope of what they are about to triage.",
  },
  {
    name: "Batch toolbar",
    note: "The triage bar: select-all, a live count of what a batch action would touch, and the group approve / reject buttons.",
  },
  {
    name: "Select all",
    note: "Selects every eligible item at once, and only those. It can never reach a flagged item, so \"approve all\" is safe by construction.",
  },
  {
    name: "Selection checkbox",
    note: "Per routine row. Chooses the item into the batch; the toolbar count updates live so the user always knows the blast radius.",
  },
  {
    name: "Review flag",
    note: "Replaces the checkbox on a high-stakes item. It breaks the queue's rhythm, is excluded from select-all, and can only be decided on its own row.",
  },
  {
    name: "Per-row actions",
    note: "Approve or reject a single item without touching the selection. The escape hatch for the one item that shouldn't move with the group.",
  },
];

/**
 * Anatomy diagram for the Batch Approval pattern. The SVG is decorative
 * (wireframe + numbered callouts); the ordered list below carries the
 * accessible description of each part.
 */
export function BatchApprovalAnatomy() {
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
          {/* 1: header title */}
          <rect x="88" y="36" width="180" height="12" rx="6" fill="var(--acp-color-ink-muted)" />

          {/* 2: toolbar */}
          <rect
            x="88"
            y="64"
            width="294"
            height="34"
            rx="8"
            fill="var(--acp-color-surface-sunken)"
          />
          {/* 3: select-all checkbox */}
          <rect
            x="100"
            y="73"
            width="16"
            height="16"
            rx="4"
            fill="var(--acp-color-surface)"
            stroke="var(--acp-color-approve)"
          />
          <path d="M 103 81 l 3 3 5 -6" fill="none" stroke="var(--acp-color-approve)" strokeWidth="2" />
          <rect x="124" y="77" width="70" height="8" rx="4" fill="var(--acp-color-ink-faint)" />
          {/* batch buttons */}
          <rect x="286" y="70" width="42" height="22" rx="6" fill="none" stroke="var(--acp-color-line-strong)" />
          <rect x="334" y="70" width="42" height="22" rx="6" fill="var(--acp-color-approve)" />

          {/* rows: two routine, one flagged */}
          {[118, 158].map((y) => (
            <g key={y}>
              {/* 4: selection checkbox */}
              <rect
                x="100"
                y={y}
                width="16"
                height="16"
                rx="4"
                fill="var(--acp-color-surface)"
                stroke="var(--acp-color-line-strong)"
              />
              <rect x="124" y={y + 1} width="150" height="8" rx="4" fill="var(--acp-color-ink-muted)" />
              <rect x="124" y={y + 13} width="96" height="6" rx="3" fill="var(--acp-color-ink-faint)" />
              {/* 6: per-row actions */}
              <rect x={300} y={y - 2} width="34" height="18" rx="5" fill="none" stroke="var(--acp-color-line-strong)" />
              <rect x={340} y={y - 2} width="42" height="18" rx="5" fill="none" stroke="var(--acp-color-approve)" />
              <line x1="88" y1={y + 30} x2="382" y2={y + 30} stroke="var(--acp-color-line)" />
            </g>
          ))}

          {/* flagged row */}
          <rect x="82" y="196" width="4" height="40" rx="2" fill="var(--acp-color-danger)" />
          {/* 5: review flag chip */}
          <rect
            x="98"
            y="204"
            width="86"
            height="18"
            rx="5"
            fill="var(--acp-color-danger-surface)"
            stroke="var(--acp-color-danger)"
          />
          <rect x="196" y="205" width="150" height="8" rx="4" fill="var(--acp-color-ink-muted)" />
          <rect x="196" y="217" width="96" height="6" rx="3" fill="var(--acp-color-ink-faint)" />

          {/* callouts */}
          {[
            { n: 1, cx: 28, cy: 42, x2: 84, y2: 42 },
            { n: 2, cx: 462, cy: 81, x2: 386, y2: 81 },
            { n: 3, cx: 28, cy: 81, x2: 96, y2: 81 },
            { n: 4, cx: 28, cy: 126, x2: 96, y2: 126 },
            { n: 5, cx: 28, cy: 213, x2: 94, y2: 213 },
            { n: 6, cx: 462, cy: 156, x2: 386, y2: 156 },
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
        Anatomy of the Batch Approval queue, with parts numbered as listed
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
