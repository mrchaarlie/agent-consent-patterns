# Agent Consent Patterns

[![CI](https://github.com/mrchaarlie/agent-consent-patterns/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/mrchaarlie/agent-consent-patterns/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/%40agentconsent%2Freact?logo=npm&label=%40agentconsent%2Freact)](https://www.npmjs.com/package/@agentconsent/react)
[![npm provenance](https://img.shields.io/badge/npm-provenance-brightgreen?logo=npm)](https://www.npmjs.com/package/@agentconsent/react)
[![license](https://img.shields.io/github/license/mrchaarlie/agent-consent-patterns)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

**UX patterns for AI-agent permissions, consent, and human-in-the-loop control.** Agent Consent
Patterns is a live reference site, an accessible React component library, and a reusable skill for
coding agents building products that act on a person's behalf.

**Explore the reference at [agentconsent.dev](https://agentconsent.dev).**

Every release is built and published from GitHub Actions with npm Trusted Publishing and provenance
— verify with `npm audit signatures @agentconsent/react` — with no install scripts and WCAG 2.2 AA,
axe-tested components. See [Quality and security](#quality-and-security) below and
[SECURITY.md](SECURITY.md) for the vulnerability reporting process.

## Why this exists

Agentic products create consent problems that ordinary application permissions do not cover. A
simple "allow access to your email" prompt does not explain what an agent will do, how long the
authority lasts, which actions need review, or how a person can inspect and revoke it later.

This project gives teams a shared language and concrete, accessible implementations for those
decisions: scope, standing authority, irreversible actions, prompt injection, credential handoff,
and auditability.

## The pattern library

The reference documents 12 patterns, each with a decision model, live demo, accessibility guidance,
real-world examples, implementation notes, and anti-patterns.

| Category | Patterns |
| --- | --- |
| Granting access | Scoped Grant · Progressive Scope · Connection Card |
| Approving actions | Action Preview · Irreversibility Gate · Batch Approval |
| Standing authority | Consent Memory · Authority Boundary · Spend & Rate Limits |
| Trust & transparency | Injection Flag · Action Receipt · Credential Handoff |

[Browse all patterns →](https://agentconsent.dev/patterns/)

## React library

[`@agentconsent/react`](https://www.npmjs.com/package/@agentconsent/react) provides headless React
primitives for every pattern. The components provide interaction and accessibility semantics; your
application supplies the language, data, callbacks, and visual treatment.

```sh
npm install @agentconsent/react
```

Start with the default theme, or import only the tokens when you want to provide all component
styles yourself:

```tsx
import "@agentconsent/react/theme.css";
// Or: import "@agentconsent/react/tokens.css";
```

Patterns use compound components, with a `Root` coordinating their shared behavior:

```tsx
import { ActionPreview } from "@agentconsent/react";

<ActionPreview.Root>
  <ActionPreview.Header>
    <ActionPreview.Title>Send email?</ActionPreview.Title>
  </ActionPreview.Header>
  <ActionPreview.Fields>
    <ActionPreview.Field label="To">Dana</ActionPreview.Field>
    <ActionPreview.Field label="Subject">Project update</ActionPreview.Field>
  </ActionPreview.Fields>
  <ActionPreview.Actions>
    <ActionPreview.Button onClick={sendEmail}>Send email</ActionPreview.Button>
    <ActionPreview.Button onClick={cancel}>Cancel</ActionPreview.Button>
  </ActionPreview.Actions>
</ActionPreview.Root>
```

See the [library guide](https://agentconsent.dev/library/) for theming and composition, or choose a
primitive from the [pattern index](https://agentconsent.dev/patterns/) rather than from its name alone.

## Use the skill with a coding agent

The included `agent-consent-patterns` skill gives coding agents the pattern vocabulary, selection guidance,
anti-patterns, and accessibility checks behind this reference. Use it when an agent is designing,
building, or reviewing consent flows.

### Claude app

1. Open **Customize** > **Plugins**.
2. In **Personal plugins**, select **+** > **Add marketplace**.
3. Choose **Add from a repository**, paste `https://github.com/mrchaarlie/agent-consent-patterns`, then add the marketplace.
4. Select **agent-consent-patterns** from the marketplace and click **Install**.

### Claude Code

Run this in a terminal. It refreshes the marketplace first when you have already added it:

```sh
(claude plugin marketplace add mrchaarlie/agent-consent-patterns || claude plugin marketplace update agent-consent-patterns) && claude plugin install agent-consent-patterns@agent-consent-patterns
```

### Codex

```sh
(codex plugin marketplace add mrchaarlie/agent-consent-patterns || codex plugin marketplace upgrade agent-consent-patterns) && codex plugin add agent-consent-patterns@agent-consent-patterns
```

For other compatible agents, copy the complete
[`plugins/agent-consent-patterns/skills/agent-consent-patterns/`](plugins/agent-consent-patterns/skills/agent-consent-patterns/)
directory into the agent's skills location. [Read the skill guide →](https://agentconsent.dev/skill/)

## Read it your way — or let an agent read it

The site offers every explanatory passage at three reading levels: **Caveman**, **Human**, and
**Academic**. The Human level is the canonical source for metadata and the agent-readable views.

Those views follow the [llms.txt](https://llmstxt.org) convention and are generated from the same
site content as the human pages:

- [llms.txt](https://agentconsent.dev/llms.txt) — concise index of the reference.
- [llms-full.txt](https://agentconsent.dev/llms-full.txt) — every pattern and guide in one document.
- Markdown mirrors — for example, [Action Preview](https://agentconsent.dev/patterns/action-preview.md),
  [principles](https://agentconsent.dev/principles.md), and the [library guide](https://agentconsent.dev/library.md).

Each human page advertises its Markdown counterpart, so agents can discover the alternative view
without parsing the rendered application.

## Project structure

```text
packages/react/   Published @agentconsent/react component library
apps/site/        Next.js static reference site and live pattern demos
plugins/          Claude / Codex plugin and portable skill
```

## Development

Requires Node.js 20 or later and pnpm 11.

```sh
pnpm install
pnpm dev          # reference site at http://localhost:3000
pnpm build        # library, static site, and agent-readable mirrors
pnpm test         # library unit/axe tests and site Playwright tests
pnpm typecheck
pnpm lint
```

## Quality and security

The library is built on Radix UI primitives and is designed for keyboard operation and WCAG 2.2 AA
workflows. Accessibility checks run with axe in both unit tests and real-browser Playwright tests.
Published npm releases are built and released through GitHub Actions with npm Trusted Publishing and
provenance.

Please report vulnerabilities privately as described in [SECURITY.md](SECURITY.md), rather than
opening a public issue.

## License

[MIT](LICENSE)
