"use client";

import { useMemo, useState } from "react";
import { BatchApproval, type BatchApprovalItem } from "@agentconsent/react";
import { DemoFrame } from "./demo-frame";

interface QueueAction extends BatchApprovalItem {
  title: string;
  detail: string;
}

const INITIAL: QueueAction[] = [
  {
    id: "reply-dana",
    title: "Send reply to Dana Okafor",
    detail: "Re: Q3 numbers, “Confirmed, the deck is attached.”",
  },
  {
    id: "reply-sam",
    title: "Send reply to Sam Reyes",
    detail: "Re: lunch Thursday, “Works for me, see you at 12.”",
  },
  {
    id: "archive-news",
    title: "Archive 3 newsletters",
    detail: "The Download, Platformer, Import AI, already read.",
  },
  {
    id: "label-receipts",
    title: "Label 8 receipts as “Expenses”",
    detail: "Matched by sender and subject line.",
  },
  {
    id: "delete-thread",
    title: "Permanently delete “Invoice #4471” thread",
    detail: "Irreversible, no version history. Agent inferred this is spam.",
    requiresReview: true,
  },
  {
    id: "forward-legal",
    title: "Forward contract to legal@acme.com",
    detail: "Contains an attachment the agent has not opened.",
    requiresReview: true,
  },
];

/**
 * Interactive Batch Approval demo: a queue of agent-proposed inbox actions.
 * Routine items can be swept with select-all + one batch action; the two
 * high-stakes items are flagged "review individually" and stay out of the
 * bulk path, so they can only be resolved on their own row.
 */
export function BatchApprovalDemo() {
  const [queue, setQueue] = useState<QueueAction[]>(INITIAL);
  const [selected, setSelected] = useState<string[]>([]);
  const [log, setLog] = useState<string[]>([]);

  const items = useMemo<BatchApprovalItem[]>(
    () => queue.map(({ id, requiresReview }) => ({ id, requiresReview })),
    [queue]
  );

  const resolve = (verb: "Approved" | "Rejected", ids: string[]) => {
    if (ids.length === 0) return;
    const names = queue
      .filter((a) => ids.includes(a.id))
      .map((a) => a.title);
    setLog((entries) => [
      `${verb} ${ids.length}: ${names.join("; ")} · ${new Date().toLocaleTimeString()}`,
      ...entries,
    ]);
    setQueue((q) => q.filter((a) => !ids.includes(a.id)));
  };

  const reset = () => {
    setQueue(INITIAL);
    setSelected([]);
    setLog([]);
  };

  return (
    <div>
      <DemoFrame>
        {queue.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p
              className="text-sm"
              style={{ color: "var(--acp-color-ink-muted)" }}
            >
              Queue cleared. Every decision would land in an{" "}
              <strong>Action Receipt</strong> with undo where the action allows
              it.
            </p>
            <button
              type="button"
              onClick={reset}
              className="rounded border border-line-strong px-3 py-1.5 font-mono text-xs"
              style={{ color: "var(--acp-color-ink)" }}
            >
              Reset demo
            </button>
          </div>
        ) : (
          <BatchApproval.Root
            items={items}
            value={selected}
            onValueChange={setSelected}
            onApprove={(ids) => resolve("Approved", ids)}
            onReject={(ids) => resolve("Rejected", ids)}
          >
            <BatchApproval.Header>
              <BatchApproval.Icon>▤</BatchApproval.Icon>
              <BatchApproval.Title>
                Agent proposed {queue.length} inbox actions
              </BatchApproval.Title>
            </BatchApproval.Header>
            <BatchApproval.Description>
              Sweep the routine ones together. Flagged actions must be decided
              on their own.
            </BatchApproval.Description>
            <BatchApproval.Toolbar>
              <BatchApproval.SelectAll />
              <BatchApproval.SelectionCount>
                {({ selectedCount, selectableCount }) =>
                  `${selectedCount} of ${selectableCount} selected`
                }
              </BatchApproval.SelectionCount>
              <BatchApproval.BatchReject>
                Reject selected
              </BatchApproval.BatchReject>
              <BatchApproval.BatchApprove>
                Approve selected
              </BatchApproval.BatchApprove>
            </BatchApproval.Toolbar>
            <BatchApproval.List>
              {queue.map((action) => (
                <BatchApproval.Item
                  key={action.id}
                  id={action.id}
                  title={action.title}
                  detail={action.detail}
                >
                  <BatchApproval.ItemReject>Reject</BatchApproval.ItemReject>
                  <BatchApproval.ItemApprove>
                    Approve
                  </BatchApproval.ItemApprove>
                </BatchApproval.Item>
              ))}
            </BatchApproval.List>
          </BatchApproval.Root>
        )}
      </DemoFrame>

      {log.length > 0 && (
        <div className="rounded-md border border-line bg-surface-raised p-3">
          <p className="eyebrow mb-2">Decision log</p>
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
