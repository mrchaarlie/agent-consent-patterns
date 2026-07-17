import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { TOPICS, getSource, getTopic } from "@/lib/research";

/**
 * Explicit content map (not a dynamic template-string import) so the
 * bundler statically knows every MDX module and the static export can
 * never silently miss one.
 */
const CONTENT: Record<string, () => Promise<{ default: ComponentType }>> = {
  "agent-identity": () => import("@/content/research/agent-identity.mdx"),
  "delegated-authority": () =>
    import("@/content/research/delegated-authority.mdx"),
  "least-privilege": () => import("@/content/research/least-privilege.mdx"),
  "just-in-time-access": () =>
    import("@/content/research/just-in-time-access.mdx"),
  "human-in-the-loop": () =>
    import("@/content/research/human-in-the-loop.mdx"),
  "runtime-authorization": () =>
    import("@/content/research/runtime-authorization.mdx"),
  auditability: () => import("@/content/research/auditability.mdx"),
  "discovery-and-governance": () =>
    import("@/content/research/discovery-and-governance.mdx"),
};

export const dynamicParams = false;

export function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return {};
  return {
    title: topic.name,
    description: topic.summary,
    alternates: { canonical: "./" },
  };
}

export default async function LearningTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic(slug);
  const load = CONTENT[slug];
  if (!topic || !load) notFound();
  const { default: Content } = await load();

  const related = topic.related
    .map((r) => getTopic(r))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
  const sources = topic.sourceIds
    .map((id) => getSource(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <header>
        <p className="eyebrow">Research · Updated {topic.updated}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {topic.name}
        </h1>
      </header>
      <Content />
      <section className="mt-14 border-t border-line pt-8">
        <h2 className="text-lg font-semibold tracking-tight">Sources</h2>
        <p className="mt-1 text-sm text-ink-muted">
          The lessons on this page are summarized from these publications.
        </p>
        <ul className="mt-4 space-y-3">
          {sources.map((s) => (
            <li key={s.id} className="text-sm leading-relaxed">
              <a
                href={s.url}
                className="font-medium underline underline-offset-4 hover:text-ink"
              >
                {s.title}
              </a>
              <span className="text-ink-muted">
                {" "}
                — {s.author ? `${s.author}, ` : ""}
                {s.org} ({s.date})
              </span>
            </li>
          ))}
        </ul>
      </section>
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold tracking-tight">
            Related topics
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/research/${t.slug}/`}
                  className="block h-full rounded-lg border border-line bg-surface-raised p-4 transition-colors hover:border-line-strong"
                >
                  <span className="font-semibold tracking-tight">
                    {t.name}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-muted">
                    {t.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <footer className="mt-16 border-t border-line pt-6 text-sm text-ink-muted">
        <Link
          href="/research/"
          className="underline underline-offset-4 hover:text-ink"
        >
          ← All research
        </Link>
      </footer>
    </article>
  );
}
