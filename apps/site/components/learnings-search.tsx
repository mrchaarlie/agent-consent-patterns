"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LearningSource, LearningTopic } from "@/lib/learnings";

/**
 * Client-side search over the learnings index. The haystack per topic is its
 * name, summary, tags, and the authors/orgs of its sources, so "Forrester" or
 * "JIT" find the right pages even when the visible card text doesn't match.
 * Every whitespace-separated term must match somewhere (AND semantics).
 */
export function LearningsSearch({
  topics,
  sources,
}: {
  topics: LearningTopic[];
  sources: LearningSource[];
}) {
  const [query, setQuery] = useState("");

  const haystacks = useMemo(() => {
    const byId = new Map(sources.map((s) => [s.id, s]));
    return topics.map((topic) => {
      const attribution = topic.sourceIds
        .map((id) => byId.get(id))
        .filter((s): s is LearningSource => Boolean(s))
        .map((s) => `${s.author ?? ""} ${s.org} ${s.title}`)
        .join(" ");
      return {
        topic,
        text: `${topic.name} ${topic.summary} ${topic.tags.join(" ")} ${attribution}`.toLowerCase(),
      };
    });
  }, [topics, sources]);

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results = haystacks.filter(({ text }) =>
    terms.every((term) => text.includes(term)),
  );

  return (
    <div className="mt-10">
      <label htmlFor="learnings-search" className="sr-only">
        Search topics
      </label>
      <input
        id="learnings-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search topics, concepts, or authors — e.g. “JIT”, “Forrester”, “consent”"
        autoComplete="off"
        className="w-full rounded-lg border border-line bg-surface-raised px-4 py-3 text-sm placeholder:text-ink-faint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      />
      <p className="mt-3 text-xs text-ink-faint" role="status">
        {terms.length > 0
          ? `${results.length} topic${results.length === 1 ? "" : "s"} match`
          : `${topics.length} topics`}
      </p>
      {results.length === 0 ? (
        <p className="mt-8 text-sm text-ink-muted">
          No topics match. Try a broader term like &ldquo;identity&rdquo; or
          &ldquo;access&rdquo;.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {results.map(({ topic }) => (
            <li key={topic.slug}>
              <Link
                href={`/learnings/${topic.slug}/`}
                className="block h-full rounded-lg border border-line bg-surface-raised p-5 transition-colors hover:border-line-strong"
              >
                <h3 className="font-semibold tracking-tight">{topic.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {topic.summary}
                </p>
                <p className="mt-3 font-mono text-xs text-ink-faint">
                  Updated {topic.updated}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
