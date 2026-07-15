"use client";

import { useState } from "react";
import installations from "@/lib/skill-installation.json";
import { CodeBlock } from "./code-block";

type Mode = "app" | "cli";
type Scope = "project" | "global";

type GuideBody = {
  steps: string[];
  code?: string | null;
  copyText?: string;
  sourceUrl?: string;
};

type ScopedGuide = {
  steps: string[];
  code: string | null;
  sourceUrl?: string;
};

type GuideOption = GuideBody & { label: string };

type Guide = {
  title: string;
  steps: string[];
  code: string | null;
  copyText?: string;
  sourceUrl?: string;
  options?: GuideOption[];
  scopes?: Record<Scope, ScopedGuide>;
};

type Installation = {
  id: string;
  label: string;
  modes: Mode[];
  guides: Record<Mode, Guide | null>;
};

const INSTALLATIONS = installations as Installation[];

function InlineCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable or permission denied; button stays as-is.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied repository URL" : "Copy repository URL"}
      className="ml-1 inline-flex items-center rounded border border-line bg-surface px-1.5 py-0.5 text-xs font-medium text-ink hover:border-line-strong hover:text-agent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/** Interactive installation chooser for the distributed Agent Consent Patterns skill. */
export function SkillInstaller() {
  const [installationId, setInstallationId] = useState("claude");
  const [mode, setMode] = useState<Mode>("cli");
  const [scope, setScope] = useState<Scope>("project");
  const installation =
    INSTALLATIONS.find(({ id }) => id === installationId) ?? INSTALLATIONS[0]!;
  const hasModeChoice = installation.modes.length > 1;
  const activeMode = installation.modes.includes(mode) ? mode : installation.modes[0]!;
  const guide = installation.guides[activeMode]!;
  const hasScopeChoice = guide.scopes !== undefined;
  const activeGuide = guide.scopes?.[scope] ?? guide;

  function renderStep(step: string, copyText?: string) {
    if (!copyText || !step.includes(copyText)) return step;
    const [before, after] = step.split(copyText);
    return (
      <>
        {before}
        <code className="rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
          {copyText}
        </code>
        <InlineCopyButton text={copyText} />
        {after}
      </>
    );
  }

  function renderGuideBody(body: GuideBody) {
    return (
      <>
        {body.steps.length === 1 ? (
          <p className="leading-relaxed text-ink-muted">
            {renderStep(body.steps[0]!, body.copyText)}
          </p>
        ) : (
          <ol className="list-decimal space-y-2 pl-5 leading-relaxed text-ink-muted">
            {body.steps.map((step) => (
              <li key={step}>{renderStep(step, body.copyText)}</li>
            ))}
          </ol>
        )}
        {body.code && <CodeBlock code={body.code} className="mt-4" />}
        {body.sourceUrl && (
          <a
            href={body.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center rounded-md border border-line bg-surface px-3 py-2 text-sm font-medium text-ink underline underline-offset-4 hover:border-line-strong hover:text-agent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            Get the portable SKILL.md
          </a>
        )}
      </>
    );
  }

  function selectInstallation(nextId: string) {
    const next = INSTALLATIONS.find(({ id }) => id === nextId) ?? INSTALLATIONS[0]!;
    setInstallationId(next.id);
    setMode(next.modes.includes(mode) ? mode : next.modes[0]!);
    setScope("project");
  }

  return (
    <section
      aria-labelledby="skill-installation-heading"
      data-acp="skill-installer"
      className="mt-10 rounded-xl border border-line bg-surface-raised p-5 sm:p-6"
    >
      <p className="eyebrow">Install</p>
      <h2 id="skill-installation-heading" className="mt-2 text-xl font-semibold tracking-tight">
        Add the skill to your agent
      </h2>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end">
        <div className="min-w-0 sm:flex-1">
          <label htmlFor="skill-agent" className="block text-sm font-semibold text-ink">
            Choose your agent
          </label>
          <div className="relative mt-2">
            <select
              id="skill-agent"
              value={installation.id}
              onChange={(event) => selectInstallation(event.target.value)}
              className="h-10 w-full cursor-pointer appearance-none rounded-md border border-line bg-surface px-3 pr-12 text-sm text-ink hover:border-line-strong"
            >
              {INSTALLATIONS.map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted"
            >
              <path d="m3.5 6 4.5 4.5L12.5 6" />
            </svg>
          </div>
        </div>

        {hasModeChoice && (
          <fieldset className="shrink-0">
            <legend className="text-sm font-semibold text-ink">Install with</legend>
            <div className="mt-2 inline-flex h-10 rounded-lg border border-line bg-surface p-1">
              {installation.modes.map((option) => {
                const optionId = `skill-install-${installation.id}-${option}`;
                return (
                  <div key={option}>
                    <input
                      id={optionId}
                      type="radio"
                      name="skill-install-mode"
                      value={option}
                      checked={activeMode === option}
                      onChange={() => setMode(option)}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={optionId}
                      className="flex h-full cursor-pointer items-center rounded-md px-3 text-sm font-medium text-ink-muted transition-colors peer-checked:bg-agent-surface peer-checked:text-agent hover:text-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus"
                    >
                      {option === "app" ? "App" : "CLI"}
                    </label>
                  </div>
                );
              })}
            </div>
          </fieldset>
        )}

        {hasScopeChoice && (
          <fieldset className="shrink-0">
            <legend className="text-sm font-semibold text-ink">Scope</legend>
            <div className="mt-2 inline-flex h-10 rounded-lg border border-line bg-surface p-1">
              {(["project", "global"] as const).map((option) => {
                const optionId = `skill-install-${installation.id}-${option}`;
                return (
                  <div key={option}>
                    <input
                      id={optionId}
                      type="radio"
                      name="skill-install-scope"
                      value={option}
                      checked={scope === option}
                      onChange={() => setScope(option)}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={optionId}
                      className="flex h-full cursor-pointer items-center rounded-md px-3 text-sm font-medium text-ink-muted transition-colors peer-checked:bg-agent-surface peer-checked:text-agent hover:text-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus"
                    >
                      {option === "project" ? "Project" : "Global"}
                    </label>
                  </div>
                );
              })}
            </div>
          </fieldset>
        )}
      </div>

      <div className="mt-6 border-t border-line pt-5">
        {guide.options ? (
          <div className="space-y-6">
            {guide.options.map((option) => (
              <div key={option.label}>
                <h3 className="text-sm font-semibold text-ink">{option.label}</h3>
                <div className="mt-3">{renderGuideBody(option)}</div>
              </div>
            ))}
          </div>
        ) : (
          renderGuideBody(activeGuide)
        )}
      </div>
    </section>
  );
}
