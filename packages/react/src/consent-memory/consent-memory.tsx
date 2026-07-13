"use client";

import * as React from "react";

/**
 * Consent Memory — the choice of *how long* a permission lasts, made legible.
 * When an agent asks to do something, "Always allow" is the fastest way out of
 * the prompt, so users pick it under task focus without registering that they
 * just signed a standing grant. This pattern turns durability into a first-
 * class, reviewable decision: every option spells out the future it commits
 * you to, and the least-standing choice is the resting default.
 *
 * Headless compound component. All parts render unstyled with `data-acp`
 * attributes as styling hooks; import `@agentconsent/react/theme.css`
 * for the default theme.
 *
 * The selected option is controllable via `value` / `onValueChange` or
 * uncontrolled via `defaultValue`. The confirm button reports the chosen
 * durability so its label and the payload have a single source of truth.
 */

/**
 * How long the grant persists. `once` is the safe default; the others are
 * standing to increasing degrees — `scoped` binds to a narrow condition,
 * `always` is an unconditional standing grant.
 */
export type ConsentDurability = "once" | "session" | "scoped" | "always";

interface ConsentMemoryContextValue {
  value: string | null;
  /** Register an option's durability so the confirm label can read it. */
  register: (value: string, durability: ConsentDurability) => void;
  /** Durability of the currently selected option, or null if none. */
  getDurability: () => ConsentDurability | null;
  select: (value: string) => void;
  name: string;
  onAllow: (value: string) => void;
  onDeny: () => void;
  titleId: string;
}

const ConsentMemoryContext =
  React.createContext<ConsentMemoryContextValue | null>(null);

function useConsentMemoryContext(part: string): ConsentMemoryContextValue {
  const ctx = React.useContext(ConsentMemoryContext);
  if (!ctx) {
    throw new Error(
      `ConsentMemory.${part} must be rendered inside ConsentMemory.Root`
    );
  }
  return ctx;
}

/** Controllable single-value state without a dependency. */
function useControllableValue(
  value: string | undefined,
  defaultValue: string | undefined,
  onValueChange: ((value: string) => void) | undefined
): [string | undefined, (next: string) => void] {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const current = isControlled ? value : internal;
  const setValue = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );
  return [current, setValue];
}

/* ── Root ─────────────────────────────────────────────────────────── */

export interface ConsentMemoryRootProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  /** Selected option value (controlled). */
  value?: string;
  /** Initial selected option value (uncontrolled). Point it at the `once` option. */
  defaultValue?: string;
  /** Called when the selected durability option changes. */
  onValueChange?: (value: string) => void;
  /** Called with the chosen option value when the user confirms. */
  onAllow: (value: string) => void;
  /** Called when the user declines entirely. */
  onDeny: () => void;
  children: React.ReactNode;
}

const Root = React.forwardRef<HTMLFormElement, ConsentMemoryRootProps>(
  function ConsentMemoryRoot(
    { value, defaultValue, onValueChange, onAllow, onDeny, children, ...rest },
    ref
  ) {
    const titleId = React.useId();
    const name = React.useId();
    const [selected, setSelected] = useControllableValue(
      value,
      defaultValue,
      onValueChange
    );
    // Options register their durability as they render (they render before
    // Actions in tree order, so the confirm button can read the selected
    // option's durability in the same pass). A ref map, not state — writing
    // it during render is idempotent and never triggers a re-render.
    const durabilityRef = React.useRef<Map<string, ConsentDurability>>(
      new Map()
    );

    const ctx = React.useMemo<ConsentMemoryContextValue>(
      () => ({
        value: selected ?? null,
        register: (next, durability) => {
          durabilityRef.current.set(next, durability);
        },
        getDurability: () =>
          selected != null
            ? durabilityRef.current.get(selected) ?? null
            : null,
        select: setSelected,
        name,
        onAllow,
        onDeny,
        titleId,
      }),
      [selected, setSelected, name, onAllow, onDeny, titleId]
    );

    return (
      <ConsentMemoryContext.Provider value={ctx}>
        <form
          ref={ref}
          data-acp="root"
          data-memory=""
          aria-labelledby={titleId}
          onSubmit={(event) => {
            event.preventDefault();
            if (selected != null) onAllow(selected);
          }}
          {...rest}
        >
          {children}
        </form>
      </ConsentMemoryContext.Provider>
    );
  }
);

/* ── Header parts ─────────────────────────────────────────────────── */

export type ConsentMemoryHeaderProps = React.HTMLAttributes<HTMLDivElement>;

function Header(props: ConsentMemoryHeaderProps) {
  useConsentMemoryContext("Header");
  return <div data-acp="header" {...props} />;
}

export type ConsentMemoryIconProps = React.HTMLAttributes<HTMLSpanElement>;

function Icon(props: ConsentMemoryIconProps) {
  useConsentMemoryContext("Icon");
  return <span aria-hidden data-acp="icon" {...props} />;
}

export type ConsentMemoryTitleProps =
  React.HTMLAttributes<HTMLHeadingElement>;

