export type PatternCategory =
  | "Granting access"
  | "Approving actions"
  | "Standing authority"
  | "Trust & transparency";

export interface PatternMeta {
  /** 1-based position in the canonical taxonomy ordering. */
  number: number;
  slug: string;
  name: string;
  category: PatternCategory;
  /**
   * One-sentence problem statement, shown on index cards. `problem` is the
   * canonical (Human reading level) copy. It also feeds page metadata and
   * the agent-view mirrors; the other two feed the site's level switcher.
   */
  problem: string;
  problemCaveman: string;
  problemAcademic: string;
  status: "live" | "planned";
}

export const CATEGORIES: PatternCategory[] = [
  "Granting access",
  "Approving actions",
  "Standing authority",
  "Trust & transparency",
];

/**
 * One-line description of each category, at all three reading levels. Used by
 * the home-page overview (which links out to the full index rather than
 * repeating it). `human` is the canonical copy that feeds the agent-view mirror.
 */
export const CATEGORY_BLURB: Record<
  PatternCategory,
  { caveman: string; human: string; academic: string }
> = {
  "Granting access": {
    caveman:
      "How you hand the machine a key: which key, when, and where you can see what it's already holding.",
    human:
      "How a user first hands an agent access: at what granularity, when in the task, and where to review it later.",
    academic:
      "The initial conferral of authority: it decomposes scope, defers escalation until need is demonstrated, and keeps granted connections legible.",
  },
  "Approving actions": {
    caveman:
      "Saying yes to one act before it happens: you see the real thing, and acts you can't take back get a heavier gate.",
    human:
      "Deciding on individual actions before they run: showing the exact act, and matching friction to how reversible it is.",
    academic:
      "Per-action authorization: rendering verbatim parameters, scaling confirmation to recovery cost, and triaging queues without rubber-stamping.",
  },
  "Standing authority": {
    caveman:
      "Yeses that keep working after today: where they live, what limits them, and when they run out.",
    human:
      "Permissions that persist beyond the current task: how they're set, kept in view, bounded, and ended.",
    academic:
      "Durable delegation: consequence-labeled durability at grant time, an aggregated policy surface, and quantitative limits that reset.",
  },
  "Trust & transparency": {
    caveman:
      "Knowing whose words the machine acts on, what it did after, and never letting it hold your secret.",
    human:
      "Knowing where a request came from, what the agent did afterward, and keeping secrets out of its reach.",
    academic:
      "Provenance and accountability: surfacing untrusted-instruction origin, recording each exercise, and excluding the agent from credential paths.",
  },
};

