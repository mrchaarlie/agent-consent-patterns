import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Lvl, type ReadingLevel } from "@/components/lvl";

export const metadata: Metadata = {
  title: "Principles",
  description:
    "The twelve ideas every pattern in this library is built to protect: legibility, proportional friction, safe refusal, standing authority, the intersection bound, provenance, receipts, revocation, expiry, data minimization, agent identity, and interruptibility.",
};

function P({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <Link
      href={`/patterns/${slug}/`}
      className="underline underline-offset-4 hover:text-ink"
    >
      {children}
    </Link>
  );
}

const LEVELS: ReadingLevel[] = ["caveman", "human", "academic"];

interface Principle {
  name: string;
  lede: Record<ReadingLevel, string>;
  body: Record<ReadingLevel, ReactNode>;
}

// NOTE for maintainers: generate-agent-view.mjs mirrors this page to Markdown
// by parsing this array's source text. The `human` entries are the canonical
// copy; keep the `human: "…"` lede and `human: (<>…</>)` body shapes intact.
const PRINCIPLES: Principle[] = [
  {
    name: "Consent requires legibility",
    lede: {
      caveman: "You can only truly say yes to a thing you can understand.",
      human: "A user can only consent to what they can understand.",
      academic:
        "Assent without comprehension of the specific action is not consent.",
    },
    body: {
      caveman: (
        <>
          <p>
            A yes is not a click. It is understanding, and understanding is
            the part machines skip. &ldquo;The machine wants to send a
            letter&rdquo; is a <em>kind</em> of thing, not the thing itself.
            You never saw who gets it, or what it says. Whatever you nodded
            at isn&rsquo;t what actually happens.
          </p>
          <p>
            That is why <P slug="action-preview">Action Preview</P> puts the
            real letter on the table instead of a summary, and why{" "}
            <P slug="scoped-grant">Scoped Grant</P> splits look, change, and
            destroy into separate keys instead of one blurry
            &ldquo;access.&rdquo; An ask you can&rsquo;t read is an ask you
            can&rsquo;t refuse either.
          </p>
        </>
      ),
      human: (
        <>
          <p>
            Consent is not a click; it is an informed decision, and
            information is the part interfaces usually drop. &ldquo;The agent
            wants to send an email&rdquo; is a category, not an act. The user
            hasn&rsquo;t seen the recipient, the words, or the attachment, so
            whatever they approve isn&rsquo;t the thing that will actually
            happen. Legibility means the surface shows the exact action, in
            the terms of the action itself, before it runs.
          </p>
          <p>
            This is why <P slug="action-preview">Action Preview</P> renders the
            concrete fields rather than a summary, and why{" "}
            <P slug="scoped-grant">Scoped Grant</P> spells out read, write, and
            delete as distinct, legible powers instead of one opaque
            &ldquo;access.&rdquo; A request the user can&rsquo;t read is a
            request they can&rsquo;t meaningfully refuse.
          </p>
        </>
      ),
      academic: (
        <>
          <p>
            Consent is an informed decision, and the informational component is
            what interfaces systematically drop. &ldquo;The agent wants to send
            an email&rdquo; names a category, while the agent executes a
            token. That category/token gap is where agent error concentrates,
            since with an agent every parameter is a model inference rather
            than something the confirming user typed. Approval collected over a
            category has no referent; it transfers assent without transferring
            the information assent is conditioned on.
          </p>
          <p>
            Hence <P slug="action-preview">Action Preview</P>&rsquo;s verbatim
            parameter contract (what is shown is exactly what executes), and{" "}
            <P slug="scoped-grant">Scoped Grant</P>&rsquo;s decomposition of
            &ldquo;access&rdquo; into read/write/delete along stated resource
            scopes. Legibility is also the precondition for every other
            principle here: refusal, proportionality, and audit all presuppose
            a request the user can actually parse.
          </p>
        </>
      ),
    },
  },
  {
    name: "Friction proportional to consequence",
    lede: {
      caveman: "Heavy doors for heavy things. Light doors for light things.",
      human: "The weight of a gate should match the weight of the act.",
      academic:
        "Confirmation cost must be a monotonic function of recovery cost.",
    },
    body: {
      caveman: (
        <>
          <p>
            One fence for everything is worse than no fence. If every act
            costs one click, hands learn to click without eyes, and the one
            ask that mattered gets lost in the noise. Friction is a signal.
            A drumbeat that never changes says nothing. The gate should bend
            with the stakes: light for the fixable, heavy for the forever.
          </p>
          <p>
            <P slug="irreversibility-gate">Irreversibility Gate</P> lives this
            out. The fence grows with the fall, up to type-the-words for the
            truly unrecoverable. <P slug="batch-approval">Batch Approval</P>{" "}
            lets the harmless pile pass in one wave and pulls the dangerous
            piece out to be judged alone. The goal is never more friction. It
            is friction spent where it buys safety.
          </p>
        </>
      ),
      human: (
        <>
          <p>
            Uniform confirmation is worse than none: when every action costs
            the same click, users learn to click through everything, and the
            one prompt that mattered is lost in the noise. Friction is a
            signal, and a signal that never varies carries no information. The
            gate has to bend to the stakes, light for the reversible and heavy
            for the irreversible.
          </p>
          <p>
            <P slug="irreversibility-gate">Irreversibility Gate</P> makes this
            its whole thesis, scaling friction with severity up to
            type-to-confirm for the truly unrecoverable, while{" "}
            <P slug="batch-approval">Batch Approval</P> lets routine items
            clear in bulk and fences the high-stakes one out of the sweep. The
            point is never to add friction; it is to spend it where it buys
            safety.
          </p>
        </>
      ),
      academic: (
        <>
          <p>
            Uniform confirmation fails on information-theoretic grounds:
            friction is a signal, and a zero-variance signal carries no
            information, so users rationally compile the interaction into
            motor rhythm and habituation generalizes across stakes. Vigilance
            is a budget; every unearned ceremony is an overdraft against the
            prompt that will matter. The operative variable is recoverability,
            not felt importance: an undoable-but-important act needs less
            gate than a trivial-but-permanent one.
          </p>
          <p>
            <P slug="irreversibility-gate">Irreversibility Gate</P> implements
            the gradient per action, up to typed confirmation, which resists
            motor compilation precisely because it is cognitively rather than
            temporally expensive. <P slug="batch-approval">Batch Approval</P>{" "}
            implements it per queue, clearing the routine mass in bulk while
            structurally fencing the tail item out of the sweep.
            Proportionality is how a consent system protects its own
            signal-to-noise ratio.
          </p>
        </>
      ),
    },
  },
  {
    name: "Declining is always safe",
    lede: {
      caveman: "Saying no must never hurt.",
      human: "Saying no to an agent must never feel destructive or final.",
      academic:
        "Refusal must be the cheapest path, or approval stops being a choice.",
    },
    body: {
      caveman: (
        <>
          <p>
            If saying no costs you (lose your work, feel like you broke
            something, face the scary red button) you will say yes to things
            you shouldn&rsquo;t, just to stay out of trouble. The careful path
            must be the cheap one. Cancel keeps you where you were. The safe
            answer is the one your tired hand finds first.
          </p>
          <p>
            Every deciding-surface here points Escape and the resting cursor
            at the smallest answer, and <P slug="injection-flag">
              Injection Flag
            </P>{" "}
            says it loudest: the fastest way out of the box is to{" "}
            <em>not</em> obey the stranger&rsquo;s words. A careful choice
            that punishes the chooser is a broken design, full stop.
          </p>
        </>
      ),
      human: (
        <>
          <p>
            If refusing a request is expensive (it loses work, feels like
            punishment, or looks like the destructive option), users will
            approve things they shouldn&rsquo;t, just to stay safe. The
            cautious path has to be the cheap one. Cancel keeps the user where
            they were; the safe default is the one their reflexes reach first.
          </p>
          <p>
            Every decision surface here routes Escape and initial focus to the
            least-committal choice, and{" "}
            <P slug="injection-flag">Injection Flag</P> makes the point
            sharply: the fastest way out of the prompt is to <em>not</em>{" "}
            follow the untrusted instruction. A cautious choice that costs the
            user should be treated as a design bug.
          </p>
        </>
      ),
      academic: (
        <>
          <p>
            When refusal carries cost (lost work, destructive framing, social
            friction with the tool), the decision channel acquires a bias
            term, and observed approvals stop being evidence of preference.
            Consent elicited under asymmetric exit costs is selection
            pressure, not choice. The cautious path must therefore be the
            cheap one: cancel restores the status quo ante, and the reflexive
            gesture lands on the least-committal option in every modality.
          </p>
          <p>
            Concretely, every decision surface in this library routes Escape
            and initial focus to the safe exit, and{" "}
            <P slug="injection-flag">Injection Flag</P> is the principle at
            its sharpest, where the cautious default is also the correct
            adversarial prior. Any flow where caution costs the user is a
            calibration error imposed on them; treat it as a defect, not a
            style choice.
          </p>
        </>
      ),
    },
  },
  {
    name: "Authority is granted over time, not in a moment",
    lede: {
      caveman:
        "“Always allow” is a forever-gift handed over in one tired moment.",
      human:
        "“Always allow” is a standing delegation made in a moment of task focus.",
      academic:
        "Durable authority is decided under the conditions least suited to deciding it.",
    },
    body: {
      caveman: (
        <>
          <p>
            The yeses that matter most are the ones that keep working after
            the moment that made them. &ldquo;Always allow,&rdquo; pressed to
            make a box go away, is a decision about every future day, made at
            exactly the moment you were thinking about something else. So
            standing power needs a life of its own: a place where it can be
            seen, fenced, and changed with a cool head.
          </p>
          <p>
            <P slug="consent-memory">Consent Memory</P> makes how-long a real,
            visible rung at the moment of the yes, and{" "}
            <P slug="authority-boundary">Authority Boundary</P> gathers all the
            standing yeses onto one wall the passing boxes answer to. A gift
            you can&rsquo;t later find is a gift you can&rsquo;t govern.
          </p>
        </>
      ),
      human: (
        <>
          <p>
            The most consequential grants are the ones that keep applying
            after the moment that created them. &ldquo;Always allow,&rdquo;
            typed to get past a prompt, is a decision about every future
            instance, made under exactly the conditions least suited to
            weighing it. Standing authority therefore needs a life of its
            own: a surface where it is visible, bounded, and adjustable
            outside the heat of the task.
          </p>
          <p>
            <P slug="consent-memory">Consent Memory</P> makes durability a
            legible choice at the moment of granting, and{" "}
            <P slug="authority-boundary">Authority Boundary</P> gathers those
            standing decisions into one home the in-task prompts defer to. A
            grant the user can&rsquo;t later find is a grant they can&rsquo;t
            govern.
          </p>
        </>
      ),
      academic: (
        <>
          <p>
            Standing grants maximize the divergence between decision context
            and consequence context: the choice is made under task pressure,
            where the salient cost is the interruption, while the effects
            accrue indefinitely and unobserved. The in-task prompt is thus a
            hyperbolic-discounting machine: the button that ends the friction
            forever is the one that transfers the most authority, and the
            grants it produces are experienced as dialog dismissals, not
            authorizations.
          </p>
          <p>
            The correction is architectural: durability becomes a first-class,
            consequence-labeled choice at grant time (
            <P slug="consent-memory">Consent Memory</P>), and the resulting
            standing policy materializes on one reviewable, editable surface (
            <P slug="authority-boundary">Authority Boundary</P>) that the
            in-flow prompts defer to. Elicit in the moment, govern outside it:
            the two contexts have different epistemic qualities, and the
            system should use each for what it is good at.
          </p>
        </>
      ),
    },
  },
  {
    name: "An agent can never exceed its principal",
    lede: {
      caveman: "The dog’s leash is never longer than your own arm.",
      human: "Delegation narrows authority; it can never amplify it.",
      academic:
        "Effective authority = agent’s grant ∩ principal’s rights: delegation only narrows.",
    },
    body: {
      caveman: (
        <>
          <p>
            The machine&rsquo;s true reach is the overlap of two things: what
            you handed it, and what <em>you yourself</em> may do. It can only
            ever be smaller than both. The machine must never become a tunnel
            to something you couldn&rsquo;t reach on your own. That is the old
            trick where a strong servant gets fooled into using its
            master&rsquo;s keys for a stranger.
          </p>
          <p>
            And the echo of the rule matters as much as the rule:{" "}
            <strong className="font-medium text-ink">
              handing off never adds power.
            </strong>{" "}
            Helpers of helpers, tools, chains of machines: each link can only
            hold less than the one before. This is why{" "}
            <P slug="progressive-scope">Progressive Scope</P> answers
            &ldquo;give me more than my human has&rdquo; with a flat no, why an{" "}
            <P slug="authority-boundary">Authority Boundary</P> set to
            &ldquo;by itself&rdquo; is a lid and not a gift, and why{" "}
            <P slug="credential-handoff">Credential Handoff</P> hands back a
            small key instead of the whole ring.
          </p>
        </>
      ),
      human: (
        <>
          <p>
            An agent&rsquo;s effective authority is the intersection of what it
            was granted and what its human principal may actually do. It can
            only ever be a subset. The agent must never become a path to
            something the user couldn&rsquo;t do themselves: the classic
            confused-deputy failure, where a trusted intermediary is tricked
            into wielding its own privileges on an attacker&rsquo;s behalf.
          </p>
          <p>
            The corollary matters as much as the rule:{" "}
            <strong className="font-medium text-ink">
              delegation must not amplify.
            </strong>{" "}
            Sub-agents, tools, and chained calls inherit authority and can only
            narrow it; a hand-off is never a privilege upgrade. This is why{" "}
            <P slug="progressive-scope">Progressive Scope</P> treats a request
            to escalate past the principal as a hard denial, why an{" "}
            <P slug="authority-boundary">Authority Boundary</P> set to
            &ldquo;Automatic&rdquo; is a ceiling rather than a new power, and
            why <P slug="credential-handoff">Credential Handoff</P> returns a
            task-scoped credential instead of the keys.
          </p>
        </>
      ),
      academic: (
        <>
          <p>
            The invariant: effective agent authority is bounded by the
            intersection of the agent&rsquo;s grant and the principal&rsquo;s
            own rights, at every step of every delegation chain. Violations are
            Hardy&rsquo;s confused deputy, a privileged intermediary exercising
            its authority on behalf of a less-privileged requester, and prompt
            injection is exactly this failure in LLM-native form: untrusted
            content attempting to spend the agent&rsquo;s standing grants.
          </p>
          <p>
            The corollary is attenuation-only composition:{" "}
            <strong className="font-medium text-ink">
              delegation must not amplify
            </strong>{" "}
            across sub-agents, tools, or chained calls, since each hop inherits
            at most its parent&rsquo;s authority. Hence{" "}
            <P slug="progressive-scope">Progressive Scope</P>&rsquo;s hard
            denial of escalation past the principal, the{" "}
            <P slug="authority-boundary">Authority Boundary</P>&rsquo;s
            Automatic level as ceiling rather than grant, and{" "}
            <P slug="credential-handoff">Credential Handoff</P>&rsquo;s derived,
            attenuated credentials in place of root secrets. Every surface that
            can mint authority beyond the principal is a privilege-escalation
            channel wearing consent UI.
          </p>
        </>
      ),
    },
  },
  {
    name: "Provenance is part of the request",
    lede: {
      caveman:
        "You can’t judge an ask without knowing whose mouth it came from.",
      human:
        "A user can’t weigh a request without knowing where it came from.",
      academic:
        "Origin is not metadata; it is a load-bearing term of the request itself.",
    },
    body: {
      caveman: (
        <>
          <p>
            A machine that reads the world is reading words anyone could have
            written. An order hiding in a page, a letter, a scroll is{" "}
            <em>not your order</em>. Treating the two the same is how
            trick-words become actions. Where an ask came from is not a small
            detail on the side. It is part of the ask, and the asking-surface
            must carry it.
          </p>
          <p>
            <P slug="injection-flag">Injection Flag</P> exists entirely for
            this: it names the source, shows the stranger&rsquo;s exact words,
            and asks you, instead of letting a page quietly steer your
            machine. The where-from travels with the ask, or you are judging
            half of it.
          </p>
        </>
      ),
      human: (
        <>
          <p>
            An agent that reads the world is reading text anyone could have
            written. An instruction embedded in a web page, an email, or a
            document is not the user&rsquo;s instruction, and treating the two
            the same is how prompt injection turns into action. Where a request
            came from is not metadata; it is part of the request, and the
            consent surface has to carry it.
          </p>
          <p>
            <P slug="injection-flag">Injection Flag</P> exists entirely for
            this: it names the source, quotes the instruction verbatim, and
            asks, rather than letting content silently steer the agent.
            Provenance travels with the ask, or the user is judging half of it.
          </p>
        </>
      ),
      academic: (
        <>
          <p>
            Language models process command and data through one
            undifferentiated token stream, so channel identity, the fact that
            distinguishes the principal&rsquo;s instruction from an
            instruction merely encountered, is erased at ingestion. Prompt
            injection is that erasure weaponized. Since the discrimination
            problem is adversarial and unlikely to be solved in-model, origin
            must be tracked through the pipeline and restored at the
            interface: provenance is a term of the request, and a consent
            surface that omits it presents the user with an unevaluable ask.
          </p>
          <p>
            <P slug="injection-flag">Injection Flag</P> is this principle as a
            component: source named and pointed, payload quoted verbatim
            (paraphrase launders the judgeable specifics), compliance
            subordinated to dismissal. The same discipline generalizes: every
            approval surface here states which authority and whose intent a
            request rides on, because an ask with unknown provenance deserves
            the adversarial prior, not the benefit of the doubt.
          </p>
        </>
      ),
    },
  },
  {
    name: "Consent continues after approval",
    lede: {
      caveman: "The yes is a moment; the act lives on after it.",
      human: "Approval is a moment; the action has a life after it.",
      academic:
        "Ex-ante consent without ex-post observability is an open control loop.",
    },
    body: {
      caveman: (
        <>
          <p>
            The gate stands before the act. The yes doesn&rsquo;t end when the
            machine walks through it. And for anything done under a standing
            yes, there was no gate at all. If the act leaves no mark you can
            read, your consent rots into hope: you can&rsquo;t spot the
            mistake, question the odd call, or pull the thing back. The loop
            only closes with a record, and where possible, an undo-rope.
          </p>
          <p>
            <P slug="action-receipt">Action Receipt</P> is that closing mark:
            what the machine did, under whose yes, with an undo where the act
            allows. A <P slug="connection-card">Connection Card</P> keeps the
            standing yes itself visible long after it was given. The
            looking-back is not paperwork; it is the other half of the yes.
          </p>
        </>
      ),
      human: (
        <>
          <p>
            Every gate happens before the act, but consent doesn&rsquo;t end
            when the agent proceeds, and for anything done under a standing
            grant, there was no gate at all. If the action leaves no reviewable
            trace, consent quietly decays into trust-and-hope: the user
            can&rsquo;t notice a mistake, question a borderline call, or take
            it back. The loop only closes with a record and, where possible, an
            undo.
          </p>
          <p>
            <P slug="action-receipt">Action Receipt</P> is that closing
            surface: what the agent did, under what authority, with an undo
            where the action allows. A{" "}
            <P slug="connection-card">Connection Card</P> keeps the standing
            grant itself visible long after it was made. Auditability
            isn&rsquo;t a compliance nicety here; it is the other half of
            consent.
          </p>
        </>
      ),
      academic: (
        <>
          <p>
            Ex-ante mechanisms end at execution, and standing grants never had
            an ex-ante moment at all, so without an exercise record the
            consent system runs open-loop: policy set, actions taken under it,
            no signal returning to inform whether the policy produces the
            intended behavior. Every governance operation (detecting error,
            contesting a borderline call, reversing a wrongful act, tightening
            an over-broad grant) takes the record as its object and is
            undefined without one.
          </p>
          <p>
            <P slug="action-receipt">Action Receipt</P> closes the loop:
            effect, timestamp, and the authority under which the action ran
            (the differentiating field), with reversal offered exactly where
            it can be honored. The <P slug="connection-card">Connection Card</P>{" "}
            keeps the grant itself observable between exercises. Auditability
            is the feedback path of delegation, not its paperwork; a grant
            whose exercise is unobservable is ungovernable by construction.
          </p>
        </>
      ),
    },
  },
  {
    name: "Revocation must be real and immediate",
    lede: {
      caveman:
        "A gift you cannot take back was never a gift. It was a surrender.",
      human: "A grant you can’t effectively withdraw was never really consent.",
      academic:
        "Consent is only meaningful under a credible, low-cost exit.",
    },
    body: {
      caveman: (
        <>
          <p>
            A yes that can&rsquo;t be un-said is just a one-way door with a
            friendlier sign. Taking back must truly stop the power (halting
            what is already running, not just hiding a switch for next time),
            or you never really held the leash you were told you held. Being
            able to end a gift is what made giving it safe at all.
          </p>
          <p>
            <P slug="connection-card">Connection Card</P> keeps pause and
            take-back one reach from every standing connection, and an{" "}
            <P slug="authority-boundary">Authority Boundary</P> lets any
            ability be moved to &ldquo;Never&rdquo;. A fence that can only
            widen isn&rsquo;t a fence. The way out is what the whole system is
            built around.
          </p>
        </>
      ),
      human: (
        <>
          <p>
            Consent that can&rsquo;t be taken back is just a one-way door with
            a friendlier label. Revocation has to actually stop authority
            (halting what is in flight, not merely hiding a toggle for next
            time), or the user never truly held the power they were told they had.
            The ability to end a grant is what makes granting it safe in the
            first place.
          </p>
          <p>
            <P slug="connection-card">Connection Card</P> keeps pause and
            revoke one affordance away from a standing connection, and an{" "}
            <P slug="authority-boundary">Authority Boundary</P> lets any
            capability be moved to &ldquo;Never&rdquo;. A boundary that can
            only widen isn&rsquo;t a boundary. Revocation is the exit the rest
            of the system is built around.
          </p>
        </>
      ),
      academic: (
        <>
          <p>
            A grant without a credible exit is a transfer, not a delegation,
            and the credibility conditions are strict: revocation must bind
            enforcement (halting in-flight work, not hiding a toggle), take
            effect immediately, and cost little enough to be exercised under
            doubt rather than only under proof. Revocation-in-principle buried
            behind support tickets is not revocation; effective permanence is
            measured at the affordance, not the policy.
          </p>
          <p>
            <P slug="connection-card">Connection Card</P> keeps pause (the
            cheap, reversible stop that gets used where destruction hesitates)
            and revoke one reach from every standing connection, and the{" "}
            <P slug="authority-boundary">Authority Boundary</P>&rsquo;s
            &ldquo;Never&rdquo; makes prohibition expressible, not just
            degrees of yes. The exit is also what licenses everything else:
            users rationally grant more when withdrawal is credible, so
            revocation is the load-bearing column under the whole consent
            economy.
          </p>
        </>
      ),
    },
  },
  {
    name: "Authority should expire by default",
    lede: {
      caveman: "A standing yes is not the same as a forever yes.",
      human: "Standing is not the same as forever.",
      academic: "The default lifetime of a grant should be finite.",
    },
    body: {
      caveman: (
        <>
          <p>
            Yeses pile up. Each one made sense on its day, but left alone they
            heap into a mound of standing power no one remembers agreeing to.
            The cure is a built-in lifespan: gifts that lapse unless renewed,
            so sleeping power dies quietly on its own instead of waiting, live,
            for someone to trip over it.
          </p>
          <p>
            <P slug="consent-memory">Consent Memory</P> makes &ldquo;just this
            once&rdquo; and &ldquo;this sitting&rdquo; real rungs instead of
            burying everything under &ldquo;always,&rdquo; and{" "}
            <P slug="spend-rate-limits">Spend &amp; Rate Limits</P> ties
            standing power to a window that resets. The safe end of a gift is
            that it ends.
          </p>
        </>
      ),
      human: (
        <>
          <p>
            Permissions accrete. Each one was reasonable when granted, but left
            alone they pile up into a standing surface no one remembers
            agreeing to. The correction is a default lifetime: grants that
            lapse unless renewed, so dormant authority expires on its own
            instead of accumulating into risk the user has to notice and prune
            by hand.
          </p>
          <p>
            <P slug="consent-memory">Consent Memory</P> makes &ldquo;just this
            once&rdquo; and &ldquo;this session&rdquo; first-class choices
            rather than burying everything under &ldquo;always,&rdquo; and{" "}
            <P slug="spend-rate-limits">Spend &amp; Rate Limits</P> bounds
            standing authority to a window that resets. The safe default for a
            grant is that it ends.
          </p>
        </>
      ),
      academic: (
        <>
          <p>
            Grant inventories grow monotonically under indefinite defaults:
            authority is added at task frequency and removed only by deliberate
            audit, so dormant grants (pure latent risk, still-live attack
            surface with no earning exercise) accumulate as the steady state.
            Expiry inverts the maintenance burden: a lapsing grant makes
            continued authority the thing that must be affirmed, aligning the
            default with least privilege on the time axis and pricing renewal
            at its true (low) cost instead of pricing revocation at its true
            (high, attention-bound) one.
          </p>
          <p>
            <P slug="consent-memory">Consent Memory</P> makes bounded
            durabilities (once, this session) first-class rungs rather than
            fine print under &ldquo;always,&rdquo; and{" "}
            <P slug="spend-rate-limits">Spend &amp; Rate Limits</P> gives
            quantitative authority a window that resets rather than a total
            that accrues. Where indefinite grants are truly warranted, they
            should be the marked case (chosen, weighted, and re-surfaced),
            never the silent default.
          </p>
        </>
      ),
    },
  },
  {
    name: "Minimize what the agent can see",
    lede: {
      caveman: "The smallest key, and the smallest window too.",
      human: "Least privilege applies to data, not just actions.",
      academic:
        "Observation is authority: context minimization is scope minimization.",
    },
    body: {
      caveman: (
        <>
          <p>
            Everyone worries about what the machine can <em>do</em>; what it
            can <em>see</em> is power too. A machine handed a standing window
            into your whole letter-pile, your whole cave, carries the danger of
            all of it, on every job, and through every trick played on it.
            Smallest-key means handing over the least the job needs to see,
            and never the raw secret underneath.
          </p>
          <p>
            <P slug="scoped-grant">Scoped Grant</P> makes how-much-it-sees a
            visible, choosable thing instead of all-or-nothing, and{" "}
            <P slug="credential-handoff">Credential Handoff</P> keeps the
            machine out of the secret-passing entirely, taking back a small key
            instead of a password. What the machine never receives, it can
            never spill.
          </p>
        </>
      ),
      human: (
        <>
          <p>
            Most attention goes to what an agent can <em>do</em>, but what it
            can <em>see</em> is authority too. An agent handed a standing
            window into an entire inbox, drive, or account carries the risk of
            all of it, on every task and through every injection. Least
            privilege means handing over the least context a task needs, and
            never the raw secret behind it.
          </p>
          <p>
            <P slug="scoped-grant">Scoped Grant</P> makes the granularity of
            access legible and selectable instead of all-or-nothing, and{" "}
            <P slug="credential-handoff">Credential Handoff</P> keeps the agent
            out of the credential exchange entirely, taking back a scoped token
            rather than a password. The data an agent never receives is the
            data it can never leak.
          </p>
        </>
      ),
      academic: (
        <>
          <p>
            Capability gets the attention, but observation is authority of the
            same kind: for a language-model agent, everything seen enters a
            context that is logged, cached, and processed alongside
            adversarial input, so data exposure compounds with injection risk
            multiplicatively. The injected instruction can only exfiltrate
            what the context contains. Least privilege therefore has a data
            clause: minimum context the task requires, and never the root
            secret when a derived credential will do.
          </p>
          <p>
            <P slug="scoped-grant">Scoped Grant</P> makes observation scope a
            selectable, per-resource decision rather than an account-wide
            side effect, and <P slug="credential-handoff">Credential Handoff</P>{" "}
            excludes the agent from the credential path structurally,
            returning scoped, expiring instruments instead of passwords. The
            bound is absolute in one direction: data the agent never receives
            is data no compromise of the agent can leak.
          </p>
        </>
      ),
    },
  },
  {
    name: "The acting agent must be identifiable",
    lede: {
      caveman: "You said yes to one machine, not to whatever wears its face.",
      human: "A user consents to a specific agent, not to whatever later wears its name.",
      academic:
        "Consent binds to a specific acting identity; substitution voids the binding.",
    },
    body: {
      caveman: (
        <>
          <p>
            A yes is given to <em>this</em> machine: the one whose plan you
            saw, whose name was on the ask. Swap the brain inside it, hide a
            second helper behind it, or let a stranger borrow its face, and the
            yes you gave no longer covers what actually acts. Whoever moves must
            be the one you agreed to, and their name must ride on every ask and
            every mark left behind.
          </p>
          <p>
            <P slug="action-preview">Action Preview</P> and{" "}
            <P slug="action-receipt">Action Receipt</P> already carry part of
            this: both name the machine and the power it acts under. But the
            harder question, what makes tomorrow&rsquo;s brain still{" "}
            <em>the same</em> machine you trusted, has no pattern of its own
            here yet. It is named so the gap isn&rsquo;t quietly lost.
          </p>
        </>
      ),
      human: (
        <>
          <p>
            Consent is given to a particular agent: the one whose plan the user
            reviewed, whose name was on the request. Impersonation, silent model
            swaps, and unlabeled sub-agents all defeat that: the actor&rsquo;s
            identity is a term of the grant, not deployment metadata. Whoever
            acts must be who the user agreed to, and that identity has to travel
            with every request and every receipt.
          </p>
          <p>
            <P slug="action-preview">Action Preview</P> and{" "}
            <P slug="action-receipt">Action Receipt</P> already carry part of
            this: each names the acting agent and the authority it runs under.
            But the deeper problem, what makes tomorrow&rsquo;s model still
            &ldquo;the same agent&rdquo; the user trusted, has no dedicated
            pattern here yet. It is stated so the gap stays visible rather than
            papered over.
          </p>
        </>
      ),
      academic: (
        <>
          <p>
            Consent binds to a specific acting identity; impersonation, silent
            model substitution, and unlabeled sub-agent delegation each void
            that binding. Identity is a load-bearing term of the grant rather
            than deployment metadata, and it must be tracked through the
            pipeline and restored at every request and receipt; otherwise the
            principal has authorized an actor they cannot name.
          </p>
          <p>
            <P slug="action-preview">Action Preview</P> and{" "}
            <P slug="action-receipt">Action Receipt</P> partially serve this,
            carrying agent and authority attribution at approval and audit time.
            The unsolved core is identity continuity (what makes
            tomorrow&rsquo;s model &ldquo;the same agent&rdquo; as today&rsquo;s),
            which deserves a dedicated pattern this library does not yet have;
            it is declared here rather than deferred to a footnote.
          </p>
        </>
      ),
    },
  },
  {
    name: "The user can always interrupt",
    lede: {
      caveman: "A rope you can pull at any moment to stop the machine mid-run.",
      human: "A user must be able to stop an agent mid-run, not just between steps.",
      academic:
        "Interruptibility is a consent property: a stop that binds mid-run, not only at step boundaries.",
    },
    body: {
      caveman: (
        <>
          <p>
            A yes includes the right to look away, and still be safe when you
            look back. That only holds if you can grab the machine{" "}
            <em>while it runs</em>: pause it, call it back, take the wheel
            yourself, in the middle of the work, not only in the gaps between
            steps. A stop that lands only between steps is barely a stop for a
            machine that moves in one long rush.
          </p>
          <p>
            No pattern here holds this up yet. The stop-rope (how it looks, how
            fast it must bite) wants a shape of its own. It is named now so the
            gap isn&rsquo;t forgotten.
          </p>
        </>
      ),
      human: (
        <>
          <p>
            Consent includes the right to withdraw attention and remain safe,
            and that holds only if the user can stop the agent while it acts:
            pause, cancel, or take over mid-run, not merely at the boundaries
            between steps. For an agent that works in one long burst, a stop
            that only lands between steps is barely a stop; interruptibility,
            and the latency it promises, is part of the authority model, not a
            UI courtesy.
          </p>
          <p>
            This library has no pattern for it yet. The interrupt affordance,
            its visibility, and its response-time guarantees deserve dedicated
            treatment. It is named here so the gap stays on the record rather
            than disappearing.
          </p>
        </>
      ),
      academic: (
        <>
          <p>
            Interruptibility is a consent property: a legible stop (pause,
            cancel, take-over) that binds mid-run rather than only at step
            boundaries. Delegation includes the right to withdraw attention
            without forfeiting safety, which makes the interrupt affordance and
            its latency guarantees part of the authority model rather than
            interface polish. An agent that cannot be halted between commitments
            has, in effect, been granted more than any prompt disclosed.
          </p>
          <p>
            No pattern in this library upholds it yet. The stop affordance (its
            salience, its binding semantics, its worst-case response time)
            deserves a dedicated pattern; the principle is declared here,
            unpatterned, rather than omitted.
          </p>
        </>
      ),
    },
  },
];

