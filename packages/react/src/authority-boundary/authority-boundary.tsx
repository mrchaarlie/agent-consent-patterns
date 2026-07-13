"use client";

import * as React from "react";

import type { ScopeAccess } from "../scoped-grant/scoped-grant";

/**
 * Authority Boundary — the single settings surface that answers, for one
 * agent: what may it ever do on its own, and what must it always ask about?
 * Standing authority tends to accrete across scattered prompts and toggles
 * until no one can say what the agent is actually allowed to do unattended.
 * This pattern gathers every capability into one place and puts each on an
 * explicit authority level.
 *
 * Headless compound component. All parts render unstyled with `data-acp`
 * attributes as styling hooks; import `@agentconsent/react/theme.css`
 * for the default theme.
 *
 * The level map is controllable via `value` / `onValueChange` or uncontrolled
 * via `defaultValue` (a record of capability id → level). A capability with no
 * entry defaults to the safest level, `ask`.
 */

export type { ScopeAccess };

/**
 * How much standing authority a capability carries.
 * - `auto`: the agent may do it unattended.
 * - `ask`: the agent must ask for confirmation each time (the safe default).
 * - `never`: the agent may not do it at all.
 */
export type AuthorityLevel = "auto" | "ask" | "never";

export const AUTHORITY_LEVELS: AuthorityLevel[] = ["auto", "ask", "never"];

const LEVEL_LABEL: Record<AuthorityLevel, string> = {
  auto: "Automatic",
  ask: "Ask first",
  never: "Never",
};

interface AuthorityBoundaryContextValue {
  getLevel: (id: string) => AuthorityLevel;
  setLevel: (id: string, level: AuthorityLevel) => void;
  counts: Record<AuthorityLevel, number>;
  titleId: string;
}

const AuthorityBoundaryContext =
  React.createContext<AuthorityBoundaryContextValue | null>(null);

function useAuthorityBoundaryContext(
  part: string
): AuthorityBoundaryContextValue {
  const ctx = React.useContext(AuthorityBoundaryContext);
  if (!ctx) {
    throw new Error(
      `AuthorityBoundary.${part} must be rendered inside AuthorityBoundary.Root`
    );
  }
  return ctx;
}

/** Controllable record state without a dependency. */
function useControllableMap(
  value: Record<string, AuthorityLevel> | undefined,
  defaultValue: Record<string, AuthorityLevel> | undefined,
  onValueChange: ((value: Record<string, AuthorityLevel>) => void) | undefined
): [
  Record<string, AuthorityLevel>,
  (id: string, level: AuthorityLevel) => void,
] {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<
    Record<string, AuthorityLevel>
  >(() => defaultValue ?? {});
  const current = isControlled ? value : internal;
  const setLevel = React.useCallback(
    (id: string, level: AuthorityLevel) => {
      const next = { ...current, [id]: level };
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [current, isControlled, onValueChange]
  );
  return [current, setLevel];
}

/* ── Root ─────────────────────────────────────────────────────────── */

export interface AuthorityBoundaryRootProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect" | "defaultValue"> {
  /** Capability id → authority level (controlled). */
  value?: Record<string, AuthorityLevel>;
  /** Initial capability id → authority level (uncontrolled). */
  defaultValue?: Record<string, AuthorityLevel>;
  /** Called with the full level map whenever any capability changes. */
  onValueChange?: (value: Record<string, AuthorityLevel>) => void;
  children: React.ReactNode;
}

const Root = React.forwardRef<HTMLElement, AuthorityBoundaryRootProps>(
  function AuthorityBoundaryRoot(
    { value, defaultValue, onValueChange, children, ...rest },
    ref
  ) {
    const titleId = React.useId();
    const [levels, setLevel] = useControllableMap(
      value,
      defaultValue,
      onValueChange
    );

    const ctx = React.useMemo<AuthorityBoundaryContextValue>(() => {
      // Counts derive from the level map, so they're correct regardless of
      // where Summary sits relative to the list. The map is the settings
      // surface's single source of truth — give every capability an entry.
      const counts: Record<AuthorityLevel, number> = {
        auto: 0,
        ask: 0,
        never: 0,
      };
      for (const level of Object.values(levels)) counts[level] += 1;
      return {
        getLevel: (id) => levels[id] ?? "ask",
        setLevel,
        counts,
        titleId,
      };
    }, [levels, setLevel, titleId]);

    return (
      <AuthorityBoundaryContext.Provider value={ctx}>
        <section
          ref={ref as React.Ref<HTMLElement>}
          role="group"
          aria-labelledby={titleId}
          data-acp="root"
          data-authority=""
          {...rest}
        >
          {children}
        </section>
      </AuthorityBoundaryContext.Provider>
    );
  }
);

/* ── Header parts ─────────────────────────────────────────────────── */

export type AuthorityBoundaryHeaderProps =
  React.HTMLAttributes<HTMLDivElement>;

