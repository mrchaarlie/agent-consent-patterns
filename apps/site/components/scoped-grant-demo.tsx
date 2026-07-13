"use client";

import { useState } from "react";
import { ScopedGrant } from "@agentconsent/react";
import { DemoFrame } from "./demo-frame";

const REQUIRED = ["gmail.read"];

/**
 * Interactive Scoped Grant demo: connecting an agent to two services with
 * per-resource, read/write/delete granularity. Selection is controlled so the
 * granted set is visible in a decision log.
 */
export function ScopedGrantDemo() {
  const [selection, setSelection] = useState<string[]>([]);
  const [granted, setGranted] = useState<string[] | null>(null);

  return (
    <div>
      <DemoFrame>
        {granted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p
              className="text-sm"
              style={{ color: "var(--acp-color-ink-muted)" }}
            >
              Connected with {granted.length}{" "}
              {granted.length === 1 ? "permission" : "permissions"}. This grant
              state is what a <strong>Connection Card</strong> displays and lets
              you revoke.
            </p>
            <button
              type="button"
              onClick={() => {
                setGranted(null);
                setSelection([]);
              }}
              className="rounded border border-line-strong px-3 py-1.5 font-mono text-xs"
              style={{ color: "var(--acp-color-ink)" }}
            >
              Reset demo
            </button>
          </div>
        ) : (
          <ScopedGrant.Root
            value={selection}
            onValueChange={setSelection}
            requiredScopes={REQUIRED}
            onGrant={(ids) => setGranted(ids)}
            onCancel={() => setGranted([])}
          >
            <ScopedGrant.Header>
              <ScopedGrant.Icon>✦</ScopedGrant.Icon>
              <ScopedGrant.Title>
                Connect Inbox Assistant
              </ScopedGrant.Title>
            </ScopedGrant.Header>
            <ScopedGrant.Description>
              Grant only what the task needs. Read is on by default; write and
              delete are opt-in, per resource. You can change this later.
            </ScopedGrant.Description>

            <ScopedGrant.Group label="Gmail" resource="“Board 2026” label only">
              <ScopedGrant.Scope
                id="gmail.read"
                access="read"
                label="Read messages"
                description="See subjects and bodies of messages in the label, nothing outside it."
              />
              <ScopedGrant.Scope
                id="gmail.send"
                access="write"
                label="Send replies on your behalf"
                description="Compose and send email as you, in reply to threads in the label."
              />
              <ScopedGrant.Scope
                id="gmail.delete"
                access="delete"
                label="Delete messages"
                description="Move messages in the label to trash."
              />
            </ScopedGrant.Group>

            <ScopedGrant.Group
              label="Google Drive"
              resource="“Board Decks” folder only"
            >
              <ScopedGrant.Scope
                id="drive.read"
                access="read"
                label="Read files"
                description="Open and read files in the folder."
              />
              <ScopedGrant.Scope
                id="drive.write"
                access="write"
                label="Edit files"
                description="Create and modify files in the folder."
              />
            </ScopedGrant.Group>

            <ScopedGrant.Actions>
              <ScopedGrant.Cancel>Don&apos;t connect</ScopedGrant.Cancel>
              <ScopedGrant.Grant>
                {({ count }) =>
                  `Connect · ${count} ${count === 1 ? "permission" : "permissions"}`
                }
              </ScopedGrant.Grant>
            </ScopedGrant.Actions>
          </ScopedGrant.Root>
        )}
      </DemoFrame>

      {granted && granted.length > 0 && (
        <div className="rounded-md border border-line bg-surface-raised p-3">
          <p className="eyebrow mb-2">Granted scopes</p>
          <ul className="space-y-1 font-mono text-xs text-ink-muted">
            {granted.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
