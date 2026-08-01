import type { Metadata } from "next";
import { Lvl } from "@/components/lvl";
import { PatternGrid } from "@/components/pattern-card";
import { CATEGORIES, PATTERNS } from "@/lib/patterns";

export const metadata: Metadata = {
  title: "Patterns",
  description:
    "Common problems in agent consent — granting access, approving actions, standing authority, trust & transparency — each with a solution and the code to build it.",
};

export default function PatternsIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="eyebrow">Index</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Patterns</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
        <Lvl level="caveman" as="span">
          Troubles that keep coming back, each with a fix that works.
        </Lvl>
        <Lvl level="human" as="span">
          Common problems in agent consent, each with a solution and the code
          to build it.
        </Lvl>
        <Lvl level="academic" as="span">
          Recurring problems in agent consent design, each with its resolution
          and a reference implementation.
        </Lvl>
      </p>
      {CATEGORIES.map((category) => (
        <section key={category} className="mt-12">
          <h2 className="mb-5 text-lg font-semibold tracking-tight">
            {category}
          </h2>
          <PatternGrid
            patterns={PATTERNS.filter((p) => p.category === category)}
          />
        </section>
      ))}
    </div>
  );
}
