/**
 * The Learnings knowledge base: summarized lessons from industry thinkers on
 * agent permissions, organized by topic (not by author). Every topic page
 * cites entries from the SOURCES registry so attribution is never optional.
 *
 * Updating: add new sources to SOURCES, reference their ids from the topic's
 * `sourceIds`, and extend the topic MDX in content/learnings/. Bump `updated`
 * on the topic you touched.
 */

export interface LearningSource {
  id: string;
  /** Person credited, when the piece has a named author. */
  author?: string;
  /** Publishing organization. */
  org: string;
  title: string;
  url: string;
  /** Publication (or last-updated) date, ISO yyyy-mm-dd. */
  date: string;
}

export interface LearningTopic {
  slug: string;
  name: string;
  /** One-sentence definition shown on index cards and page metadata. */
  summary: string;
  /** Search keywords beyond the name/summary text. */
  tags: string[];
  /** Slugs of related topics, rendered as cross-links on the page. */
  related: string[];
  /** SOURCES ids cited by this topic; rendered as the attribution footer. */
  sourceIds: string[];
  /** Last content revision, ISO yyyy-mm-dd. */
  updated: string;
}

export const SOURCES: LearningSource[] = [
  {
    id: "bigid-aam",
    author: "Neil Patel",
    org: "BigID",
    title: "Agent Access Management (AAM): Securing AI Agents & Non-Human Identities",
    url: "https://bigid.com/blog/agent-access-management-aam/",
    date: "2026-01-06",
  },
  {
    id: "claude-agent-identity",
    author: "Noah Zweben",
    org: "Claude (Anthropic)",
    title: "Agent identity: giving Claude its own access model",
    url: "https://claude.com/blog/agent-identity-access-model",
    date: "2026-06-24",
  },
  {
    id: "forrester-aegis",
    author: "Jeff Pollard",
    org: "Forrester",
    title: "Introducing AEGIS: The Guardrails CISOs Need for the Agentic Enterprise",
    url: "https://www.forrester.com/blogs/introducing-aegis-the-guardrails-cisos-need-for-the-agentic-enterprise/",
    date: "2025-08-04",
  },
  {
    id: "cube-identity-governance",
    author: "Krista Case",
    org: "theCUBE Research",
    title: "AI Agents Are Exposing the Limits of Traditional Identity Governance",
    url: "https://thecuberesearch.com/ai-agents-are-exposing-the-limits-of-traditional-identity-governance/",
    date: "2026-05-13",
  },
  {
    id: "okta-xaa",
    org: "Okta",
    title: "Cross App Access: Securing AI Agent and App-to-App Connections",
    url: "https://www.okta.com/identity-101/cross-app-access-securing-ai-agent-and-app-to-app-connections/",
    date: "2025-11-25",
  },
  {
    id: "oso-agent-permissions",
    author: "Hazal Mestci",
    org: "Oso Security",
    title: "Setting Permissions for AI Agents",
    url: "https://www.osohq.com/learn/ai-agent-permissions-delegated-access",
    date: "2025-10-28",
  },
  {
    id: "permit-four-perimeters",
    author: "Gabriel L. Manor",
    org: "Permit.io",
    title: "The Four Perimeter Framework for AI Access Control",
    url: "https://docs.permit.io/ai-security/framework/",
    date: "2025-04-01",
  },
  {
    id: "permit-ai-access-control",
    author: "Gabriel L. Manor",
    org: "Permit.io",
    title: "Announcing Permit.io AI Access Control: AI Identity FGA",
    url: "https://www.permit.io/blog/announcing-permit-ai-access-control-ai-identity-fga",
    date: "2025-04-01",
  },
  {
    id: "maler-ciam-interview",
    author: "Eve Maler",
    org: "CIAM Weekly",
    title: "An Interview With Eve Maler",
    url: "https://ciamweekly.substack.com/p/an-interview-with-eve-maler",
    date: "2026-07-06",
  },
  {
    id: "maler-strata",
    author: "Eve Maler",
    org: "Strata Identity",
    title: "Strata Identity Appoints Eve Maler as Agentic AI Ambassador",
    url: "https://www.strata.io/resources/news/eve-maler-agentic-identity-program-ambassador/",
    date: "2026-01-15",
  },
];

