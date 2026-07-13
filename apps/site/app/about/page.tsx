import type { Metadata } from "next";
import { Lvl } from "@/components/lvl";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Agent Consent Patterns exists, who writes it, and how to contribute.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="eyebrow">Colophon</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">About</h1>
      <div className="mt-6 space-y-5 leading-relaxed text-ink-muted">
        <Lvl level="caveman" className="space-y-5">
          <p>
            This site collects good ways to ask a human before a machine acts
            for them. No shared book of these existed, so every tribe
            building one, browser bots, tool-using helpers, was carving its
            own asking-screens from nothing.
          </p>
          <p>
            Every pattern comes with a working piece in{" "}
            <span className="font-mono text-ink">@agentconsent/react</span>:
            plain bones, a swappable skin, screen reader friendly, free to
            take (MIT).
          </p>
          <p>
            Written and kept by Charles Wu. Fixes, arguments, and sightings of
            these patterns in real products are welcome through GitHub issues.
          </p>
          <p>
            Pictures of real products on pattern pages are shown to study and
            judge them, with the product's name given. If one is yours and you
            want it gone, open an issue and it goes.
          </p>
        </Lvl>
        <Lvl level="human" className="space-y-5">
          <p>
            Agent Consent Patterns documents UX patterns for AI agent
            permissions, consent, and human-in-the-loop control. It exists
            because no canonical reference for this problem space exists yet:
            every team building an agentic product (MCP clients, browser
            agents, assistants with tool use) is improvising these flows from
            scratch.
          </p>
          <p>
            Each pattern ships with a working, accessible React implementation
            in{" "}
            <span className="font-mono text-ink">@agentconsent/react</span>:
            headless primitives plus a themeable default, WCAG 2.2 AA, MIT
            licensed.
          </p>
          <p>
            Written and maintained by Charles Wu. Contributions, corrections,
            and examples of these patterns in shipped products are welcome via
            GitHub issues.
          </p>
          <p>
            Real-world screenshots on pattern pages are reproduced as
            commentary and critique, with credit to the product. If you own
            one and want it removed, open an issue and it will be.
          </p>
        </Lvl>
        <Lvl level="academic" className="space-y-5">
          <p>
            Agent Consent Patterns is a pattern language for delegated
            authority in agentic systems: permissions, consent, and
            human-in-the-loop control, documented at the level of named,
            composable interface patterns. It exists because the problem space
            has no canonical reference: every team shipping an agentic
            product (MCP clients, browser agents, tool-using assistants) is
            re-deriving these flows independently, and pattern languages are
            how a field stops doing that.
          </p>
          <p>
            Each pattern is accompanied by a reference implementation in{" "}
            <span className="font-mono text-ink">@agentconsent/react</span>:
            headless primitives with a themeable default skin, WCAG 2.2 AA
            conformant, MIT licensed. The premise: a pattern without a
            runnable artifact is an opinion.
          </p>
          <p>
            Written and maintained by Charles Wu. Contributions, corrections,
            and documented sightings of these patterns (or their
            anti-patterns) in shipped products are welcome via GitHub issues.
          </p>
          <p>
            Real-world screenshots on pattern pages are reproduced as
            commentary and critique with product attribution, in the fair-use
            tradition of design criticism. Owners who want one removed can
            open an issue; removal is unconditional.
          </p>
        </Lvl>
      </div>
    </div>
  );
}
