"use client";

import { useState } from "react";
import {
  IrreversibilityGate,
  type IrreversibilitySeverity,
} from "@agentconsent/react";
import { DemoFrame } from "./demo-frame";

const COPY: Record<
  IrreversibilitySeverity,
  { title: string; description: string; consequences: string[]; confirm: string }
> = {
  reversible: {
    title: "Archive 1,240 files",
    description: "The agent wants to move the export directory to Archive.",
    consequences: [
      "Moves 1,240 files (4.2 GB) out of Active.",
      "Reversible, restore from Archive at any time.",
    ],
    confirm: "Archive them",
  },
  undoable: {
    title: "Send campaign to 1,240 recipients",
    description: "The agent wants to send the drafted announcement now.",
    consequences: [
      "Delivers to 1,240 subscribers.",
      "A 30-second undo window holds the send before it leaves.",
    ],
    confirm: "Send campaign",
  },
  irreversible: {
    title: "Permanently delete 1,240 files",
    description: "The agent wants to empty the export directory for good.",
    consequences: [
      "Permanently removes 1,240 files (4.2 GB).",
      "Cannot be undone, no version history or backup exists.",
    ],
    confirm: "Delete forever",
  },
};

/**
 * Interactive Irreversibility Gate demo: the same delete-ish action at three
 * severities, so the friction ladder is visible. Only the irreversible tier
 * requires typing the confirm phrase.
 */
export function IrreversibilityGateDemo() {
  const [severity, setSeverity] =
    useState<IrreversibilitySeverity>("irreversible");
  const [log, setLog] = useState<string[]>([]);
  const [decided, setDecided] = useState(false);

  const copy = COPY[severity];
  const record = (decision: "Confirmed" | "Cancelled") => {
    setLog((entries) => [
      `${decision} · severity: ${severity} · ${new Date().toLocaleTimeString()}`,
      ...entries,
    ]);
    setDecided(true);
  };

  return (
    <div className="mt-4">
      <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <fieldset className="flex flex-wrap items-center gap-3">
          <legend className="sr-only">Severity prop</legend>
          <span className="font-mono text-xs text-ink-faint">severity=</span>
          {(
            ["reversible", "undoable", "irreversible"] as const
          ).map((value) => (
            <label key={value} className="flex items-center gap-1.5">
              <input
                type="radio"
                name="severity"
                value={value}
                checked={severity === value}
                onChange={() => {
                  setSeverity(value);
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
              Decision recorded. In a real product this is followed by an{" "}
              <strong>Action Receipt</strong> with undo where the severity
              allows it.
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
          <IrreversibilityGate.Root
            severity={severity}
            confirmPhrase="DELETE"
            onConfirm={() => record("Confirmed")}
            onCancel={() => record("Cancelled")}
          >
            <IrreversibilityGate.Header>
              <IrreversibilityGate.Icon>
                {severity === "irreversible" ? "⚠" : "◆"}
              </IrreversibilityGate.Icon>
              <IrreversibilityGate.Title>
                {copy.title}
              </IrreversibilityGate.Title>
            </IrreversibilityGate.Header>
            <IrreversibilityGate.Description>
              {copy.description}
            </IrreversibilityGate.Description>
            <IrreversibilityGate.Consequences>
              {copy.consequences.map((line) => (
                <IrreversibilityGate.Consequence key={line}>
                  {line}
                </IrreversibilityGate.Consequence>
              ))}
            </IrreversibilityGate.Consequences>
            <IrreversibilityGate.ConfirmField />
            <IrreversibilityGate.Actions>
              <IrreversibilityGate.Cancel>
                Keep files
              </IrreversibilityGate.Cancel>
              <IrreversibilityGate.Confirm>
                {copy.confirm}
              </IrreversibilityGate.Confirm>
            </IrreversibilityGate.Actions>
          </IrreversibilityGate.Root>
        )}
      </DemoFrame>

      {log.length > 0 && (
        <div className="rounded-md border border-line bg-surface-raised p-3">
          <p className="eyebrow mb-2">Callback log</p>
          <ul className="space-y-1 font-mono text-xs text-ink-muted">
            {log.map((entry, i) => (
              <li key={`${entry}-${i}`}>{entry}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
