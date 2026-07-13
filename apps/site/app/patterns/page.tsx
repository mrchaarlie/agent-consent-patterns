import type { Metadata } from "next";
import { Lvl } from "@/components/lvl";
import { PatternGrid } from "@/components/pattern-card";
import { CATEGORIES, PATTERNS } from "@/lib/patterns";

export const metadata: Metadata = {
  title: "Patterns",
  description:
    "The full taxonomy of agent consent UX patterns: granting access, approving actions, standing authority, and trust & transparency.",
};

export default function PatternsIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="eyebrow">Index</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Patterns</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
        <Lvl level="caveman" as="span">
          Twelve ways, four piles. Each names a trouble that keeps coming
          back, and shows the fix: the parts, when to use it, screen reader
          talk, wrong turns, code.
        </Lvl>
        <Lvl level="human" as="span">
          Twelve patterns across four categories. Each pattern names a
          recurring problem in agent consent design and documents a solution:
          anatomy, when to use it, accessibility behavior, anti-patterns, and
          code.
        </Lvl>
        <Lvl level="academic" as="span">
          Twelve patterns across four categories: granting access, approving
          actions, standing authority, trust &amp; transparency. Each names a
          recurring problem in agent consent design and documents its
          resolution: anatomy, applicability conditions, accessibility
          semantics, anti-patterns, and a reference implementation.
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
