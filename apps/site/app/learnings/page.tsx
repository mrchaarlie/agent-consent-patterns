import type { Metadata } from "next";
import { LearningsSearch } from "@/components/learnings-search";
import { SOURCES, TOPICS } from "@/lib/learnings";

export const metadata: Metadata = {
  title: "Learnings",
  description:
    "Summarized lessons on agent permissions from industry thinkers — Eve Maler, Forrester's AEGIS, Okta, Oso, Permit.io, BigID, theCUBE Research, and Anthropic — organized by topic.",
};

export default function LearningsIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="eyebrow">Knowledge base</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Learnings</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
        Summarized lessons and best practices on agent permissions, drawn from
        industry thinkers and frameworks — Eve Maler, Gabriel L. Manor
        (Permit.io), Krista Case (theCUBE Research), Neil Patel (BigID),
        Forrester&rsquo;s AEGIS, Okta &amp; Auth0, Oso Security, and
        Anthropic. Organized by topic, cross-linked, and always attributed to
        the original writing. Updated every few days as new sources land.
      </p>
      <LearningsSearch topics={TOPICS} sources={SOURCES} />
    </div>
  );
}