export default function PrinciplesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="eyebrow">Why the patterns look the way they do</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Principles of agent consent
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink">
        The ideas every pattern in this library is built to protect, and why
        consent for an agent is a different problem than consent for an app.
      </p>
      <div className="mt-6 space-y-5 leading-relaxed text-ink-muted">
        <Lvl level="caveman" className="space-y-5">
          <p>
            Saying yes to a machine is a truly new problem. Old permission
            rules assume a person is holding the tool, deciding one act at a
            time. A machine that acts for you breaks that: it moves on its own,
            in bursts, across many places, sometimes on words it merely read,
            and it does all this under a yes you gave once and long forgot.
          </p>
          <p>
            These are the rules the whole pattern library stands on, not a
            style guide, but the <em>reasons</em> the patterns have the shapes
            they have. Every pattern here holds up one or more of them. The
            last two are rules we hold even though no finished pattern yet
            fully carries them.
          </p>
        </Lvl>
        <Lvl level="human" className="space-y-5">
          <p>
            Consent for software agents is a genuinely new problem. Traditional
            permission models assume a person is at the controls, deciding one
            action at a time. An agent breaks that assumption: it acts on its
            own, in bursts, across services, sometimes on instructions it read
            rather than ones the user gave, and it does so under authority the
            user delegated once and may have long forgotten.
          </p>
          <p>
            These are the principles the pattern library is built on. They are
            not a style guide; they are the reasons the patterns take the
            shapes they do. Every pattern exists to uphold one or more of them,
            and the final two are commitments the library holds even where a
            pattern hasn&rsquo;t yet fully caught up.
          </p>
        </Lvl>
        <Lvl level="academic" className="space-y-5">
          <p>
            Agent consent is a genuinely novel problem in permission design.
            The inherited models (OAuth scopes, per-action confirmations,
            settings toggles) all assume a human at the controls, deciding one
            action at a time, with the interface as rate limiter. Delegation to
            an autonomous system voids each assumption in turn: actions occur
            in unattended bursts, across service boundaries, sometimes on
            instructions read rather than given, under authority conferred once
            and long since forgotten. A principal–agent problem, a capability
            model, and an adversarial-input problem stacked on one consent
            screen.
          </p>
          <p>
            These twelve principles are the library&rsquo;s load-bearing
            commitments, not a style guide but the generative constraints from
            which the patterns&rsquo; shapes follow. Each pattern upholds one
            or more; the last two remain only partially patterned, declared in
            full rather than deferred to a footnote.
          </p>
        </Lvl>
      </div>

      <ol className="mt-12 space-y-12">
        {PRINCIPLES.map((principle, i) => (
          <li key={principle.name} className="flex gap-5">
            <span
              className="mt-1 font-mono text-sm text-ink-faint"
              aria-hidden
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                {principle.name}
              </h2>
              {LEVELS.map((level) => (
                <Lvl
                  key={level}
                  level={level}
                  as="p"
                  className="mt-1 font-medium text-ink"
                >
                  {principle.lede[level]}
                </Lvl>
              ))}
              {LEVELS.map((level) => (
                <Lvl
                  key={level}
                  level={level}
                  className="mt-3 space-y-4 text-sm leading-relaxed text-ink-muted"
                >
                  {principle.body[level]}
                </Lvl>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
