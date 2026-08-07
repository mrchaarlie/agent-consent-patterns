# @agentconsent/react

[![npm version](https://img.shields.io/npm/v/%40agentconsent%2Freact?logo=npm&label=%40agentconsent%2Freact)](https://www.npmjs.com/package/@agentconsent/react)
[![npm provenance](https://img.shields.io/badge/npm-provenance-brightgreen?logo=npm)](https://www.npmjs.com/package/@agentconsent/react)
[![license](https://img.shields.io/github/license/mrchaarlie/agent-consent-patterns)](https://github.com/mrchaarlie/agent-consent-patterns/blob/main/LICENSE)

Headless React components for AI agent consent UX: asking for access, previewing actions,
holding standing authority, and reporting what the agent did. Each component implements one
of the 12 patterns documented at [agentconsent.dev](https://agentconsent.dev).

The components provide interaction and accessibility semantics; your application supplies
the language, data, callbacks, and visual treatment. Built on Radix UI primitives, designed
for keyboard operation and WCAG 2.2 AA, and axe-tested in both unit and real-browser tests.

## Install

```sh
npm install @agentconsent/react
```

Requires React 18 or later. Ships ESM and CJS builds with TypeScript types.

## Quick start

Start with the default theme, or import only the tokens when you want to provide all
component styles yourself:

```tsx
import "@agentconsent/react/theme.css";
// Or: import "@agentconsent/react/tokens.css";
```

Patterns use compound components, with a `Root` coordinating their shared behavior:

```tsx
import { ActionPreview } from "@agentconsent/react";

<ActionPreview.Root onApprove={sendEmail} onReject={cancel}>
  <ActionPreview.Header>
    <ActionPreview.Title>Send email?</ActionPreview.Title>
  </ActionPreview.Header>
  <ActionPreview.Fields>
    <ActionPreview.Field label="To">Dana</ActionPreview.Field>
    <ActionPreview.Field label="Subject">Project update</ActionPreview.Field>
  </ActionPreview.Fields>
  <ActionPreview.Actions>
    <ActionPreview.Approve>Send email</ActionPreview.Approve>
    <ActionPreview.Reject>Cancel</ActionPreview.Reject>
  </ActionPreview.Actions>
</ActionPreview.Root>
```

## Components

One component per pattern. Each links to its full documentation: anatomy, when (not) to
use it, accessibility guidance, anti-patterns, and a live demo.

| Component | Pattern |
| --- | --- |
| `ScopedGrant` | [Scoped Grant](https://agentconsent.dev/patterns/scoped-grant/) — granular access instead of all-or-nothing scopes |
| `ProgressiveScope` | [Progressive Scope](https://agentconsent.dev/patterns/progressive-scope/) — ask for more access only when the task needs it |
| `ConnectionCard` | [Connection Card](https://agentconsent.dev/patterns/connection-card/) — review and revoke a standing connection |
| `ActionPreview` | [Action Preview](https://agentconsent.dev/patterns/action-preview/) — show the exact action before it runs |
| `IrreversibilityGate` | [Irreversibility Gate](https://agentconsent.dev/patterns/irreversibility-gate/) — confirmation friction scaled to consequence |
| `BatchApproval` | [Batch Approval](https://agentconsent.dev/patterns/batch-approval/) — triage a queue without rubber-stamping |
| `ConsentMemory` | [Consent Memory](https://agentconsent.dev/patterns/consent-memory/) — "always allow" with legible consequences |
| `AuthorityBoundary` | [Authority Boundary](https://agentconsent.dev/patterns/authority-boundary/) — one surface mapping capabilities to autonomy levels |
| `SpendLimits` | [Spend & Rate Limits](https://agentconsent.dev/patterns/spend-rate-limits/) — numeric guardrails as consent primitives |
| `InjectionFlag` | [Injection Flag](https://agentconsent.dev/patterns/injection-flag/) — surface instructions that came from untrusted content |
| `ActionReceipt` | [Action Receipt](https://agentconsent.dev/patterns/action-receipt/) — a post-hoc record of what ran, under what authority |
| `CredentialHandoff` | [Credential Handoff](https://agentconsent.dev/patterns/credential-handoff/) — keep secrets out of the agent's reach |

## Theming

`theme.css` is a complete default skin driven by `--acp-*` CSS custom properties, with
light and dark themes included. Override the variables to retheme, or import `tokens.css`
alone and style the components from scratch — every part exposes a stable `data-acp`
attribute to target.

See the [library guide](https://agentconsent.dev/library/) for theming and composition
details.

## Security

Releases are built and published from GitHub Actions with npm Trusted Publishing and
provenance attestation — verify with `npm audit signatures` in a project that installs
this package. No install scripts, one runtime dependency (Radix).

Report vulnerabilities privately as described in
[SECURITY.md](https://github.com/mrchaarlie/agent-consent-patterns/blob/main/SECURITY.md).

## License

[MIT](https://github.com/mrchaarlie/agent-consent-patterns/blob/main/LICENSE)
