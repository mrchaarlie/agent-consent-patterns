// Generates the "agent mode" view of the site: an llms.txt index plus clean
// Markdown mirrors of every page, written into the static-export `out/` dir.
//
// Why this exists: the human site is React/MDX with live component demos. An
// agent fetching a pattern page gets a wall of hydration markup and no prose.
// This script mirrors the same content as plain Markdown (and one llms.txt
// index, per the llmstxt.org convention) sourced directly from the content
// files — MDX, the patterns table, the glossary/principles data — so the
// agent-readable view can never drift from the human one.
//
// Runs as the site's `postbuild` step; regenerates on every `next build`.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SITE_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(SITE_DIR, "out");

// Absolute base for links in llms.txt. Defaults to the canonical site origin;
// override with SITE_URL at build time (e.g. for a preview deploy).
const BASE = (process.env.SITE_URL ?? "https://agentconsent.dev").replace(/\/$/, "");
const url = (path) => `${BASE}${path}`;

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

/** Decode the handful of HTML entities used in the TSX/MDX prose. */
function decodeEntities(s) {
  const map = {
    "&ldquo;": "“",
    "&rdquo;": "”",
    "&lsquo;": "‘",
    "&rsquo;": "’",
    "&mdash;": "—",
    "&ndash;": "–",
    "&hellip;": "…",
    "&nbsp;": " ",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
  };
  return s.replace(/&[a-z]+;/g, (m) => map[m] ?? m);
}

/**
 * Evaluate a bare array/object literal lifted out of a `.ts` source file.
 * The literals here are plain data (strings, numbers) with no runtime refs, so
 * a Function wrapper is a safe, dependency-free way to read them.
 */
function evalLiteral(literal) {
  return new Function(`return (${literal});`)();
}

/** Extract the RHS array literal of `const NAME: ... = [ ... ];`. */
function extractArrayLiteral(src, name) {
  const decl = src.indexOf(`const ${name}`);
  if (decl === -1) throw new Error(`array ${name} not found`);
  // Skip past `=` so a `Type[]` annotation's `[` isn't mistaken for the array.
  const eq = src.indexOf("=", decl);
  const open = src.indexOf("[", eq);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) return src.slice(open, i + 1);
    }
  }
  throw new Error(`unterminated array ${name}`);
}

/**
 * Reduce reading-level-variant prose to the canonical human copy. TSX pages
 * wrap each level in <Lvl level="…">…</Lvl>; the mirrors carry only the human
 * variant. Prose without Lvl wrappers passes through unchanged.
 */
function pickHuman(jsx) {
  if (!jsx.includes("<Lvl")) return jsx;
  const blocks = [
    ...jsx.matchAll(/<Lvl\s+level="human"[^>]*>([\s\S]*?)<\/Lvl>/g),
  ];
  return blocks.map((m) => m[1]).join("\n");
}

/**
 * Convert the small, known subset of JSX/HTML used in the essay prose to
 * Markdown. Handles <P slug>, <strong>, <em>, <p>, fragments, {" "} spacers,
 * and entities. Anything else is stripped. Reliable because these pages only
 * use this handful of tags.
 */
function proseToMarkdown(jsx) {
  let s = jsx;
  s = s.replace(/\{"\s*"\}/g, " "); // {" "} spacer → space
  s = s.replace(/\{'\s*'\}/g, " ");
  // <P slug="x">Text</P> → [Text](/patterns/x/)
  s = s.replace(
    /<P\s+slug="([^"]+)"\s*>([\s\S]*?)<\/P>/g,
    (_, slug, text) => `[${text.replace(/\s+/g, " ").trim()}](/patterns/${slug}/)`,
  );
  s = s.replace(/<strong[^>]*>/g, "**").replace(/<\/strong>/g, "**");
  s = s.replace(/<em[^>]*>/g, "_").replace(/<\/em>/g, "_");
  // Paragraph boundaries.
  s = s.replace(/<p[^>]*>/g, "").replace(/<\/p>/g, "\n\n");
  // Drop fragments and any remaining markup delimiters. Strip the individual
  // delimiter characters rather than matching whole tags: overlapping malformed
  // tags can otherwise re-form after a single multi-character replacement.
  s = s.replace(/[<>]/g, "");
  s = decodeEntities(s);
  // Normalize whitespace inside paragraphs, collapse blank runs.
  s = s
    .split("\n\n")
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n");
  return s.trim();
}

// ---------------------------------------------------------------------------
// Load content sources
// ---------------------------------------------------------------------------