export const TOPICS: LearningTopic[] = [
  {
    slug: "agent-identity",
    name: "Agent Identity",
    summary:
      "Agents need first-class identities of their own — not borrowed user credentials — so access can be scoped, governed, and revoked per agent.",
    tags: [
      "non-human identity",
      "workspace identity",
      "machine identity",
      "identity class",
      "service accounts",
    ],
    related: ["delegated-authority", "least-privilege", "discovery-and-governance"],
    sourceIds: [
      "claude-agent-identity",
      "forrester-aegis",
      "cube-identity-governance",
      "bigid-aam",
      "okta-xaa",
    ],
    updated: "2026-07-16",
  },
  {
    slug: "delegated-authority",
    name: "Delegated Authority",
    summary:
      "How a human hands authority to an agent acting on their behalf: consent, scope, and accountability when delegation is the default, not the exception.",
    tags: [
      "on-behalf-of",
      "OBO",
      "user-managed access",
      "UMA",
      "consent",
      "token exchange",
      "permission mirroring",
    ],
    related: ["agent-identity", "human-in-the-loop", "just-in-time-access"],
    sourceIds: ["maler-ciam-interview", "maler-strata", "oso-agent-permissions", "okta-xaa"],
    updated: "2026-07-16",
  },
  {
    slug: "least-privilege",
    name: "Least Privilege & Least Agency",
    summary:
      "Grant agents the narrowest capability the task needs — and bound not just what they can access but how much they can decide and act on their own.",
    tags: [
      "least agency",
      "scoped access",
      "blast radius",
      "over-provisioning",
      "fine-grained authorization",
    ],
    related: ["just-in-time-access", "agent-identity", "runtime-authorization"],
    sourceIds: [
      "forrester-aegis",
      "oso-agent-permissions",
      "claude-agent-identity",
      "permit-ai-access-control",
    ],
    updated: "2026-07-16",
  },
  {
    slug: "just-in-time-access",
    name: "Just-in-Time Access",
    summary:
      "Replace standing permissions with short-lived, task-scoped credentials issued at runtime and revoked when the work is done.",
    tags: [
      "zero standing privilege",
      "ephemeral credentials",
      "JIT",
      "token expiry",
      "runtime provisioning",
    ],
    related: ["least-privilege", "runtime-authorization", "delegated-authority"],
    sourceIds: ["oso-agent-permissions", "cube-identity-governance", "forrester-aegis"],
    updated: "2026-07-16",
  },
  {
    slug: "human-in-the-loop",
    name: "Human-in-the-Loop Oversight",
    summary:
      "Keep a human decision in the path for consequential agent actions, with consent that persists and remains enforceable across long-running work.",
    tags: [
      "approval",
      "human oversight",
      "consent",
      "escalation",
      "access request",
      "sensitive operations",
    ],
    related: ["delegated-authority", "auditability", "runtime-authorization"],
    sourceIds: [
      "oso-agent-permissions",
      "permit-four-perimeters",
      "maler-ciam-interview",
      "forrester-aegis",
    ],
    updated: "2026-07-16",
  },
  {
    slug: "runtime-authorization",
    name: "Runtime Authorization",
    summary:
      "Authorization for agents must move from static provisioning to real-time policy decisions enforced at every layer of the interaction, from prompt to response.",
    tags: [
      "four perimeters",
      "policy enforcement",
      "RAG protection",
      "prompt filtering",
      "real-time",
      "ABAC",
      "ReBAC",
    ],
    related: ["least-privilege", "just-in-time-access", "human-in-the-loop"],
    sourceIds: [
      "permit-four-perimeters",
      "permit-ai-access-control",
      "cube-identity-governance",
      "okta-xaa",
    ],
    updated: "2026-07-16",
  },
  {
    slug: "auditability",
    name: "Auditability & Accountability",
    summary:
      "Every agent action needs a durable record binding the act to the identity and authority behind it — explainable outcomes, immutable ownership, complete trails.",
    tags: [
      "audit trail",
      "explainable outcomes",
      "immutable ownership",
      "attribution",
      "compliance",
      "logging",
    ],
    related: ["human-in-the-loop", "agent-identity", "discovery-and-governance"],
    sourceIds: [
      "forrester-aegis",
      "cube-identity-governance",
      "okta-xaa",
      "maler-ciam-interview",
    ],
    updated: "2026-07-16",
  },
  {
    slug: "discovery-and-governance",
    name: "Discovery & Governance",
    summary:
      "You can't govern agents you can't see: inventory every agent, understand what data it can reach, and manage human and non-human identities under one policy.",
    tags: [
      "shadow AI",
      "agent inventory",
      "AAM",
      "AEGIS",
      "DSPM",
      "data-centric",
      "lifecycle",
    ],
    related: ["agent-identity", "auditability", "least-privilege"],
    sourceIds: ["bigid-aam", "forrester-aegis", "okta-xaa", "cube-identity-governance"],
    updated: "2026-07-16",
  },
];

export function getTopic(slug: string): LearningTopic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

export function getSource(id: string): LearningSource | undefined {
  return SOURCES.find((s) => s.id === id);
}
