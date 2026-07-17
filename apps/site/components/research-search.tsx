"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { GlossaryTerm } from "@/lib/glossary";
import { Lvl } from "@/components/lvl";
import type { ResearchSource, ResearchTopic } from "@/lib/research";

/**
 * Client-side filter over the research index: one input narrows both the
 * topic cards and the glossary terms below them. The haystack per topic is
 * its name, summary, tags, and the authors/orgs of its sources, so
 * "Forrester" or "JIT" find the right pages even when the visible card text
 * doesn't match; a term's haystack is its name plus all three reading-level
 * definitions. Every whitespace-separated query word must match (AND
 * semantics).
 */
export function ResearchSearch({
  topics,
  sources,
  terms,
}: {
  topics: ResearchTopic[];
  sources: ResearchSource[];
  terms: GlossaryTerm[];
}) {
  const [query, setQuery] = useState("");

  const topicHaystacks = useMemo(() => {
    const byId = new Map(sources.map((s) => [s.id, s]));
    return topics.map((topic) => {
      const attribution = topic.sourceIds
        .map((id) => byId.get(id))
        .filter((s): s is ResearchSource => Boolean(s))
        .map((s) => `${s.author ?? ""} ${s.org} ${s.title}`)
        .join(" ");
      return {
        topic,
        text: `${topic.name} ${topic.summary} ${topic.tags.join(" ")} ${attribution}`.toLowerCase(),
      };
    });
  }, [topics, sources]);

  const termHaystacks = useMemo(
    () =>
      terms.map((term) => ({
        term,
        text: `${term.term} ${term.caveman} ${term.human} ${term.academic}`.toLowerCase(),
      })),
    [terms],
  );

  const queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = (text: string) => queryTerms.every((t) => text.includes(t));
  const topicResults = topicHaystacks.filter(({ text }) => matches(text));
  const termResults = termHaystacks.filter(({ text }) => matches(text));

  return (
    <div className="mt-10">
      <label htmlFor="research-search" className="sr-only">
        Filter topics and terms
      </label>
      <input
        id="research-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter topics and terms — e.g. “JIT”, “Forrester”, “consent”"
        autoComplete="off"
        className="w-full rounded-lg border border-line bg-surface-raised px-4 py-3 text-sm placeholder:text-ink-faint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      />
      <p className="mt-3 text-xs text-ink-faint" role="status">
        {queryTerms.length > 0
          ? `${topicResults.length} topic${topicResults.length === 1 ? "" : "s"} · ${termResults.length} term${termResults.length === 1 ? "" : "s"} match`
          : `${topics.length} topics · ${terms.length} terms`}
      </p>
      <h2 className="mt-8 text-lg font-semibold tracking-tight">Topics</h2>
      {topicResults.length === 0 ? (
        <p className="mt-6 text-sm text-ink-muted">No topics match.</p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {topicResults.map(({ topic }) => (
            <li key={topic.slug}>
              <Link
                href={`/research/${topic.slug}/`}
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
      <section id="glossary" className="mt-14 scroll-mt-24">
        <h2 className="text-lg font-semibold tracking-tight">Glossary</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Shared terms used across the patterns and research. Naming things
          consistently is half the point of a pattern library.
        </p>
        {termResults.length === 0 ? (
          <p className="mt-6 text-sm text-ink-muted">No terms match.</p>
        ) : (
          <dl className="mt-4">
            {termResults.map(({ term }) => (
              <div
                key={term.slug}
                id={`term-${term.slug}`}
                className="grid scroll-mt-24 gap-2 border-b border-line py-5 sm:grid-cols-[12rem_1fr] sm:gap-6"
              >
                <dt className="font-semibold tracking-tight">{term.term}</dt>
                <dd className="text-sm leading-relaxed text-ink-muted">
                  <Lvl level="caveman" as="span">
                    {term.caveman}
                  </Lvl>
                  <Lvl level="human" as="span">
                    {term.human}
                  </Lvl>
                  <Lvl level="academic" as="span">
                    {term.academic}
                  </Lvl>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </section>
    </div>
  );
}
