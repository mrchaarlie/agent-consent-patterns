"use client";

import { useState } from "react";
import { ConnectionCard, type ConnectionStatus } from "@agentconsent/react";
import { DemoFrame } from "./demo-frame";

/**
 * Interactive Connection Card demo: a live settings tile whose status the
 * management actions actually mutate, pause/resume flips the badge, revoke
 * disconnects. A log shows what each action would trigger in a real product.
 */
export function ConnectionCardDemo() {
  const [status, setStatus] = useState<ConnectionStatus>("active");
  const [revoked, setRevoked] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const record = (msg: string) =>
    setLog((entries) => [
      `${msg} · ${new Date().toLocaleTimeString()}`,
      ...entries,
    ]);

  const paused = status === "paused";

  return (
    <div>
      <DemoFrame>
        {revoked ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p
              className="text-sm"
              style={{ color: "var(--acp-color-ink-muted)" }}
            >
              Disconnected. Inbox Assistant can no longer act on Gmail. A
              destructive revoke like this is a good place to compose an{" "}
              <strong>Irreversibility Gate</strong>.
            </p>
            <button
              type="button"
              onClick={() => {
                setRevoked(false);
                setStatus("active");
              }}
              className="rounded border border-line-strong px-3 py-1.5 font-mono text-xs"
              style={{ color: "var(--acp-color-ink)" }}
            >
              Reset demo
            </button>
          </div>
        ) : (
          <ConnectionCard.Root status={status} style={{ width: "100%" }}>
            <ConnectionCard.Header>
              <ConnectionCard.Icon>✉</ConnectionCard.Icon>
              <ConnectionCard.Title>
                Inbox Assistant → Gmail
              </ConnectionCard.Title>
              <ConnectionCard.Status />
            </ConnectionCard.Header>
            <ConnectionCard.Scopes>
              <ConnectionCard.Scope access="read">
                Read “Board 2026” label
              </ConnectionCard.Scope>
              <ConnectionCard.Scope access="write">
                Send replies
              </ConnectionCard.Scope>
            </ConnectionCard.Scopes>
            <ConnectionCard.Meta>
              <ConnectionCard.MetaItem label="Last used">
                {paused ? "Paused" : "2 hours ago, sent 1 reply"}
              </ConnectionCard.MetaItem>
              <ConnectionCard.MetaItem label="Connected">
                Mar 3, 2026
              </ConnectionCard.MetaItem>
            </ConnectionCard.Meta>
            <ConnectionCard.Actions>
              <ConnectionCard.Action
                onClick={() => record("Opened permission manager")}
              >
                Manage
              </ConnectionCard.Action>
              <ConnectionCard.Action
                onClick={() => {
                  const next = paused ? "active" : "paused";
                  setStatus(next);
                  record(next === "paused" ? "Paused" : "Resumed");
                }}
              >
                {paused ? "Resume" : "Pause"}
              </ConnectionCard.Action>
              <ConnectionCard.Action
                tone="danger"
                onClick={() => {
                  setRevoked(true);
                  record("Revoked");
                }}
              >
                Revoke
              </ConnectionCard.Action>
            </ConnectionCard.Actions>
          </ConnectionCard.Root>
        )}
      </DemoFrame>

      {log.length > 0 && (
        <div className="rounded-md border border-line bg-surface-raised p-3">
          <p className="eyebrow mb-2">Action log</p>
          <ul
            tabIndex={0}
            aria-label="Action log entries"
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
