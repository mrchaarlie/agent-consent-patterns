"use client";

import { useState } from "react";
import { ActionReceipt, type ReceiptOutcome } from "@agentconsent/react";
import { DemoFrame } from "./demo-frame";

/**
 * Interactive Action Receipt demo: a receipt for an email the agent already
 * sent, under a named authority. Undo flips the receipt to its undone state,
 * showing how the surface only offers an undo it can actually honour.
 */
export function ActionReceiptDemo() {
  const [outcome, setOutcome] = useState<ReceiptOutcome>("completed");

  return (
    <div>
      <DemoFrame>
        <ActionReceipt.Root outcome={outcome} reversibility="reversible">
          <ActionReceipt.Header>
            <ActionReceipt.Icon>✉</ActionReceipt.Icon>
            <ActionReceipt.Title>Sent email to Dana Ito</ActionReceipt.Title>
            <ActionReceipt.Outcome />
          </ActionReceipt.Header>
          <ActionReceipt.Details>
            <ActionReceipt.Detail label="To">
              dana@northwindcap.com
            </ActionReceipt.Detail>
            <ActionReceipt.Detail label="Subject">
              Q3 board deck, final
            </ActionReceipt.Detail>
          </ActionReceipt.Details>
          <ActionReceipt.Authority
            grant="Standing grant · Send email"
            via="always-allow · set Jul 2"
          />
          <ActionReceipt.Meta>
            <ActionReceipt.MetaItem label="When">
              Jul 9, 2:14 PM
            </ActionReceipt.MetaItem>
            <ActionReceipt.MetaItem label="Reference">
              msg_8f21c
            </ActionReceipt.MetaItem>
          </ActionReceipt.Meta>
          <ActionReceipt.Actions>
            <ActionReceipt.Undo onClick={() => setOutcome("undone")}>
              Undo send
            </ActionReceipt.Undo>
          </ActionReceipt.Actions>
        </ActionReceipt.Root>
      </DemoFrame>

      {outcome === "undone" && (
        <div className="flex items-center gap-3 rounded-md border border-line bg-surface-raised p-3 text-sm text-ink-muted">
          <span>
            The send was recalled. The receipt now reads <strong>Undone</strong>{" "}
            and offers no second undo.
          </span>
          <button
            type="button"
            onClick={() => setOutcome("completed")}
            className="ml-auto rounded border border-line-strong px-3 py-1.5 font-mono text-xs"
            style={{ color: "var(--acp-color-ink)" }}
          >
            Reset demo
          </button>
        </div>
      )}
    </div>
  );
}
