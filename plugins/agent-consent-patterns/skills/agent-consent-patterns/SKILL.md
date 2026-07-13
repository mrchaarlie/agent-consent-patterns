---
name: agent-consent-patterns
description: Best practices for designing AI agent consent, permission, and human-in-the-loop UX. Use when building or reviewing ANY surface where an agent asks for access, previews an action, holds standing authority, or reports what it did, such as OAuth/connection screens, tool-approval dialogs, permission settings, autonomy levels, spend caps, activity logs, credential flows. Triggers on "agent permissions", "consent screen", "approval dialog", "human in the loop", "tool approval", "connect integration", "always allow", "autonomy settings".
---

# Agent Consent Patterns

Distilled best practices for consent UX in agentic products, from
[agent-consent-patterns](https://github.com/mrchaarlie/agent-consent-patterns). A taxonomy of
12 named patterns with production React implementations (`@agentconsent/react`). Use this skill
to (a) pick the right pattern for a consent surface, (b) get its non-negotiable rules right, and
(c) avoid the anti-patterns that make consent theater.

## Core principles (apply to every consent surface)

1. **Consent requires legibility.** A user can only consent to what they can understand. Show
   concrete facts (recipient, amount, scope, resource), never categories ("wants to access your
   account"). If you can't explain a permission in plain language, don't ask for it.
2. **Friction proportional to consequence.** Reversible → one click. Undoable → one click plus a
   visible recovery path. Irreversible → enumerated consequences and a deliberate gesture
   (type-to-confirm). Uniform friction trains click-through exactly where it must not.
3. **Declining is always safe.** "No" must never feel destructive or final. Initial focus lands on
   the least-destructive action; Escape routes to the same "no" callback, never an ambiguous
   dismissal that leaves an action half-pending.
4. **Authority is granted over time, not in a moment.** "Always allow" is a standing delegation
   made under task focus. Make duration a first-class, legible choice; default to "just this
   once"; never pre-select or visually favor the standing option.
5. **An agent can never exceed its principal.** Delegation narrows authority, never amplifies it.
   Never offer the agent a capability the user themself doesn't hold (the confused-deputy bound).
6. **Provenance is part of the request.** When an instruction arrived from untrusted content (a
   web page, an email, tool output), say so before asking for approval.
7. **Consent continues after approval.** Every consequential action leaves a receipt; standing
   grants stay visible, with last-used recency, after the consent screen is gone.
8. **Revocation must be real and immediate.** A grant that can't be effectively withdrawn was
   never consent. Pause and revoke live one affordance away from every standing grant.
9. **Authority should expire by default.** Standing is not forever. Prefer session- and
   task-scoped grants; re-surface long-lived ones for reconfirmation.
10. **Minimize what the agent can see.** Least privilege applies to data, not just actions.
    Scope to the narrowest resource (one label, one folder), not the whole account.

## The 12 patterns: pick by situation

**Granting access** (connecting an agent to a service):
- **Scoped Grant**. The connect screen. Per-capability checkboxes tagged read/write/delete (as
  text, never color alone), grouped by resource with the narrowing stated ("'Board 2026' label
  only"). Read is the default; write/delete start unchecked. Required scopes shown locked and
  labeled, never silently bundled. The grant button shows the count it will grant.
- **Progressive Scope**. Escalation mid-task. Ask for exactly one new scope, at the moment the
  agent is blocked, with the reason tied to the blocked action and what it already has. "Just
  this once" is the easy answer; "always" is deliberate. A denial sticks, no nagging.
- **Connection Card**. The settings tile a standing grant lives in afterward. Shows current
  scopes with access levels, status as text ("Active", "Needs re-auth"), last-used recency, and
  pause/revoke. A grant with no card is a write-only grant. The anti-pattern.

**Approving actions** (a specific act, before it executes):
- **Action Preview**. Render the action as structured facts (To / Subject / Amount, verbatim),
  with approve/reject labels that name the act ("Send email", not "OK"). The preview is a
  contract: what's shown is exactly what executes; any post-approval change requires a new
  preview. Never summarize the parameter most worth checking ("Dana and 2 others").
- **Irreversibility Gate**. Grade the confirm by severity: reversible (click), undoable (click +
  advertised undo), irreversible (enumerated consequences + type-to-confirm). Prefer
  type-to-confirm over hold-to-confirm (hold is an accessibility dead end). Never inflate
  consequences; crying wolf blunts the real warnings.
- **Batch Approval**. For bursty queues. Routine items are selectable and sweepable with a live
  count; high-stakes items are flagged "review individually" and structurally excluded from
  select-all, safe by construction, not by the user remembering to deselect.

**Standing authority** (what the agent may keep doing):
- **Consent Memory**. The once/session/scoped-always/always ladder. Each option states its
  consequence next to the choice; the confirm button relabels itself ("Allow once" vs "Allow
  always"). Only offer memory where remembering is genuinely useful, never for moving money or
  irreversible deletion.
- **Authority Boundary**. Per-category autonomy levels (e.g. Never / Ask first / Automatic) set
  deliberately in settings, not captured as a by-product of prompts. The current boundary is
  always inspectable.
- **Spend & Rate Limits**. Numeric ceilings (budget caps, action counts, time windows) enforced
  outside the agent, with used-of-cap meters and threshold warnings. Limits fail closed: at the
  cap the agent stops and asks; it never "borrows".

**Trust & transparency** (after and around the act):
- **Injection Flag**. When instructions arrive from untrusted content, quote the suspicious
  instruction, name its source, and require an explicit decision before acting on it. A flag
  complements server-side defenses; it never replaces them.
- **Action Receipt**. The post-hoc record: what was done, when, under what authority, with undo
  where it's honest. Never show an undo affordance you can't honor.
- **Credential Handoff**. The agent never holds the secret. Delegate sign-in/payment to a
  password manager, passkey, takeover-by-human, or scoped token; the agent receives a session or
  a one-time token, not the credential.

## Review checklist

When reviewing (or generating) a consent surface, check:

- [ ] Access levels (read/write/delete) carried as **text**, never color alone.
- [ ] The safe/least-authority option is the **default and initial focus**; Escape = "no".
- [ ] Scope narrowed to a **resource**, not an account; write/delete opt-in, not pre-checked.
- [ ] Consequential parameters shown **verbatim**, no paraphrase, no "…and 2 more".
- [ ] Friction graded to consequence; type-to-confirm only at the irreversible tier.
- [ ] "Always allow" is deliberate: consequence stated, never pre-selected, paired with a
      visible revocation surface.
- [ ] Batch approve cannot reach flagged high-stakes items.
- [ ] Every consequential action produces a receipt; standing grants show last-used.
- [ ] Nothing offers the agent more authority than the user has (intersection bound).
- [ ] Secrets never transit the agent.

## Accessibility non-negotiables

- Modal decision flows are alert dialogs (focus trapped, named by title, initial focus on the
  least-destructive action). Inline prompts are labeled `role="group"` and never steal focus.
- Choices are native inputs (checkboxes, radios in `fieldset`/`legend`) with consequences wired
  via `aria-describedby`. Counts and state changes announce via polite live regions.
- No information by color alone; no hold-to-confirm as the only path; scrollable regions
  keyboard-focusable.

## Going deeper

- Full write-ups (problem, anatomy, when/when-not, anti-patterns, code): the docs site in
  https://github.com/mrchaarlie/agent-consent-patterns, one page per pattern under
  `apps/site/content/patterns/`, e.g. `scoped-grant.mdx`.
- React implementation: `@agentconsent/react`, headless Radix-based primitives + a themeable
  default theme (`theme.css`, tokens as `--acp-*` CSS variables).
