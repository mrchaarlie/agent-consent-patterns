"use client";

import { useState } from "react";
import { CredentialHandoff } from "@agentconsent/react";
import { DemoFrame } from "./demo-frame";

/**
 * Interactive Credential Handoff demo: an agent booking a flight needs the user
 * to sign in. It hands the exchange to a password manager and shows what it gets
 * back. A scoped session, never the password.
 */
export function CredentialHandoffDemo() {
  const [state, setState] = useState<"prompt" | "handed-off" | "cancelled">(
    "prompt"
  );

  return (
    <div>
      <DemoFrame>
        {state === "prompt" ? (
          <CredentialHandoff.Root
            onHandoff={() => setState("handed-off")}
            onCancel={() => setState("cancelled")}
          >
            <CredentialHandoff.Header>
              <CredentialHandoff.Icon>🔑</CredentialHandoff.Icon>
              <CredentialHandoff.Title>Sign in to Delta</CredentialHandoff.Title>
            </CredentialHandoff.Header>
            <CredentialHandoff.Description>
              Booking your flight needs you to sign in. I&apos;ll hand this to
              your password manager rather than ask you to type it to me.
            </CredentialHandoff.Description>
            <CredentialHandoff.Handler
              kind="password-manager"
              name="1Password"
            />
            <CredentialHandoff.Boundary>
              Your password goes straight to 1Password and Delta. The agent never
              sees it, and can&apos;t store or replay it.
            </CredentialHandoff.Boundary>
            <CredentialHandoff.Returns>
              <CredentialHandoff.Return>
                A signed-in session, scoped to this booking
              </CredentialHandoff.Return>
              <CredentialHandoff.Return>
                Expires in 1 hour, no stored password
              </CredentialHandoff.Return>
            </CredentialHandoff.Returns>
            <CredentialHandoff.Actions>
              <CredentialHandoff.Cancel>Not now</CredentialHandoff.Cancel>
              <CredentialHandoff.Handoff>
                Continue in 1Password
              </CredentialHandoff.Handoff>
            </CredentialHandoff.Actions>
          </CredentialHandoff.Root>
        ) : (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p
              className="text-sm"
              style={{ color: "var(--acp-color-ink-muted)" }}
            >
              {state === "handed-off"
                ? "Handed off. The agent received a booking-scoped session, never your password."
                : "Cancelled. Nothing was signed in, and the agent saw nothing."}
            </p>
            <button
              type="button"
              onClick={() => setState("prompt")}
              className="rounded border border-line-strong px-3 py-1.5 font-mono text-xs"
              style={{ color: "var(--acp-color-ink)" }}
            >
              Reset demo
            </button>
          </div>
        )}
      </DemoFrame>
    </div>
  );
}