async function loadPatterns() {
  const src = await readFile(join(SITE_DIR, "lib/patterns.ts"), "utf8");
  return evalLiteral(extractArrayLiteral(src, "PATTERNS"));
}

async function loadGlossary() {
  const src = await readFile(join(SITE_DIR, "app/glossary/page.tsx"), "utf8");
  const terms = evalLiteral(extractArrayLiteral(src, "TERMS"));
  // Terms carry all three reading levels; `human` is the canonical mirror copy.
  return terms.map((t) => ({
    term: t.term,
    definition: decodeEntities(t.human ?? t.definition),
  }));
}

/** Turn a pattern's MDX into clean Markdown (fence-aware). */
function mdxToMarkdown(mdx, pattern) {
  const lines = mdx.split("\n");
  const out = [];
  let inFence = false;
  // Reading-level block state: inside `<div data-lvl="...">` … `</div>`.
  // The human variant is the canonical copy — unwrap it; drop the others.
  let lvlBlock = null;
  for (const line of lines) {
    if (/^```/.test(line)) {
      inFence = !inFence;
      if (lvlBlock === null || lvlBlock === "human") out.push(line);
      continue;
    }
    if (inFence) {
      if (lvlBlock === null || lvlBlock === "human") out.push(line);
      continue;
    }
    const lvlOpen = line.match(/^<div data-lvl="(caveman|human|academic)">\s*$/);
    if (lvlOpen) {
      lvlBlock = lvlOpen[1];
      continue;
    }
    if (lvlBlock !== null && /^<\/div>\s*$/.test(line)) {
      lvlBlock = null;
      continue;
    }
    if (lvlBlock !== null && lvlBlock !== "human") continue;
    if (/^import\s/.test(line)) continue; // drop MDX imports
    // Lede: <p [data-lvl] className="...">TEXT</p> on one line → plain
    // paragraph for the human variant; other levels dropped.
    const lede = line.match(
      /^<p\s+(?:data-lvl="([a-z]+)"\s+)?className="[^"]*">([\s\S]*)<\/p>\s*$/,
    );
    if (lede) {
      if (lede[1] === undefined || lede[1] === "human")
        out.push(decodeEntities(lede[2].trim()));
      continue;
    }
    // Live-demo / anatomy component tags → a note pointing at the human page.
    const comp = line.match(/^<([A-Z][A-Za-z]+)\s*\/>\s*$/);
    if (comp) {
      const name = comp[1];
      const href = url(`/patterns/${pattern.slug}/`);
      if (/Anatomy$/.test(name)) {
        out.push(
          `> **Anatomy** — a labeled breakdown of the ${pattern.name} component's parts is shown on the interactive page: ${href}`,
        );
      } else {
        out.push(
          `> **Live demo** — an interactive ${pattern.name} demo runs on the page: ${href}`,
        );
      }
      continue;
    }
    out.push(line);
  }
  let body = out.join("\n").replace(/\n{3,}/g, "\n\n").trim();

  const header =
    `# ${pattern.name}\n\n` +
    `> Pattern ${String(pattern.number).padStart(2, "0")} · ${pattern.category} · ` +
    `part of Agent Consent Patterns.\n` +
    `> Human page: ${url(`/patterns/${pattern.slug}/`)}\n`;
  return `${header}\n${body}\n`;
}