function Header(props: AuthorityBoundaryHeaderProps) {
  useAuthorityBoundaryContext("Header");
  return <div data-acp="header" {...props} />;
}

export type AuthorityBoundaryIconProps =
  React.HTMLAttributes<HTMLSpanElement>;

function Icon(props: AuthorityBoundaryIconProps) {
  useAuthorityBoundaryContext("Icon");
  return <span aria-hidden data-acp="icon" {...props} />;
}

export type AuthorityBoundaryTitleProps =
  React.HTMLAttributes<HTMLHeadingElement>;

/** The question the surface answers: "What can Inbox Assistant do on its own?". */
function Title(props: AuthorityBoundaryTitleProps) {
  const { titleId } = useAuthorityBoundaryContext("Title");
  return <h2 id={titleId} data-acp="title" {...props} />;
}

export type AuthorityBoundaryDescriptionProps =
  React.HTMLAttributes<HTMLParagraphElement>;

function Description(props: AuthorityBoundaryDescriptionProps) {
  useAuthorityBoundaryContext("Description");
  return <p data-acp="authority-description" {...props} />;
}

/* ── Summary ──────────────────────────────────────────────────────── */

export interface AuthorityBoundarySummaryProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "children"> {
  /**
   * Render function receiving the live per-level counts, so the surface can
   * state "3 automatic · 2 ask first · 1 never" at a glance.
   */
  children: (counts: Record<AuthorityLevel, number>) => React.ReactNode;
}

/** A live, at-a-glance tally of how much standing authority is granted. */
function Summary({ children, ...rest }: AuthorityBoundarySummaryProps) {
  const { counts } = useAuthorityBoundaryContext("Summary");
  return (
    <p data-acp="authority-summary" aria-live="polite" {...rest}>
      {children(counts)}
    </p>
  );
}

/* ── List + Capability ────────────────────────────────────────────── */

export type AuthorityBoundaryListProps =
  React.HTMLAttributes<HTMLUListElement>;

function List(props: AuthorityBoundaryListProps) {
  useAuthorityBoundaryContext("List");
  return <ul data-acp="authority-list" {...props} />;
}

export interface AuthorityBoundaryCapabilityProps
  extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "id"> {
  /** Stable id used as the key in the level map. */
  id: string;
  /** Power level of this capability — a text badge, never color alone. */
  access: ScopeAccess;
  /** Plain-language capability name: "Send email on your behalf". */
  label: React.ReactNode;
  /** What the agent does with this capability. */
  description?: React.ReactNode;
  /**
   * Levels this capability may not be set to. Use it to forbid `auto` on an
   * irreversible capability, so the UI can't grant standing authority to
   * something that should always be confirmed.
   */
  disallow?: AuthorityLevel[];
}

const ACCESS_LABEL: Record<ScopeAccess, string> = {
  read: "Read",
  write: "Write",
  delete: "Delete",
};

/**
 * One capability row with its segmented authority control. The control is a
 * real radio group (a fieldset with a screen-reader legend naming the
 * capability), so each capability's authority is an independent, labelled
 * choice.
 */
function Capability({
  id,
  access,
  label,
  description,
  disallow,
  ...rest
}: AuthorityBoundaryCapabilityProps) {
  const { getLevel, setLevel } = useAuthorityBoundaryContext("Capability");
  const name = React.useId();
  const descId = React.useId();
  const level = getLevel(id);
  const disallowed = new Set(disallow ?? []);

  return (
    <li
      data-acp="authority-capability"
      data-access={access}
      data-level={level}
      {...rest}
    >
      <div data-acp="authority-capability-body">
        <span data-acp="authority-capability-head">
          <span data-acp="authority-access" data-access={access}>
            {ACCESS_LABEL[access]}
          </span>
          <span data-acp="authority-capability-name">{label}</span>
        </span>
        {description != null && (
          <p id={descId} data-acp="authority-capability-description">
            {description}
          </p>
        )}
      </div>
      <fieldset
        data-acp="authority-control"
        aria-describedby={description != null ? descId : undefined}
      >
        <legend data-acp="authority-control-legend">
          Authority for {typeof label === "string" ? label : "this capability"}
        </legend>
        {AUTHORITY_LEVELS.map((option) => {
          const optionId = `${name}-${option}`;
          const blocked = disallowed.has(option);
          return (
            <React.Fragment key={option}>
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option}
                data-acp="authority-radio"
                data-level={option}
                checked={level === option}
                disabled={blocked}
                onChange={() => setLevel(id, option)}
              />
              <label
                htmlFor={optionId}
                data-acp="authority-level-label"
                data-level={option}
              >
                {LEVEL_LABEL[option]}
              </label>
            </React.Fragment>
          );
        })}
      </fieldset>
    </li>
  );
}

export const AuthorityBoundary = {
  Root,
  Header,
  Icon,
  Title,
  Description,
  Summary,
  List,
  Capability,
};
