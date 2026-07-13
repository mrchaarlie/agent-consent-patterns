import Link from "next/link";
import { Lvl } from "@/components/lvl";
import type { PatternMeta } from "@/lib/patterns";

export function PatternCard({ pattern }: { pattern: PatternMeta }) {
  const body = (
    <>
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-xs text-ink-faint">
          {String(pattern.number).padStart(2, "0")}
        </span>
        <span className="eyebrow">
          {pattern.status === "live" ? "live" : "planned"}
        </span>
      </div>
      <h3 className="mt-2 font-semibold tracking-tight">{pattern.name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
        <Lvl level="caveman" as="span">
          {pattern.problemCaveman}
        </Lvl>
        <Lvl level="human" as="span">
          {pattern.problem}
        </Lvl>
        <Lvl level="academic" as="span">
          {pattern.problemAcademic}
        </Lvl>
      </p>
    </>
  );

  if (pattern.status === "planned") {
    return (
      <div className="rounded-lg border border-dashed border-line p-5">
        {body}
      </div>
    );
  }

  return (
    <Link
      href={`/patterns/${pattern.slug}/`}
      className="block rounded-lg border border-line bg-surface-raised p-5 transition-colors hover:border-line-strong"
    >
      {body}
    </Link>
  );
}

export function PatternGrid({ patterns }: { patterns: PatternMeta[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {patterns.map((p) => (
        <li key={p.slug}>
          <PatternCard pattern={p} />
        </li>
      ))}
    </ul>
  );
}