/** Turn a standalone docs MDX file into its canonical Human Markdown mirror. */
function docsMdxToMarkdown(mdx, { title, path }) {
  const lines = mdx.split("\n");
  const out = [];
  let inFence = false;
  let lvlBlock = null;
  for (const line of lines) {
    if (/^```/.test(line)) {
      inFence = !inFence;
      if (lvlBlock === null || lvlBlock === "human") out.push(line);
      continue;
    }
    if (inFence) {
      if (lvlBlock === null || lvlBlock === "human") out.push(line);
      continue;
    }
    const lvlOpen = line.match(/^<div data-lvl="(caveman|human|academic)">\s*$/);
    if (lvlOpen) {
      lvlBlock = lvlOpen[1];
      continue;
    }
    if (lvlBlock !== null && /^<\/div>\s*$/.test(line)) {
      lvlBlock = null;
      continue;
    }
    if (lvlBlock !== null && lvlBlock !== "human") continue;
    out.push(line);
  }
  const body = out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  return `# ${title}\n\n> Human page: ${url(path)}\n\n${body}\n`;
}

/** Extract principles (name, lede, body prose) + stubs + intro from the page. */
async function loadPrinciples() {
  const src = await readFile(join(SITE_DIR, "app/principles/page.tsx"), "utf8");

  const intro = (() => {
    const m = src.match(
      /<div className="mt-6 space-y-5 leading-relaxed text-ink-muted">([\s\S]*?)<\/div>/,
    );
    return m ? proseToMarkdown(pickHuman(m[1])) : "";
  })();

  const arrLiteral = extractArrayLiteral(src, "PRINCIPLES");
  // Split into per-principle chunks at top-level `  {` boundaries.
  const chunks = arrLiteral
    .slice(1, -1)
    .split(/\n\s{2}\{\n/)
    .map((c) => c.trim())
    .filter(Boolean);
  const principles = chunks.map((chunk) => {
    const name = chunk.match(/name:\s*"((?:[^"\\]|\\.)*)"/)?.[1] ?? "";
    // Ledes and bodies carry all three reading levels; mirror the human copy.
    // The lede's human entry is `human: "…"`; the body's is `human: (<>…</>)`,
    // so the quote vs. parenthesis after `human:` disambiguates the two.
    const lede =
      chunk.match(/human:\s*\n?\s*"((?:[^"\\]|\\.)*)"/)?.[1] ??
      chunk.match(/lede:\s*"((?:[^"\\]|\\.)*)"/)?.[1] ??
      "";
    const bodyMatch = chunk.match(/human:\s*\(\s*<>([\s\S]*?)<\/>/);
    const body = bodyMatch
      ? proseToMarkdown(bodyMatch[1])
      : (() => {
          const bodyStart = chunk.indexOf("<>");
          const bodyEnd = chunk.lastIndexOf("</>");
          return bodyStart !== -1 && bodyEnd !== -1
            ? proseToMarkdown(chunk.slice(bodyStart, bodyEnd + 3))
            : "";
        })();
    return { name: decodeEntities(name), lede: decodeEntities(lede), body };
  });

  // STUBS is optional: the page had a "principles without a pattern yet"
  // section, but those were promoted into full principles above. Tolerate its
  // absence so the mirror tracks whichever shape the page currently has.
  const stubs = src.includes("const STUBS")
    ? evalLiteral(extractArrayLiteral(src, "STUBS")).map((s) => ({
        name: decodeEntities(s.name),
        note: decodeEntities(s.human ?? s.note),
      }))
    : [];

  return { intro, principles, stubs };
}

/** About page: turn the colophon prose <div> into Markdown. */
async function loadAbout() {
  const src = await readFile(join(SITE_DIR, "app/about/page.tsx"), "utf8");
  const m = src.match(
    /<div className="mt-6 space-y-5 leading-relaxed text-ink-muted">([\s\S]*?)<\/div>/,
  );
  return m ? proseToMarkdown(pickHuman(m[1])) : "";
}

// ---------------------------------------------------------------------------
// Render outputs
// ---------------------------------------------------------------------------

function renderGlossary(terms) {
  const body = terms
    .map((t) => `## ${t.term}\n\n${t.definition}`)
    .join("\n\n");
  return `# Glossary — Agent Consent Patterns\n\n> Human page: ${url("/glossary/")}\n\nShared vocabulary used across the patterns.\n\n${body}\n`;
}

function renderPrinciples({ intro, principles, stubs }) {
  const lines = [
    "# Principles of agent consent",
    "",
    `> Human page: ${url("/principles/")}`,
    "",
    intro,
    "",
  ];
  principles.forEach((p, i) => {
    lines.push(`## ${i + 1}. ${p.name}`, "", `**${p.lede}**`, "", p.body, "");
  });
  if (stubs.length) {
    lines.push(
      "## Principles without a pattern yet",
      "",
      "Load-bearing principles not yet promoted into the essay, mostly because the pattern that would uphold each one isn't built.",
      "",
    );
    stubs.forEach((s) => lines.push(`- **${s.name}.** ${s.note}`));
  }
  return lines.join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
}

function renderAbout(about) {
  return `# About — Agent Consent Patterns\n\n> Human page: ${url("/about/")}\n\n${about}\n`;
}

function renderIndexMd(patterns, categories) {
  const lines = [
    "# Agent Consent Patterns",
    "",
    "UX patterns for AI agent permissions, consent, and human-in-the-loop control — a reference and a headless React component library for teams building products where an agent acts on a user's behalf.",
    "",
    "Agents connect to accounts, send messages, and spend money on a user's behalf. The consent UX for that delegation is being improvised by every team shipping an agent. This is the reference: a taxonomy of named patterns for permissions, approval, standing authority, and auditability.",
    "",
    "## The 12 patterns",
    "",
  ];
  for (const cat of categories) {
    lines.push(`### ${cat}`, "");
    for (const p of patterns.filter((x) => x.category === cat)) {
      lines.push(`- **${p.name}** — ${p.problem}`);
    }
    lines.push("");
  }
  return lines.join("\n") + "\n";
}