/** The permission being asked about: "Allow Inbox Assistant to send email?". */
function Title(props: ConsentMemoryTitleProps) {
  const { titleId } = useConsentMemoryContext("Title");
  return <h2 id={titleId} data-acp="title" {...props} />;
}

export type ConsentMemoryDescriptionProps =
  React.HTMLAttributes<HTMLParagraphElement>;

/** The concrete action prompting the request, above the durability choice. */
function Description(props: ConsentMemoryDescriptionProps) {
  useConsentMemoryContext("Description");
  return <p data-acp="memory-description" {...props} />;
}

/* ── Options ──────────────────────────────────────────────────────── */

export type ConsentMemoryOptionsProps =
  React.FieldsetHTMLAttributes<HTMLFieldSetElement> & {
    /** Legend for the durability choice; defaults to "Apply this decision:". */
    legend?: React.ReactNode;
  };

/**
 * The set of durability choices, as a radio group. Renders a fieldset/legend
 * so assistive tech announces "how long should this apply" as one grouping.
 */
function Options({ legend, children, ...rest }: ConsentMemoryOptionsProps) {
  useConsentMemoryContext("Options");
  return (
    <fieldset data-acp="memory-options" {...rest}>
      <legend data-acp="memory-options-legend">
        {legend ?? "Apply this decision:"}
      </legend>
      {children}
    </fieldset>
  );
}

export interface ConsentMemoryOptionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Stable value passed to `onAllow` when this option is selected. */
  value: string;
  /** How standing this grant is — drives styling and the confirm label. */
  durability: ConsentDurability;
  /** The choice itself: "Always, for this recipient". */
  label: React.ReactNode;
  /**
   * The future this choice commits to, in plain language: "The agent can email
   * Dana any time without asking again." This is the point of the pattern.
   */
  consequence: React.ReactNode;
}

const DURABILITY_HINT: Record<ConsentDurability, string> = {
  once: "This time",
  session: "This session",
  scoped: "Standing · scoped",
  always: "Standing · always",
};

/**
 * One durability choice. The radio and its consequence are bound together so
 * the standing implication is never more than a line from the choice itself.
 */
function Option({
  value,
  durability,
  label,
  consequence,
  ...rest
}: ConsentMemoryOptionProps) {
  const { value: selected, select, register, name } =
    useConsentMemoryContext("Option");
  register(value, durability);
  const inputId = React.useId();
  const consequenceId = React.useId();
  const checked = selected === value;
  return (
    <div
      data-acp="memory-option"
      data-durability={durability}
      data-selected={checked ? "" : undefined}
      {...rest}
    >
      <input
        id={inputId}
        type="radio"
        name={name}
        value={value}
        data-acp="memory-option-radio"
        checked={checked}
        aria-describedby={consequenceId}
        onChange={() => select(value)}
      />
      <div data-acp="memory-option-body">
        <label htmlFor={inputId} data-acp="memory-option-label">
          <span data-acp="memory-option-name">{label}</span>
          <span data-acp="memory-option-hint" data-durability={durability}>
            {DURABILITY_HINT[durability]}
          </span>
        </label>
        <p id={consequenceId} data-acp="memory-option-consequence">
          {consequence}
        </p>
      </div>
    </div>
  );
}

/* ── Actions ──────────────────────────────────────────────────────── */

export type ConsentMemoryActionsProps = React.HTMLAttributes<HTMLDivElement>;

function Actions(props: ConsentMemoryActionsProps) {
  useConsentMemoryContext("Actions");
  return <div data-acp="actions" {...props} />;
}

export interface ConsentMemoryAllowProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /**
   * Button content. As a render function it receives the selected durability,
   * so the label can read "Allow always" vs "Allow once" without lifting state.
   */
  children:
    | React.ReactNode
    | ((state: { durability: ConsentDurability | null }) => React.ReactNode);
}

const Allow = React.forwardRef<HTMLButtonElement, ConsentMemoryAllowProps>(
  function ConsentMemoryAllow({ children, ...rest }, ref) {
    const { getDurability } = useConsentMemoryContext("Allow");
    const durability = getDurability();
    return (
      <button
        ref={ref}
        type="submit"
        data-acp="allow-once"
        data-memory-allow=""
        data-durability={durability ?? undefined}
        {...rest}
      >
        {typeof children === "function" ? children({ durability }) : children}
      </button>
    );
  }
);

export type ConsentMemoryDenyProps =
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const Deny = React.forwardRef<HTMLButtonElement, ConsentMemoryDenyProps>(
  function ConsentMemoryDeny({ onClick, ...rest }, ref) {
    const { onDeny } = useConsentMemoryContext("Deny");
    return (
      <button
        ref={ref}
        type="button"
        data-acp="deny"
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) onDeny();
        }}
        {...rest}
      />
    );
  }
);

export const ConsentMemory = {
  Root,
  Header,
  Icon,
  Title,
  Description,
  Options,
  Option,
  Actions,
  Allow,
  Deny,
};
