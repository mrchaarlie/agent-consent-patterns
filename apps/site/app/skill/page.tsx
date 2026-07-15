import type { Metadata } from "next";
import SkillContent from "@/content/skill.mdx";

export const metadata: Metadata = {
  title: "Agent Skill",
  description:
    "Install the Agent Consent Patterns skill for Claude Code, Codex, or another compatible coding agent.",
};

export default function SkillPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="eyebrow">Build</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Agent skill</h1>
      <SkillContent />
    </div>
  );
}
