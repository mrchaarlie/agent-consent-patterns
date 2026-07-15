"use client";

import { useState } from "react";
import {
  ActionPreview,
  type ActionPreviewConsequence,
} from "@agentconsent/react";
import { DemoFrame } from "./demo-frame";

const EMAIL_BODY = `Hi Dana, attached is the Q3 board deck with the updated
revenue slide. Flagging that the hiring plan on slide 14 still assumes the
January start dates we discussed. Happy to walk through it before Thursday.`;

/**
 * Interactive Action Preview demo: an agent proposing to send an email.
 * Editable consequence prop + a decision log so the callbacks are visible.
 */
export function ActionPreviewDemo() {
  const [consequence, setConsequence] =
    useState<ActionPreviewConsequence>("reversible");
  const [log, setLog] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState(false);

  const record = (decision: "Approved" | "Rejected") => {
    setLog((entries) => [
      `${decision} · consequence: ${consequence} · ${new Date().toLocaleTimeString()}`,
      ...entries,
    ]);
    setDismissed(true);
  };

  return (
    <div className="mt-4">
      <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <fieldset className="flex items-center gap-3">
          <legend className="sr-only">Consequence prop</legend>
          <span className="font-mono text-xs text-ink-faint">
            consequence=
          </span>
          {(["reversible", "irreversible"] as const).map((value) => (
            <label key={value} className="flex items-center gap-1.5">
              <input
                type="radio"
                name="consequence"
                value={value}
                checked={consequence === value}
                onChange={() => setConsequence(value)}
              />
              <span className="font-mono text-xs">&quot;{value}&quot;</span>
            </label>
          ))}
        </fieldset>
      </div>

      <DemoFrame>
        {dismissed ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p
              className="text-sm"
              style={{ color: "var(--acp-color-ink-muted)" }}
            >
              Decision recorded. In a real product this surface is replaced by
              an <strong>Action Receipt</strong>.
            </p>
            <button
              type="button"
              onClick={() => setDismissed(false)}
              className="rounded border border-line-strong px-3 py-1.5 font-mono text-xs"
              style={{ color: "var(--acp-color-ink)" }}
            >
              Reset demo
            </button>
          </div>
        ) : (
          <ActionPreview.Root
            consequence={consequence}
            onApprove={() => record("Approved")}
            onReject={() => record("Rejected")}
          >
            <ActionPreview.Header>
              <ActionPreview.Icon>✉</ActionPreview.Icon>
              <ActionPreview.Title>
                Send email to Dana Ito
              </ActionPreview.Title>
            </ActionPreview.Header>
            <ActionPreview.Fields>
              <ActionPreview.Field label="To">
                dana@northwindcap.com
              </ActionPreview.Field>
              <ActionPreview.Field label="Subject">
                Q3 board deck (final)
              </ActionPreview.Field>
              <ActionPreview.Field label="Attachment">
                q3-board-deck-v4.pdf (2.1 MB)
              </ActionPreview.Field>
            </ActionPreview.Fields>
            <ActionPreview.Content label="Message body">
              {EMAIL_BODY}
            </ActionPreview.Content>
            <ActionPreview.Source
              agent="Inbox Assistant"
              authority="task: board meeting prep"
            />
            <ActionPreview.Actions>
              <ActionPreview.Reject>Don&apos;t send</ActionPreview.Reject>
              <ActionPreview.Approve>
                {consequence === "irreversible" ? "Send now" : "Send email"}
              </ActionPreview.Approve>
            </ActionPreview.Actions>
          </ActionPreview.Root>
        )}
      </DemoFrame>

      {log.length > 0 && (
        <div className="rounded-md border border-line bg-surface-raised p-3">
          <p className="eyebrow mb-2">Callback log</p>
          <ul
            tabIndex={0}
            aria-label="Callback log entries"
            className="max-h-48 space-y-1 overflow-y-auto pr-2 font-mono text-xs text-ink-muted"
          >
            {log.map((entry, i) => (
              <li key={`${entry}-${i}`}>{entry}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
