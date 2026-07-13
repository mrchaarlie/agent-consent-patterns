import Link from "next/link";
import { Lvl } from "@/components/lvl";
import { CATEGORIES, CATEGORY_BLURB, PATTERNS } from "@/lib/patterns";

const REPO = "https://github.com/mrchaarlie/agent-consent-patterns";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="border-b border-line py-16 sm:py-24">
        <p className="eyebrow">A pattern reference · v0.1</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Consent patterns for AI&nbsp;agents
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
          <Lvl level="caveman" as="span">
            Machines act for you now: they open accounts, send messages,
            spend money. Every team building one is carving its own
            asking-screens from nothing. This is the shared book: named ways
            to hand over keys, say yes to a move, set standing rules, and
            read the trail left behind.
          </Lvl>
          <Lvl level="human" as="span">
            Agents act on your behalf: they connect to your accounts, send
            your messages, spend your money. The consent UX for that
            delegation is being improvised from scratch by every team that
            ships an agent. This is the reference: a taxonomy of named
            patterns for permissions, approval, standing authority, and
            auditability, each with rationale and a production-quality React
            implementation.
          </Lvl>
          <Lvl level="academic" as="span">
            Agents exercise delegated authority: they connect to accounts,
            send messages, and spend money on a principal&rsquo;s behalf. The
            consent UX for that delegation is being independently re-derived
            by every team shipping one. This is the reference: a pattern
            language for permissions, approval, standing authority, and
            auditability, each pattern with its rationale, its anti-patterns,
            and a production-quality headless React implementation.
          </Lvl>
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/patterns/"
            className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-surface transition-opacity hover:opacity-85"
          >
            Browse the patterns
          </Link>
          <Link
            href="/principles/"
            className="text-sm text-ink-muted underline underline-offset-4 hover:text-ink"
          >
            Read the principles
          </Link>
        </div>
      </section>

      <section className="border-b border-line py-14">
        <p className="eyebrow">What&rsquo;s here</p>
        <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight">
          Three things, one problem
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
          <Lvl level="caveman" as="span">
            A book of the patterns, real working parts for each one, and a
            teaching for the machines that write your code.
          </Lvl>
          <Lvl level="human" as="span">
            A documented taxonomy, a working implementation of every pattern,
            and a skill that teaches coding agents to apply them.
          </Lvl>
          <Lvl level="academic" as="span">
            A documented pattern language, a reference implementation of each
            pattern, and a distilled skill that carries the same guidance to
            coding agents.
          </Lvl>
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          <li className="rounded-lg border border-line bg-surface-raised p-5">
            <span className="eyebrow">01 · Read</span>
            <h3 className="mt-2 font-semibold tracking-tight">
              The pattern taxonomy
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              <Lvl level="caveman" as="span">
                Twelve patterns, four piles. Each names a recurring trouble
                and shows the fix: parts, when to use it, screen reader talk,
                wrong turns, code.
              </Lvl>
              <Lvl level="human" as="span">
                Twelve patterns across four categories. Each documents a
                recurring consent problem: anatomy, when (not) to use it,
                real-world examples, accessibility, anti-patterns, and code.
              </Lvl>
              <Lvl level="academic" as="span">
                Twelve patterns across four categories, each documenting a
                recurring problem and its resolution: anatomy, applicability,
                accessibility semantics, anti-patterns, and a reference
                implementation.
              </Lvl>
            </p>
            <Link
              href="/patterns/"
              className="mt-3 inline-block text-sm text-ink underline underline-offset-4 hover:text-ink-muted"
            >
              Browse the patterns →
            </Link>
          </li>

          <li className="rounded-lg border border-line bg-surface-raised p-5">
            <span className="eyebrow">02 · Build</span>
            <h3 className="mt-2 font-semibold tracking-tight">
              A React library
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              <Lvl level="caveman" as="span">
                Every pattern gets a working piece in{" "}
                <span className="font-mono text-ink">@agentconsent/react</span>
                : plain bones, a swappable skin, screen reader friendly, free
                to take.
              </Lvl>
              <Lvl level="human" as="span">
                A working implementation of every pattern in{" "}
                <span className="font-mono text-ink">@agentconsent/react</span>
                : headless primitives plus a themeable default. WCAG 2.2 AA,
                axe-clean, MIT.
              </Lvl>
              <Lvl level="academic" as="span">
                A reference implementation of every pattern in{" "}
                <span className="font-mono text-ink">@agentconsent/react</span>
                : headless primitives with a themeable default skin, WCAG 2.2
                AA, MIT. The premise: a pattern without a runnable artifact is
                an opinion.
              </Lvl>
            </p>
            <a
              href={REPO}
              className="mt-3 inline-block text-sm text-ink underline underline-offset-4 hover:text-ink-muted"
            >
              View the source →
            </a>
          </li>

          <li className="rounded-lg border border-line bg-surface-raised p-5">
            <span className="eyebrow">03 · Delegate</span>
            <h3 className="mt-2 font-semibold tracking-tight">
              A skill for coding agents
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              <Lvl level="caveman" as="span">
                Hand this teaching to your code-writing machine, and it builds
                asking-screens right the first time.
              </Lvl>
              <Lvl level="human" as="span">
                Install the best-practices skill into Claude Code and your
                agent applies these patterns when it builds consent flows.
              </Lvl>
              <Lvl level="academic" as="span">
                A distilled best-practices skill for coding agents: installed
                into Claude Code, it applies this guidance when generating
                consent flows.
              </Lvl>
            </p>
            <a
              href={`${REPO}#a-distilled-best-practices-skill-for-coding-agents`}
              className="mt-3 inline-block text-sm text-ink underline underline-offset-4 hover:text-ink-muted"
            >
              Install the skill →
            </a>
          </li>
        </ul>
      </section>

      <section className="border-b border-line py-14">
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            The taxonomy at a glance
          </h2>
          <Link
            href="/patterns/"
            className="text-sm text-ink-muted underline underline-offset-4 hover:text-ink"
          >
            All 12 patterns →
          </Link>
        </div>
        <p className="max-w-2xl leading-relaxed text-ink-muted">
          <Lvl level="caveman" as="span">
            Four piles, from first handing over a key to reading the mark left
            behind.
          </Lvl>
          <Lvl level="human" as="span">
            Four categories, tracing the arc from first granting access to
            reviewing what the agent did.
          </Lvl>
          <Lvl level="academic" as="span">
            Four categories tracing the delegation lifecycle: conferral,
            per-action authorization, standing policy, and accountability.
          </Lvl>
        </p>

        <ul className="mt-8 divide-y divide-line border-y border-line">
          {CATEGORIES.map((category, i) => {
            const count = PATTERNS.filter(
              (p) => p.category === category,
            ).length;
            return (
              <li
                key={category}
                className="grid gap-1 py-5 sm:grid-cols-[auto_1fr] sm:gap-6"
              >
                <div className="flex items-baseline gap-3">
                  <span
                    className="font-mono text-xs text-ink-faint"
                    aria-hidden
                  >
                    §{i + 1}
                  </span>
                  <h3 className="w-48 font-semibold tracking-tight">
                    {category}
                    <span className="ml-2 font-mono text-xs font-normal text-ink-faint">
                      {count}
                    </span>
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-ink-muted">
                  <Lvl level="caveman" as="span">
                    {CATEGORY_BLURB[category].caveman}
                  </Lvl>
                  <Lvl level="human" as="span">
                    {CATEGORY_BLURB[category].human}
                  </Lvl>
                  <Lvl level="academic" as="span">
                    {CATEGORY_BLURB[category].academic}
                  </Lvl>
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 py-12">
        <p className="text-sm text-ink-muted">
          New here? Start with{" "}
          <Link
            href="/patterns/action-preview/"
            className="text-ink underline underline-offset-4 hover:text-ink-muted"
          >
            Action Preview
          </Link>
          , the pattern the rest build on.
        </p>
        <p className="text-sm text-ink-faint">
          Reading as an agent?{" "}
          <a
            href="/llms.txt"
            className="underline underline-offset-4 hover:text-ink"
          >
            llms.txt
          </a>
        </p>
      </section>
    </div>
  );
}
