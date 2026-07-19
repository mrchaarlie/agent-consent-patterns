import type { Metadata } from "next";
import { ResearchSearch } from "@/components/research-search";
import { TERMS } from "@/lib/glossary";
import { SOURCES, TOPICS } from "@/lib/research";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Summarized lessons on agent permissions, shadow AI, and enterprise AI governance from industry thinkers, breach reports, and standards bodies — Eve Maler, Forrester's AEGIS, Okta, Oso, Permit.io, BigID, Verizon, IBM, OWASP, NIST, and more — organized by topic, plus the shared glossary.",
};

export default function ResearchIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="eyebrow">Knowledge base</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Research</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-ink-muted">
        Summarized lessons and best practices on agent permissions and
        enterprise AI governance, drawn from industry thinkers, breach
        reports, and standards bodies — Eve Maler, Gabriel L. Manor
        (Permit.io), Krista Case (theCUBE Research), Neil Patel (BigID),
        Forrester&rsquo;s AEGIS, Okta &amp; Auth0, Oso Security, Anthropic,
        Verizon, IBM, OWASP, and NIST, among others. Organized by topic,
        cross-linked, and always attributed to the original writing, with the
        shared{" "}
        <a
          href="#glossary"
          className="underline underline-offset-4 hover:text-ink"
        >
          glossary
        </a>{" "}
        below. Updated every few days as new sources land.
      </p>
      <ResearchSearch topics={TOPICS} sources={SOURCES} terms={TERMS} />
    </div>
  );
}
