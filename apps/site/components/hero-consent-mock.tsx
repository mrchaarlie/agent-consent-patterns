/**
 * The hero's illustration: a mock consent dialog, built from the site's own
 * tokens so it retheme with everything else instead of going stale as a
 * flat screenshot would.
 *
 * It is a picture, not a control. The whole thing is one `role="img"` with a
 * text alternative, and everything inside is aria-hidden — so a screen reader
 * gets one honest description rather than a set of buttons that don't do
 * anything. Nothing inside is focusable, for the same reason.
 *
 * The scenario is deliberately a *good* dialog: it names the acting agent,
 * shows the actual recipients and subject rather than "wants to access your
 * email", flags what can't be undone, and puts the safe answer first. That is
 * Action Preview and Irreversibility Gate doing their jobs — the argument the
 * page is making, in one glance.
 */
export function HeroConsentMock() {
  return (
    <div
      role="img"
      aria-label="A mock permission dialog. Inbox Assistant, acting for you, asks to send an email to all-staff and 4,181 others, subject 're: re: re: FWD: URGENT!!', attaching salaries-final-FINAL-v3.xlsx. The dialog warns that sending can't be undone, and offers 'Not now' or 'Send it'."
      className="w-full max-w-sm select-none rounded-xl border border-line-strong bg-surface-raised shadow-lg"
    >
      <div aria-hidden className="p-5">
        <div className="flex items-center gap-2">
          <span className="rounded bg-agent-surface px-1.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-widest text-agent">
            Agent
          </span>
          <span className="text-xs text-ink-muted">
            Inbox Assistant · acting for you
          </span>
        </div>

        <p className="mt-3 text-lg font-semibold tracking-tight text-ink">
          Send this email?
        </p>

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

        <div className="mt-5 flex items-center justify-end gap-2">
          <span className="rounded-md border border-line-strong px-3 py-1.5 text-sm font-medium text-ink">
            Not now
          </span>
          <span className="rounded-md bg-danger px-3 py-1.5 text-sm font-medium text-surface">
            Send it
          </span>
        </div>
      </div>
    </div>
  );
}
