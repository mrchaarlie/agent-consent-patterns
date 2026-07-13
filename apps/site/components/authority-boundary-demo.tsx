"use client";

import { useState } from "react";
import {
  AuthorityBoundary,
  type AuthorityLevel,
  type ScopeAccess,
} from "@agentconsent/react";
import { DemoFrame } from "./demo-frame";

interface Capability {
  id: string;
  access: ScopeAccess;
  label: string;
  description: string;
  disallow?: AuthorityLevel[];
}

const CAPABILITIES: Capability[] = [
  {
    id: "read-inbox",
    access: "read",
    label: "Read your inbox",
    description: "Scan incoming mail to summarise and draft replies.",
  },
  {
    id: "label-archive",
    access: "write",
    label: "Label & archive",
    description: "File and tidy messages, reversible from Archive.",
  },
  {
    id: "send-email",
    access: "write",
    label: "Send email",
    description: "Send a message you have not personally reviewed.",
  },
  {
    id: "spend",
    access: "write",
    label: "Spend up to $50",
    description: "Make a purchase or booking on your behalf.",
  },
  {
    id: "delete-thread",
    access: "delete",
    label: "Permanently delete",
    description: "Irreversibly remove a conversation, no undo.",
    disallow: ["auto"],
  },
];

const INITIAL: Record<string, AuthorityLevel> = {
  "read-inbox": "auto",
  "label-archive": "auto",
  "send-email": "ask",
  spend: "ask",
  "delete-thread": "never",
};

/**
 * Interactive Authority Boundary demo: one settings surface for an inbox
 * agent. Each capability sits on an explicit level, Automatic, Ask first, or
 * Never, and the summary tallies how much standing authority is granted.
 * Permanent deletion can't be set to Automatic at all.
 */
export function AuthorityBoundaryDemo() {
  const [levels, setLevels] = useState<Record<string, AuthorityLevel>>(INITIAL);

  return (
    <div>
      <DemoFrame>
        <AuthorityBoundary.Root value={levels} onValueChange={setLevels}>
          <AuthorityBoundary.Header>
            <AuthorityBoundary.Icon>⚖</AuthorityBoundary.Icon>
            <AuthorityBoundary.Title>
              What can Inbox Assistant do on its own?
            </AuthorityBoundary.Title>
          </AuthorityBoundary.Header>
          <AuthorityBoundary.Description>
            Set the standing authority for each capability. This is the durable
            answer the in-task prompts defer to.
          </AuthorityBoundary.Description>
          <AuthorityBoundary.Summary>
            {({ auto, ask, never }) =>
              `${auto} automatic · ${ask} ask first · ${never} off-limits`
            }
          </AuthorityBoundary.Summary>
          <AuthorityBoundary.List>
            {CAPABILITIES.map((cap) => (
              <AuthorityBoundary.Capability
                key={cap.id}
                id={cap.id}
                access={cap.access}
                label={cap.label}
                description={cap.description}
                disallow={cap.disallow}
              />
            ))}
          </AuthorityBoundary.List>
        </AuthorityBoundary.Root>
      </DemoFrame>
    </div>
  );
}
