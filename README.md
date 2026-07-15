# Agent Consent Patterns

[![CI](https://github.com/mrchaarlie/agent-consent-patterns/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/mrchaarlie/agent-consent-patterns/actions/workflows/ci.yml)

**UX patterns for AI agent permissions, consent, and human-in-the-loop control**. A reference
site and React component library for teams building products where an agent acts on a user's
behalf.

Site: **[agentconsent.dev](https://agentconsent.dev)**

## Why this exists

Agentic products face a consent design space traditional app permissions never had to handle.
A checkbox that says "Allow access to your email" was already a weak contract between a person
and an app; between a person and an *agent* (software that interprets intent, chains actions,
and keeps acting after the dialog closes), it breaks down entirely. Teams shipping agents today
are all improvising answers to the same questions:

- **Scope ambiguity:** what exactly did the user hand over, and can they tell?
- **Standing authority:** what may the agent keep doing tomorrow without asking again?
- **Irreversibility:** which actions deserve real friction, and which shouldn't nag?
- **Prompt injection:** when content the agent read starts issuing instructions, does the user find out?
- **Credential handoff:** how does an agent sign in or pay without ever holding the secret?
- **Auditability:** after the agent acts, what record does the user get, and what can they undo?

No canonical reference for these flows exists. This project is that reference.

## What you get

1. **A taxonomy of 12 named patterns** across four categories: a shared vocabulary so teams can
   say "that needs an Irreversibility Gate, not another confirm dialog" and mean the same thing:

   | Category | Patterns |
   |----------|----------|
   | Granting access | Scoped Grant · Progressive Scope · Connection Card |
   | Approving actions | Action Preview · Irreversibility Gate · Batch Approval |
   | Standing authority | Consent Memory · Authority Boundary · Spend & Rate Limits |
   | Trust & transparency | Injection Flag · Action Receipt · Credential Handoff |

   Each pattern is documented with the problem it solves, anatomy, when (not) to use it,
   real-world examples, accessibility notes, and anti-patterns.

2. **A production-quality React implementation of every pattern** (`@agentconsent/react`),
   headless-first: logic and accessibility ship as unstyled primitives (built on Radix UI), with
   a default theme (`@agentconsent/react/theme.css`) and design tokens as CSS variables
   (`@agentconsent/react/tokens.css`) so themes are swappable. WCAG 2.2 AA, axe-clean, fully
   keyboard-operable.

3. **A distilled best-practices skill for coding agents.** Install it into Claude Code, Codex, or
   another compatible agent, and it applies these patterns when it builds consent flows:

   ```
   /plugin marketplace add mrchaarlie/agent-consent-patterns
   /plugin install consent-ux@agent-consent-patterns
   ```

## Getting started

- **[React library guide](https://agentconsent.dev/library/):** install, theme, and compose the
  headless primitives in `@agentconsent/react`.
- **[Agent skill guide](https://agentconsent.dev/skill/):** install the consent-UX skill in Claude
  Code or Codex, or copy its portable `SKILL.md` directory into another compatible agent.

## Agent mode

The site has an agent-readable view: a plain-text/Markdown mirror so an agent can
read the reference without parsing React or hydration markup. It follows the
[llms.txt](https://llmstxt.org) convention.

- **`/llms.txt`**: an index of the whole site (the 12 patterns + principles,
  glossary, about) with one-line descriptions and links to each Markdown file.
- **`/llms-full.txt`**: every pattern and page concatenated into one document.
- **`/patterns/<slug>.md`, `/principles.md`, `/glossary.md`, `/about.md`,
  `/library.md`, `/skill.md`, `/index.md`**: clean Markdown mirrors of each page. Live component demos are
  replaced with a short note pointing back at the interactive page.

Every human page also advertises its mirror via
`<link rel="alternate" type="text/markdown">`, and the footer links to `llms.txt`.
These files are generated from the content sources (MDX + the pattern/glossary/
principles data) by `apps/site/scripts/generate-agent-view.mjs`, which runs as the
site's `postbuild` step, so the agent view can never drift from the human one.

## Structure

```
packages/react/   @agentconsent/react, headless components + styled default theme
apps/site/        Docs site (Next.js, static export), patterns, guides, principles, glossary
  scripts/        generate-agent-view.mjs, builds the llms.txt + Markdown mirror
plugins/          Claude Code plugin: the agent-consent best-practices skill
```

## Development

```sh
pnpm install
pnpm dev          # docs site at localhost:3000
pnpm build        # build library + static site
pnpm test         # unit + axe tests (library), Playwright smoke (site)
pnpm typecheck && pnpm lint
```

## Why Radix UI as the foundation

Its unstyled primitives (AlertDialog, Switch, RadioGroup, Slider) map directly onto the consent
patterns, ship per-package so consumers only pay for what they use, and are already familiar to
the design-engineering audience this library serves. That familiarity and the maturity of its
focus-management/aria wiring beat the alternatives (React Aria's hooks: deeper control, more glue
code; hand-rolling: zero deps, but we'd own every screen-reader edge case).

## Security

Please report vulnerabilities privately as described in [SECURITY.md](SECURITY.md), rather than
opening a public issue. The package release process uses CI, dependency review, and npm provenance
through Trusted Publishing once public publishing begins. See the [npm package](https://www.npmjs.com/package/@agentconsent/react)
for provenance information after a published release.

## License

MIT
