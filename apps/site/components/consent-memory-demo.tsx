"use client";

import { useState } from "react";
import { ConsentMemory } from "@agentconsent/react";
import { DemoFrame } from "./demo-frame";

const OUTCOME: Record<string, string> = {
  once: "Allowed once. The agent will ask again next time.",
  session: "Allowed for this session. No more prompts until you close the app.",
  scoped:
    "Standing grant created for Dana. The agent can email her without asking; revoke it from the Connection Card any time.",
  always:
    "Standing grant created for anyone. The agent can email any recipient without asking. This is the broadest choice; revoke it from the Connection Card any time.",
};

/**
 * Interactive Consent Memory demo: the same "send email" request, but the user
 * chooses how long the answer lasts. Each option states its consequence inline,
 * and the confirm button and the standing "always" option carry visible weight
 * so the durable choice never looks like the throwaway one.
 */
export function ConsentMemoryDemo() {
  const [selected, setSelected] = useState("once");
  const [decision, setDecision] = useState<string | null>(null);

  const reset = () => {
    setSelected("once");
    setDecision(null);
  };

  return (
    <div>
      <DemoFrame>
        {decision ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p
              className="max-w-sm text-sm"
              style={{ color: "var(--acp-color-ink-muted)" }}
            >
              {decision === "denied"
                ? "Declined. No grant was created."
                : OUTCOME[decision]}
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
          <ConsentMemory.Root
            value={selected}
            onValueChange={setSelected}
            onAllow={(value) => setDecision(value)}
            onDeny={() => setDecision("denied")}
          >
            <ConsentMemory.Header>
              <ConsentMemory.Icon>✦</ConsentMemory.Icon>
              <ConsentMemory.Title>
                Allow Inbox Assistant to send email?
              </ConsentMemory.Title>
            </ConsentMemory.Header>
            <ConsentMemory.Description>
              The agent drafted a reply to Dana Okafor and wants to send it now.
            </ConsentMemory.Description>
            <ConsentMemory.Options>
              <ConsentMemory.Option
                value="once"
                durability="once"
                label="Just this once"
                consequence="The agent asks again the next time it wants to send email."
              />
              <ConsentMemory.Option
                value="session"
                durability="session"
                label="For this session"
                consequence="No more email prompts until you close the app."
              />
              <ConsentMemory.Option
                value="scoped"
                durability="scoped"
                label="Always, for Dana"
                consequence="The agent can email Dana any time without asking, but still asks for anyone else."
              />
              <ConsentMemory.Option
                value="always"
                durability="always"
                label="Always, for anyone"
                consequence="The agent can email any recipient, any time, without asking again."
              />
            </ConsentMemory.Options>
            <ConsentMemory.Actions>
              <ConsentMemory.Deny>Not now</ConsentMemory.Deny>
              <ConsentMemory.Allow>
                {({ durability }) =>
                  durability === "always" || durability === "scoped"
                    ? "Allow always"
                    : durability === "session"
                      ? "Allow for session"
                      : "Allow once"
                }
              </ConsentMemory.Allow>
            </ConsentMemory.Actions>
          </ConsentMemory.Root>
        )}
      </DemoFrame>
    </div>
  );
}
