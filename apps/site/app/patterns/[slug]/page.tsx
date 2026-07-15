import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { PATTERNS, getPattern } from "@/lib/patterns";

/**
 * Explicit content map (not a dynamic template-string import) so the
 * bundler statically knows every MDX module and the static export can
 * never silently miss one.
 */
const CONTENT: Record<string, () => Promise<{ default: ComponentType }>> = {
  "scoped-grant": () => import("@/content/patterns/scoped-grant.mdx"),
  "progressive-scope": () =>
    import("@/content/patterns/progressive-scope.mdx"),
  "connection-card": () => import("@/content/patterns/connection-card.mdx"),
  "action-preview": () => import("@/content/patterns/action-preview.mdx"),
  "irreversibility-gate": () =>
    import("@/content/patterns/irreversibility-gate.mdx"),
  "batch-approval": () => import("@/content/patterns/batch-approval.mdx"),
  "consent-memory": () => import("@/content/patterns/consent-memory.mdx"),
  "authority-boundary": () =>
    import("@/content/patterns/authority-boundary.mdx"),
  "spend-rate-limits": () =>
    import("@/content/patterns/spend-rate-limits.mdx"),
  "injection-flag": () => import("@/content/patterns/injection-flag.mdx"),
  "action-receipt": () => import("@/content/patterns/action-receipt.mdx"),
  "credential-handoff": () =>
    import("@/content/patterns/credential-handoff.mdx"),
};

export const dynamicParams = false;

export function generateStaticParams() {
  return PATTERNS.filter((p) => p.status === "live").map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pattern = getPattern(slug);
  if (!pattern) return {};
  return {
    title: pattern.name,
    description: pattern.problem,
    // Agent-readable Markdown mirror of this page (generated into out/).
    alternates: {
      canonical: "./",
      types: {
        "text/markdown": [
          { url: `/patterns/${pattern.slug}.md`, title: `${pattern.name} (Markdown)` },
        ],
      },
    },
  };
}

export default async function PatternPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pattern = getPattern(slug);
  const load = CONTENT[slug];
  if (!pattern || !load) notFound();
  const { default: Content } = await load();

  const live = PATTERNS.filter((p) => p.status === "live");
  const index = live.findIndex((p) => p.slug === slug);
  const prev = index > 0 ? live[index - 1] : undefined;
  const next = index < live.length - 1 ? live[index + 1] : undefined;

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <header>
        <p className="eyebrow">
          Pattern {String(pattern.number).padStart(2, "0")} ·{" "}
          {pattern.category}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {pattern.name}
        </h1>
      </header>
      <Content />
      <footer className="mt-16 border-t border-line pt-6 text-sm text-ink-muted">
        <Link
          href="/patterns/"
          className="underline underline-offset-4 hover:text-ink"
        >
          ← All patterns
        </Link>
        <div className="mt-6 flex items-start justify-between gap-6">
          <div className="text-left">
            {prev && (
              <Link
                href={`/patterns/${prev.slug}/`}
                className="group flex flex-col gap-1"
              >
                <span className="text-xs text-ink-faint">← Previous</span>
                <span className="underline underline-offset-4 group-hover:text-ink">
                  {prev.name}
                </span>
              </Link>
            )}
          </div>
          <div className="text-right">
            {next && (
              <Link
                href={`/patterns/${next.slug}/`}
                className="group flex flex-col items-end gap-1"
              >
                <span className="text-xs text-ink-faint">Next →</span>
                <span className="underline underline-offset-4 group-hover:text-ink">
                  {next.name}
                </span>
              </Link>
            )}
          </div>
        </div>
      </footer>
    </article>
  );
}
