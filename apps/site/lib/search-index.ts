import { TERMS } from "@/lib/glossary";
import { PATTERNS } from "@/lib/patterns";
import { SOURCES, TOPICS } from "@/lib/research";

export type SearchDocKind = "pattern" | "research" | "term" | "page";

export interface SearchDoc {
  kind: SearchDocKind;
  /** Shown in the result option. */
  title: string;
  /** One line, shown muted and used for matching. */
  description: string;
  /** Navigation target. */
  href: string;
  /** Extra match-only text, never displayed. */
  keywords: string[];
}

/** Kind labels shown as badges in the results list. */
export const KIND_LABEL: Record<SearchDocKind, string> = {
  pattern: "Pattern",
  research: "Research",
  term: "Term",
  page: "Page",
};

const PAGES: SearchDoc[] = [
  {
    kind: "page",
    title: "Patterns",
    description:
      "The full taxonomy of agent consent UX patterns: granting access, approving actions, standing authority, and trust & transparency.",
    href: "/patterns/",
    keywords: ["index", "taxonomy", "ux"],
  },
  {
    kind: "page",
    title: "Research",
    description:
      "Summarized, attributed lessons on agent permissions from industry thinkers, organized by topic.",
    href: "/research/",
    keywords: ["knowledge base", "learnings", "industry", "sources"],
  },
  {
    kind: "page",
    title: "Glossary",
    description:
      "Shared vocabulary for agent consent UX: scope, standing consent, human-in-the-loop, delegated authority, and more.",
    href: "/research/#glossary",
    keywords: ["vocabulary", "terms", "definitions"],
  },
  {
    kind: "page",
    title: "Principles",
    description:
      "The twelve ideas every pattern in this library is built to protect: legibility, proportional friction, safe refusal, and more.",
    href: "/principles/",
    keywords: ["essay", "philosophy", "provenance", "revocation"],
  },
  {
    kind: "page",
    title: "React library",
    description:
      "Install and use @agentconsent/react: accessible, headless React primitives for agent consent UX.",
    href: "/library/",
    keywords: ["npm", "@agentconsent/react", "components", "install"],
  },
  {
    kind: "page",
    title: "Agent skill",
    description:
      "Install the Agent Consent Patterns skill for Claude, ChatGPT (Codex), Gemini CLI, and other compatible coding agents.",
    href: "/skill/",
    keywords: ["claude code", "install", "plugin", "skill.md"],
  },
  {
    kind: "page",
    title: "About",
    description:
      "Why Agent Consent Patterns exists, who writes it, and how to contribute.",
    href: "/about/",
    keywords: ["contact", "contribute", "colophon"],
  },
];

/**
 * The static site-wide search index: every live pattern, research topic,
 * glossary term, and top-level page. Built once at module scope from the same
 * data modules the pages render from, so it can never drift from the site.
 */
export const SEARCH_INDEX: SearchDoc[] = [
  // Planned patterns have no page yet — indexing them would mint 404s.
  ...PATTERNS.filter((p) => p.status === "live").map(
    (p): SearchDoc => ({
      kind: "pattern",
      title: p.name,
      description: p.problem,
      href: `/patterns/${p.slug}/`,
      keywords: [p.category, "pattern"],
    }),
  ),
  ...TOPICS.map((t): SearchDoc => {
    const attribution = t.sourceIds
      .map((id) => SOURCES.find((s) => s.id === id))
      .filter((s): s is NonNullable<typeof s> => Boolean(s))
      .map((s) => `${s.author ?? ""} ${s.org}`);
    return {
      kind: "research",
      title: t.name,
      description: t.summary,
      href: `/research/${t.slug}/`,
      keywords: [...t.tags, ...attribution],
    };
  }),
  ...TERMS.map(
    (t): SearchDoc => ({
      kind: "term",
      title: t.term,
      description: t.human,
      href: `/research/#term-${t.slug}`,
      keywords: ["glossary", "term"],
    }),
  ),
  ...PAGES,
];

/**
 * Filter-style matching, mirroring the research index: the haystack is
 * title + description + keywords, lowercased; every whitespace-separated
 * query word must be a substring (AND). Title matches rank before
 * description/keyword-only matches; ties keep index order. Empty query
 * matches nothing (the search is a closed list, not a browser).
 */
export function searchDocs(
  index: SearchDoc[],
  query: string,
  limit = 8,
): SearchDoc[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const titleHits: SearchDoc[] = [];
  const otherHits: SearchDoc[] = [];
  for (const doc of index) {
    const title = doc.title.toLowerCase();
    const haystack =
      `${title} ${doc.description} ${doc.keywords.join(" ")}`.toLowerCase();
    if (!words.every((w) => haystack.includes(w))) continue;
    (words.some((w) => title.includes(w)) ? titleHits : otherHits).push(doc);
  }
  return [...titleHits, ...otherHits].slice(0, limit);
}
