"use client";

import { useState } from "react";
import {
  ProgressiveScope,
  type ScopeAccess,
} from "@agentconsent/react";
import { DemoFrame } from "./demo-frame";

type Decision = "Allowed once" | "Escalated to standing grant" | "Denied";

/**
 * Interactive Progressive Scope demo: an agent that started with read-only
 * access hits a wall mid-task and asks for one more capability in context.
 * The access prop re-weights the request; a log shows which decision fired.
 */
export function ProgressiveScopeDemo() {
  const [access, setAccess] = useState<ScopeAccess>("write");
  const [log, setLog] = useState<string[]>([]);
  const [decided, setDecided] = useState(false);

  const record = (decision: Decision) => {
    setLog((entries) => [
      `${decision} · ${access} · ${new Date().toLocaleTimeString()}`,
      ...entries,
    ]);
    setDecided(true);
  };

  const requested =
    access === "delete"
      ? {
          title: "Inbox Assistant needs to delete messages",
          label: "Delete messages",
          description: "Move messages in this thread to trash.",
          reason:
            "To clear the resolved thread, it needs to delete the messages you flagged.",
        }
      : access === "read"
        ? {
            title: "Inbox Assistant needs to read the Finance label",
            label: "Read the Finance label",
            description: "See subjects and bodies of messages in Finance.",
            reason:
              "The vendor reply references an invoice filed under Finance, which it can't currently see.",
          }
        : {
            title: "Inbox Assistant needs to send email",
            label: "Send email on your behalf",
            description: "Compose and send new email as you, in this thread.",
          reason:
            "To reply to the vendor, it needs to send email. So far, it has only drafted.",
          };

  return (
    <div className="mt-4">
      <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <fieldset className="flex flex-wrap items-center gap-3">
          <legend className="sr-only">Requested access level</legend>
          <span className="font-mono text-xs text-ink-faint">access=</span>
          {(["read", "write", "delete"] as const).map((value) => (
            <label key={value} className="flex items-center gap-1.5">
              <input
                type="radio"
                name="ps-access"
                value={value}
                checked={access === value}
                onChange={() => {
                  setAccess(value);
                  setDecided(false);
                }}
              />
              <span className="font-mono text-xs">&quot;{value}&quot;</span>
            </label>
          ))}
        </fieldset>
      </div>

      <DemoFrame>
        {decided ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p
              className="text-sm"
              style={{ color: "var(--acp-color-ink-muted)" }}
            >
              Decision recorded. Choosing the standing grant is where the full{" "}
              <strong>Consent Memory</strong> ladder (once / this task / always)
              lives.
            </p>
            <button
              type="button"
              onClick={() => setDecided(false)}
              className="rounded border border-line-strong px-3 py-1.5 font-mono text-xs"
              style={{ color: "var(--acp-color-ink)" }}
            >
              Reset demo
            </button>
          </div>
        ) : (
          <ProgressiveScope.Root
            access={access}
            onAllowOnce={() => record("Allowed once")}
            onAllowAlways={() => record("Escalated to standing grant")}
            onDeny={() => record("Denied")}
          >
            <ProgressiveScope.Header>
              <ProgressiveScope.Icon>✦</ProgressiveScope.Icon>
              <ProgressiveScope.Title>{requested.title}</ProgressiveScope.Title>
            </ProgressiveScope.Header>
            <ProgressiveScope.Reason>{requested.reason}</ProgressiveScope.Reason>
            <ProgressiveScope.Request
              label={requested.label}
              description={requested.description}
            />
            <ProgressiveScope.Current>
              Inbox Assistant can already read this thread.
            </ProgressiveScope.Current>
            <ProgressiveScope.Actions>
              <ProgressiveScope.Deny>Not now</ProgressiveScope.Deny>
              <ProgressiveScope.AllowAlways>
                Always allow
              </ProgressiveScope.AllowAlways>
              <ProgressiveScope.AllowOnce>
                Just this once
              </ProgressiveScope.AllowOnce>
            </ProgressiveScope.Actions>
          </ProgressiveScope.Root>
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