export const PATTERNS: PatternMeta[] = [
  {
    number: 1,
    slug: "scoped-grant",
    name: "Scoped Grant",
    category: "Granting access",
    problem:
      "OAuth-era scope screens don't show what an agent can actually do with access. Reading a single message and exporting an entire inbox look the same on the consent screen.",
    problemCaveman:
      "One \"allow\" button can mean read one letter, or burn the whole mail pile. Same button. Use small keys instead.",
    problemAcademic:
      "OAuth's opaque scope strings collapse capability granularity to a single bit. The consent screen has to decompose grants along access-level and resource axes, or it forces over-provisioning by construction.",
    status: "live",
  },
  {
    number: 2,
    slug: "progressive-scope",
    name: "Progressive Scope",
    category: "Granting access",
    problem:
      "Asking for every permission upfront forces users to consent to hypotheticals. Agents should start minimal and ask for more only when the task needs it.",
    problemCaveman:
      "Don't hand over every key on day one. Give the small key first. Let it ask for the next one only when it hits a locked door.",
    problemAcademic:
      "Upfront permission maximalism elicits consent with zero task context. Deferring capability acquisition to the moment of demonstrated need keeps the authority curve tied to earned trust.",
    status: "live",
  },
  {
    number: 3,
    slug: "connection-card",
    name: "Connection Card",
    category: "Granting access",
    problem:
      "Once granted, connections become invisible. Users need a surface that shows the current grant state, when it was last used, and a way to revoke it.",
    problemCaveman:
      "Keys you hand over go invisible. Show what the machine still holds, when it last used it, and how to take it back.",
    problemAcademic:
      "Consent decays while authority persists. Standing grants need a present-tense representation (capability state, lifecycle status, recency, reversal) to remain governable.",
    status: "live",
  },
  {
    number: 4,
    slug: "action-preview",
    name: "Action Preview",
    category: "Approving actions",
    problem:
      "\"The agent wants to send an email\" isn't enough to approve. Users need to see the exact action: the recipient, the content, and the amount, before it runs.",
    problemCaveman:
      "\"Machine wants to send a letter\" isn't enough. Show who it goes to, what it says, and what it costs, before it flies.",
    problemAcademic:
      "Generic confirmations collect assent over a category while the agent executes a token. Review has to render the verbatim parameters, since they are model inferences that no human ever typed.",
    status: "live",
  },
  {
    number: 5,
    slug: "irreversibility-gate",
    name: "Irreversibility Gate",
    category: "Approving actions",
    problem:
      "Uniform confirmation friction trains users to click through. Weight the gate to the consequence instead.",
    problemCaveman:
      "Same fence for every act teaches hands to hop it without looking. Small acts get a small door. Forever-acts get a heavy one, with spoken words.",
    problemAcademic:
      "Uniform confirmation is a zero-variance signal that trains click-through. Confirmation cost has to scale with recovery cost, up to typed commitment for what can't be undone.",
    status: "live",
  },
  {
    number: 6,
    slug: "batch-approval",
    name: "Batch Approval",
    category: "Approving actions",
    problem:
      "Reviewing agent work item by item causes approval fatigue. Queues need a way to triage without collapsing into rubber-stamping.",
    problemCaveman:
      "Judging a pile piece by piece numbs the hand. Wave the safe pieces through together. Pull the risky one out alone.",
    problemAcademic:
      "Serial modals amortize scrutiny to zero, and blanket approval deletes it outright. Queues need bulk triage over the routine partition, with flagged items structurally excluded from every group operation.",
    status: "live",
  },
  {
    number: 7,
    slug: "consent-memory",
    name: "Consent Memory",
    category: "Standing authority",
    problem:
      "\"Always allow\" is a standing grant made in a moment of task focus. Each memory option needs consequences the user can actually read.",
    problemCaveman:
      "\"Always allow\" is the button tired hands press to kill the box forever. Ask how long, separately, and show the price.",
    problemAcademic:
      "The in-task prompt makes maximal authority transfer the path of least friction. Durability needs to be its own consequence-labeled choice, with the ephemeral option as the default.",
    status: "live",
  },
  {
    number: 8,
    slug: "authority-boundary",
    name: "Authority Boundary",
    category: "Standing authority",
    problem:
      "Users need one settings surface that answers: what may this agent ever do on its own, and what must it always ask about?",
    problemCaveman:
      "Little yeses pile up until nobody knows what the machine can do alone. One list should rank every ability: on its own, ask first, or never.",
    problemAcademic:
      "Standing authority accretes without aggregation, so the effective policy becomes unstatable. It needs one editable surface that maps every capability to an explicit autonomy level.",
    status: "live",
  },
  {
    number: 9,
    slug: "spend-rate-limits",
    name: "Spend & Rate Limits",
    category: "Standing authority",
    problem:
      "Numeric guardrails (budget caps, action counts, time windows) are consent primitives, not billing features.",
    problemCaveman:
      "\"Spend $100 a week, then come back\" is the leash, not a bill-setting. Show the cap next to what's already spent.",
    problemAcademic:
      "Quantitative guardrails are consent primitives, not billing configuration. They should be metered against live usage, editable in place, and treat cap-reached as a re-consent event that fails closed.",
    status: "live",
  },
  {
    number: 10,
    slug: "injection-flag",
    name: "Injection Flag",
    category: "Trust & transparency",
    problem:
      "When instructions arrive from untrusted content, the agent must show users where the instruction came from and ask whether to proceed.",
    problemCaveman:
      "Strangers hide orders inside pages the machine reads. It must stop, hold up the exact words, say where they came from, and ask you.",
    problemAcademic:
      "Data-channel imperatives exploit the model's undifferentiated token stream; unresolvable in principle, they must surface as provenance-labeled, verbatim-quoted consent events with non-compliance resting.",
    status: "live",
  },
  {
    number: 11,
    slug: "action-receipt",
    name: "Action Receipt",
    category: "Trust & transparency",
    problem:
      "Consent doesn't end at approval; users need a post-hoc record of what the agent did, under what authority, with undo where possible.",
    problemCaveman:
      "After the machine acts, it leaves a mark: what it did, who said it could, when, with an undo-rope where the act can still be pulled back.",
    problemAcademic:
      "Ex-ante consent is open-loop for standing grants; each exercise needs a durable record binding effect to authorizing grant, with reversal offered exactly where honorable.",
    status: "live",
  },
  {
    number: 12,
    slug: "credential-handoff",
    name: "Credential Handoff",
    category: "Trust & transparency",
    problem:
      "Agents should never see passwords or payment details; sign-in and payment delegate to a password manager or scoped token flow.",
    problemCaveman:
      "The machine must never touch your password or money-card. It steps aside; a trusted keeper takes the secret; the machine gets one small key back.",
    problemAcademic:
      "Agents are the system's maximum-exposure component; credential exchanges must exclude them structurally, routing to trusted custodians and returning only scoped, expiring derived instruments.",
    status: "live",
  },
];

export function getPattern(slug: string): PatternMeta | undefined {
  return PATTERNS.find((p) => p.slug === slug);
}