function renderLlmsTxt(patterns, categories) {
  const lines = [
    "# Agent Consent Patterns",
    "",
    "> UX patterns for AI agent permissions, consent, and human-in-the-loop control. A reference taxonomy of 12 named patterns plus a headless, accessible React implementation (@agentconsent/react). This file and the linked Markdown mirrors are the agent-readable view of the site.",
    "",
    "Every pattern documents the problem it solves, its anatomy, when (not) to use it, real-world examples, accessibility notes, anti-patterns, and code. The linked `.md` files are plain-Markdown mirrors of each human page. The human site offers each prose block at three reading levels (Caveman / Human / Academic); these mirrors carry the canonical Human copy.",
    "",
    "## Patterns",
    "",
  ];
  for (const cat of categories) {
    for (const p of patterns.filter((x) => x.category === cat)) {
      lines.push(
        `- [${p.name}](${url(`/patterns/${p.slug}.md`)}): ${p.problem}`,
      );
    }
  }
  lines.push(
    "",
    "## Reference",
    "",
    `- [Principles of agent consent](${url("/principles.md")}): the ten principles the pattern library is built on.`,
    `- [Glossary](${url("/glossary.md")}): shared vocabulary for agent consent UX.`,
    `- [About](${url("/about.md")}): why the project exists and how to contribute.`,
    `- [Overview](${url("/index.md")}): the full taxonomy on one page.`,
    "",
    "## Build",
    "",
    `- [React library](${url("/library.md")}): install and compose the accessible React primitives.`,
    `- [Agent skill](${url("/skill.md")}): install the consent-UX guidance in Claude Code, Codex, or another compatible agent.`,
    "",
    "## Optional",
    "",
    `- [Full text](${url("/llms-full.txt")}): every pattern and page concatenated into one document.`,
    "",
  );
  return lines.join("\n") + "\n";
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!existsSync(OUT_DIR)) {
    console.error(
      `[agent-view] ${OUT_DIR} not found — run \`next build\` first (this is the postbuild step).`,
    );
    process.exit(1);
  }

  const CATEGORIES = [
    "Granting access",
    "Approving actions",
    "Standing authority",
    "Trust & transparency",
  ];

  const patterns = (await loadPatterns()).filter((p) => p.status === "live");

  // Per-pattern Markdown.
  const patternDocs = [];
  await mkdir(join(OUT_DIR, "patterns"), { recursive: true });
  for (const p of patterns) {
    const mdx = await readFile(
      join(SITE_DIR, "content/patterns", `${p.slug}.mdx`),
      "utf8",
    );
    const md = mdxToMarkdown(mdx, p);
    await writeFile(join(OUT_DIR, "patterns", `${p.slug}.md`), md);
    patternDocs.push(md);
  }

  // Standalone page mirrors.
  const glossary = renderGlossary(await loadGlossary());
  const principles = renderPrinciples(await loadPrinciples());
  const about = renderAbout(await loadAbout());
  const library = docsMdxToMarkdown(
    await readFile(join(SITE_DIR, "content/library.mdx"), "utf8"),
    { title: "React library — Agent Consent Patterns", path: "/library/" },
  );
  const skill = docsMdxToMarkdown(
    await readFile(join(SITE_DIR, "content/skill.mdx"), "utf8"),
    { title: "Agent skill — Agent Consent Patterns", path: "/skill/" },
  );
  const indexMd = renderIndexMd(patterns, CATEGORIES);

  await writeFile(join(OUT_DIR, "glossary.md"), glossary);
  await writeFile(join(OUT_DIR, "principles.md"), principles);
  await writeFile(join(OUT_DIR, "about.md"), about);
  await writeFile(join(OUT_DIR, "library.md"), library);
  await writeFile(join(OUT_DIR, "skill.md"), skill);
  await writeFile(join(OUT_DIR, "index.md"), indexMd);

  // llms.txt index + concatenated full text.
  await writeFile(join(OUT_DIR, "llms.txt"), renderLlmsTxt(patterns, CATEGORIES));
  const full = [
    indexMd,
    principles,
    ...patternDocs,
    glossary,
    about,
    library,
    skill,
  ].join("\n\n---\n\n");
  await writeFile(join(OUT_DIR, "llms-full.txt"), full);

  console.log(
    `[agent-view] wrote llms.txt, llms-full.txt, index.md, and ${patterns.length} pattern + 5 page mirrors to out/`,
  );
}

main().catch((err) => {
  console.error("[agent-view] failed:", err);
  process.exit(1);
});
