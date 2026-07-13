import type { Metadata } from "next";
import { Lvl } from "@/components/lvl";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Shared vocabulary for agent consent UX: scope, standing consent, human-in-the-loop, delegated authority, and more.",
};

// Each term carries the definition at all three reading levels; `human` is the
// canonical copy (mirrored into the agent view by generate-agent-view.mjs).
const TERMS: {
  term: string;
  caveman: string;
  human: string;
  academic: string;
}[] = [
  {
    term: "Delegated authority",
    caveman:
      "The power you lend the machine to act as you. Every pattern on this site exists to keep that lent power visible, small, and easy to take back.",
    human:
      "The permission a user extends to an agent to act on their behalf: the thing every pattern on this site exists to make legible, bounded, and revocable.",
    academic:
      "Authority a principal confers on an agent to act on their behalf: the object of study for this whole collection. Sound delegation keeps the conferred authority legible (statable by the principal), bounded (within the principal's own rights, per the intersection bound), and revocable (terminable without cost asymmetry).",
  },
  {
    term: "Scope",
    caveman:
      "The edges of a yes: which stuff, which touches (look, change, destroy), for how long. A good yes has edges the machine cannot slip past.",
    human:
      "The boundary of what a grant permits: which resources, which operations (read, write, delete), for how long. Agent scopes must describe behavior, not just API surface.",
    academic:
      "The extent of a grant along three axes: resources designated, operations permitted (read/write/delete), and temporal validity. Agent scopes must be behavioral descriptions, not opaque API strings. A scope the principal cannot restate is a scope they cannot have meaningfully consented to.",
  },
  {
    term: "Grant",
    caveman:
      "One yes you gave the machine, with its edges and its lifespan. A grant is a thing you can look at later and take back, not a box you swatted once and forgot.",
    human:
      "A specific permission a user has given an agent, with its scope and duration. Grants are objects users should be able to inspect and revoke, not one-time dialog dismissals.",
    academic:
      "A discrete authorization with identity, scope, and duration: a first-class object in the consent model. Treating grants as inspectable, enumerable, revocable state (rather than as consumed dialog events) is what makes review surfaces like the Connection Card and Authority Boundary possible at all.",
  },
  {
    term: "Least privilege",
    caveman:
      "Give the machine the smallest key that does the job, and let it see the least stuff, no more. Applies to what it can do and what it can read.",
    human:
      "The rule that an agent should hold the narrowest authority (and see the least data) a task requires, and no more. Applies to both what an agent can do and what it can read.",
    academic:
      "The classical security principle (Saltzer & Schroeder) that a component should operate with the minimum authority its task requires, extended here to both capability (what the agent may do) and observation (what it may read), since for language-model agents, data seen is influence gained and exposure risked.",
  },
  {
    term: "Confused deputy",
    caveman:
      "A strong servant tricked by a weak stranger into using its master's keys for the stranger. Stopped by one rule: the machine's reach is never bigger than the smaller of its own keys and its master's rights.",
    human:
      "A privileged agent tricked into misusing its authority on behalf of a less-privileged caller. Prevented by binding the agent's effective permissions to the intersection of its own grant and its principal's rights, never letting delegation amplify authority.",
    academic:
      "Hardy's classic capability-security failure: a privileged intermediary exercises its authority on behalf of a less-privileged requester. Prompt injection is its LLM-native instantiation: untrusted content borrowing the agent's standing grants. The defense is the intersection bound (effective authority = agent's grant ∩ principal's rights) plus provenance surfaced at the interface, as in the Injection Flag.",
  },
  {
    term: "Standing consent",
    caveman:
      "A yes that keeps working after today, \"always allow.\" The most dangerous kind, because it is given in one tired moment and then lives forever.",
    human:
      "Permission that persists beyond the current task, \"always allow.\" The riskiest consent type, because it is decided in a moment and lives indefinitely.",
    academic:
      "Authorization persisting beyond the eliciting task. This is the highest-risk consent class, because decision context and consequence context diverge maximally: the choice is made under task pressure, the effects accrue indefinitely and unobserved. Consent Memory governs its creation; the Authority Boundary and receipts govern its life.",
  },
  {
    term: "Human-in-the-loop (HITL)",
    caveman:
      "You train a strong wolf-dog to hunt mammoth. Dog is fast and strong but also dumb, chases wrong beast, runs at cliffs. So you watch, and you shout \"good!\" or \"NO. BAD.\" before it leaps. Machine is the dog. You are the human in the loop. Hunt goes better together.",
    human:
      "A workflow that keeps a real person involved while machines do the work: the agent runs fast and handles the heavy lifting, but designated actions pause for the human to review, correct, or veto before they proceed. The consent question is which actions pause, and what the reviewer sees.",
    academic:
      "A supervisory control architecture in which autonomous systems execute while a human retains review and veto authority over designated action classes. HITL addresses the residual-error problem no model quality eliminates (distributional shift, misalignment, adversarial input) by inserting corrective checkpoints; the design questions are which actions pause (see proportional friction), what the reviewer sees (see legibility), and how review avoids degrading into rubber-stamping (see approval fatigue).",
  },
  {
    term: "Irreversible action",
    caveman:
      "A thing with no take-backs: letter sent, money gone, pile burned. How-hard-to-undo, not how-important-it-feels, is what should decide how heavy the asking gets.",
    human:
      "An action with no undo: sending a message, executing a payment, deleting data. Irreversibility, not importance, is what should scale confirmation friction.",
    academic:
      "An action with no unilateral reversal path: sent messages, executed payments, destroyed data. Recovery cost, not felt importance, is the correct input to confirmation friction (the Irreversibility Gate's thesis), because importance is emotional and recoverability is structural.",
  },
  {
    term: "Prompt injection",
    caveman:
      "Trick-words hidden in something the machine reads (a page, a letter), trying to steer it away from you. Fought by making the machine show where every order came from before it obeys.",
    human:
      "Instructions embedded in content the agent processes (a web page, an email) that attempt to hijack its behavior. Consent surfaces defend against it by exposing instruction provenance.",
    academic:
      "Adversarial instructions embedded in content the agent processes, exploiting the model's single undifferentiated token stream to smuggle commands through the data channel. Generally regarded as unsolvable in principle (like social engineering), which is why the interface-level defense (surfacing provenance and requiring user adjudication, as in the Injection Flag) matters alongside classifiers and scoping.",
  },
  {
    term: "Provenance",
    caveman:
      "Where an order came from: your mouth, the machine's own plan, or a stranger's scroll. You cannot judge an ask without knowing whose ask it is.",
    human:
      "Where an instruction or request originated: the user, the agent's own plan, or untrusted third-party content. Part of what a user needs to evaluate any approval request.",
    academic:
      "The origin of an instruction or request (principal, agent inference, or untrusted third-party content) tracked through the processing pipeline and surfaced at decision points. Provenance is the fact the token stream erases and the one adversarial-content defenses depend on restoring; it is also what an approval surface owes the reviewer about the request itself.",
  },
  {
    term: "Action receipt",
    caveman:
      "The mark the machine leaves after acting: what it did, when, under whose yes, and whether it can be pulled back. The looking-backward half of consent.",
    human:
      "A post-hoc record of an agent action: what it did, when, under what authority, and whether it can be undone. The audit half of the consent loop.",
    academic:
      "The durable post-hoc record binding an agent action to its parameters, timestamp, authorizing grant, and reversal status. Receipts close the consent loop for standing authority (the exercises no prompt ever surfaced) and make overreach distinguishable from authorized behavior; see the Action Receipt pattern.",
  },
  {
    term: "Approval fatigue",
    caveman:
      "Too many little yes-boxes make the hand click without the eyes looking, and then the one box that mattered gets the same blind click. The sickness that proportional friction and batch approval exist to cure.",
    human:
      "The erosion of meaningful review when users face too many confirmations. The failure mode that proportional friction and batch approval exist to prevent.",
    academic:
      "Habituation-driven decay of review quality under repeated confirmation demands: responses compile into motor rhythm and scrutiny converges toward zero uniformly across stakes. The central budget constraint of consent design (friction is a finite resource), motivating proportional friction, batch triage, and standing policy as spending disciplines.",
  },
];

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="eyebrow">Vocabulary</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Glossary</h1>
      <p className="mt-4 leading-relaxed text-ink-muted">
        Shared terms used across the patterns. Naming things consistently is
        half the point of a pattern library.
      </p>
      <dl className="mt-10">
        {TERMS.map(({ term, caveman, human, academic }) => (
          <div
            key={term}
            className="grid gap-2 border-b border-line py-5 sm:grid-cols-[12rem_1fr] sm:gap-6"
          >
            <dt className="font-semibold tracking-tight">{term}</dt>
            <dd className="text-sm leading-relaxed text-ink-muted">
              <Lvl level="caveman" as="span">
                {caveman}
              </Lvl>
              <Lvl level="human" as="span">
                {human}
              </Lvl>
              <Lvl level="academic" as="span">
                {academic}
              </Lvl>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
