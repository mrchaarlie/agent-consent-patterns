import type { Metadata } from "next";
import LibraryContent from "@/content/library.mdx";

export const metadata: Metadata = {
  title: "React Library",
  description:
    "Install and use @agentconsent/react: accessible, headless React primitives for agent consent UX.",
};

export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="eyebrow">Build</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">React library</h1>
      <LibraryContent />
    </div>
  );
}
