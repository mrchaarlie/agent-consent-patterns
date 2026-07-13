"use client";

import { useState } from "react";
import {
  SpendLimits,
  type SpendLimitKind,
  type SpendLimitPeriod,
  type SpendLimitUsage,
} from "@agentconsent/react";
import { DemoFrame } from "./demo-frame";

interface LimitDef extends SpendLimitUsage {
  kind: SpendLimitKind;
  unit: string;
  period: SpendLimitPeriod;
  label: string;
  description: string;
}

const LIMITS: LimitDef[] = [
  {
    id: "purchases",
    used: 34,
    kind: "spend",
    unit: "$",
    period: "week",
    label: "Purchases",
    description: "Buy items you've shortlisted, on your behalf.",
  },
  {
    id: "outreach",
    used: 17,
    kind: "rate",
    unit: "emails",
    period: "day",
    label: "Outreach emails",
    description: "Message sellers to ask questions or negotiate.",
  },
  {
    id: "bookings",
    used: 220,
    kind: "spend",
    unit: "$",
    period: "month",
    label: "Travel bookings",
    description: "Reserve flights and lodging within a trip.",
  },
];

const INITIAL: Record<string, number> = {
  purchases: 100,
  outreach: 20,
  bookings: 200,
};

/**
 * Interactive Spend & Rate Limits demo: one settings surface for a shopping
 * agent. Each guardrail shows live usage against its cap; the travel budget is
 * already over its cap, so the agent will pause and ask before booking more.
 * Raise a cap and watch the summary re-tally.
 */
export function SpendLimitsDemo() {
  const [caps, setCaps] = useState<Record<string, number>>(INITIAL);

  return (
    <div>
      <DemoFrame>
        <SpendLimits.Root
          limits={LIMITS}
          value={caps}
          onValueChange={setCaps}
        >
          <SpendLimits.Header>
            <SpendLimits.Icon>▤</SpendLimits.Icon>
            <SpendLimits.Title>
              How far can Shopping Agent go on its own?
            </SpendLimits.Title>
          </SpendLimits.Header>
          <SpendLimits.Description>
            Numeric guardrails the agent works within. Reaching a cap isn&apos;t
            an error, it&apos;s the point at which the agent comes back to ask.
          </SpendLimits.Description>
          <SpendLimits.Summary>
            {({ reached, warning }) =>
              `${reached} cap reached · ${warning} near cap`
            }
          </SpendLimits.Summary>
          <SpendLimits.List>
            {LIMITS.map((limit) => (
              <SpendLimits.Limit
                key={limit.id}
                id={limit.id}
                kind={limit.kind}
                unit={limit.unit}
                period={limit.period}
                label={limit.label}
                description={limit.description}
              />
            ))}
          </SpendLimits.List>
        </SpendLimits.Root>
      </DemoFrame>
    </div>
  );
}
