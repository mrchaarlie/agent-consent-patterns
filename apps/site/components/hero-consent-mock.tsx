/**
 * The hero's illustration: a mock permission dialog, built from the site's own
 * tokens so it rethemes with everything else instead of going stale as a flat
 * screenshot would.
 *
 * It is a picture, not a control. The whole thing is one `role="img"` with a
 * text alternative, and everything inside is aria-hidden — so a screen reader
 * gets one honest description rather than a set of buttons that don't do
 * anything. Nothing inside is focusable, for the same reason.
 *
 * The shell is deliberately the "Allow" dialog everyone already knows: app icon
 * on top, "<name> wants to <verb>", and a two-button Don't Allow / Allow
 * footer, lifted off the page on a shadow. The *contents* are the argument — a
 * real permission prompt would stop at "wants to access your email", where this
 * one shows the actual recipients, subject and attachment, flags what can't be
 * undone, and leaves the safe answer the easy one. That is Action Preview and
 * Irreversibility Gate doing their jobs, which is the claim the page is making.
 */
export function HeroConsentMock() {
  return (
    <div
      role="img"
      aria-label="A mock permission dialog. An envelope icon, then: Inbox Assistant wants to send an email. It is labelled as an agent acting for you, and shows what it would send — to all-staff@ and 4,181 others, subject 're: re: re: FWD: URGENT!!', attaching salaries-final-FINAL-v3.xlsx. A warning reads 'Sending can't be undone.' The buttons are 'Don't Allow' and 'Allow'."
      className="w-full max-w-sm select-none rounded-lg border border-line-strong bg-surface-raised p-5 shadow-xl"
    >
      <div aria-hidden>
        <div className="flex flex-col items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface text-ink-muted">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 8 9 6 9-6" />
            </svg>
          </span>
          <p className="mt-3 text-balance text-base font-semibold tracking-tight text-ink">
            &ldquo;Inbox Assistant&rdquo; wants to send an email
          </p>
          <span className="mt-2 rounded bg-agent-surface px-1.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-widest text-agent">
            Agent · acting for you
          </span>
        </div>

        <dl className="mt-4 space-y-2 border-y border-line py-3 text-sm">
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 font-mono text-xs text-ink-faint">
              To
            </dt>
            <dd className="text-ink">
              all-staff@
              <span className="text-ink-muted"> + 4,181 others</span>
            </dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 font-mono text-xs text-ink-faint">
              Subject
            </dt>
            <dd className="text-ink">re: re: re: FWD: URGENT!!</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 font-mono text-xs text-ink-faint">
              Attached
            </dt>
            <dd className="font-mono text-xs text-ink">
              salaries-final-FINAL-v3.xlsx
            </dd>
          </div>
        </dl>

        <p className="mt-3 flex items-start gap-2 text-sm text-danger">
          <span className="mt-px font-mono text-xs">!</span>
          Sending can&rsquo;t be undone.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <span className="rounded-md border border-line-strong px-3 py-2 text-center text-sm font-medium text-ink">
            Don&rsquo;t Allow
          </span>
          <span className="rounded-md bg-danger px-3 py-2 text-center text-sm font-medium text-surface">
            Allow
          </span>
        </div>
      </div>
    </div>
  );
}
