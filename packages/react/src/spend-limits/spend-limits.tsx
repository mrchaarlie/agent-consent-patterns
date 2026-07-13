"use client";

import * as React from "react";

/**
 * Spend & Rate Limits — numeric guardrails treated as consent primitives, not
 * billing settings. A budget cap, an action count, a time window: each is a
 * standing decision about how far an agent may go before it has to come back
 * and ask. This pattern gives those numbers one surface, shows each cap against
 * live usage so the boundary is legible, and makes clear that reaching a cap is
 * a *consent* event — the agent pauses and asks rather than silently stopping.
 *
 * Headless compound component. All parts render unstyled with `data-acp`
 * attributes as styling hooks; import `@agentconsent/react/theme.css`
 * for the default theme.
 *
 * Usage facts (`limits`) are declared once at the Root — the single source of
 * truth for consumption and the summary tally. The caps are controllable via
 * `value` / `onValueChange` or uncontrolled via `defaultValue` (a record of
 * limit id → cap). A limit with no cap entry is treated as having no limit set.
 */

/** Whether a limit meters money (`spend`) or a count of actions (`rate`). */
export type SpendLimitKind = "spend" | "rate";

/** The window a cap resets over. */
export type SpendLimitPeriod = "day" | "week" | "month";

/**
 * How a limit stands against its cap.
 * - `none`: no cap set — the agent is unbounded on this axis.
 * - `ok`: comfortably under the cap.
 * - `warning`: at or past 80% of the cap.
 * - `reached`: at or over the cap; the agent must ask before doing more.
 */
export type SpendLimitState = "none" | "ok" | "warning" | "reached";

/** A consumption fact: how much of a limit has been used so far this window. */
export interface SpendLimitUsage {
  /** Stable id, keyed to a `Limit` child and to the cap map. */
  id: string;
  /** Amount consumed this window — dollars for `spend`, a count for `rate`. */
  used: number;
}

interface SpendLimitsSummary {
  total: number;
  ok: number;
  warning: number;
  reached: number;
}

interface SpendLimitsContextValue {
  getUsed: (id: string) => number;
  getCap: (id: string) => number | null;
  setCap: (id: string, cap: number) => void;
  getState: (id: string) => SpendLimitState;
  summary: SpendLimitsSummary;
  titleId: string;
}

const SpendLimitsContext =
  React.createContext<SpendLimitsContextValue | null>(null);

function useSpendLimitsContext(part: string): SpendLimitsContextValue {
  const ctx = React.useContext(SpendLimitsContext);
  if (!ctx) {
    throw new Error(
      `SpendLimits.${part} must be rendered inside SpendLimits.Root`
    );
  }
  return ctx;
}

/** Controllable record state without a dependency. */
function useControllableMap(
  value: Record<string, number> | undefined,
  defaultValue: Record<string, number> | undefined,
  onValueChange: ((value: Record<string, number>) => void) | undefined
): [Record<string, number>, (id: string, cap: number) => void] {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<Record<string, number>>(
    () => defaultValue ?? {}
  );
  const current = isControlled ? value : internal;
  const setCap = React.useCallback(
    (id: string, cap: number) => {
      const next = { ...current, [id]: cap };
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [current, isControlled, onValueChange]
  );
  return [current, setCap];
}

/** The share of the cap consumed, above which a limit reads as "near". */
const WARNING_RATIO = 0.8;

function stateFor(used: number, cap: number | null): SpendLimitState {
  // Only an *absent* cap is unbounded. A cap of 0 is the tightest guardrail
  // there is — nothing more allowed — so it fails closed as "reached", never
  // open as "no limit set".
  if (cap == null) return "none";
  if (used >= cap) return "reached";
  if (used / cap >= WARNING_RATIO) return "warning";
  return "ok";
}

/* ── Root ─────────────────────────────────────────────────────────── */

export interface SpendLimitsRootProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect" | "defaultValue"> {
  /**
   * Consumption facts, one per limit — the single source of truth for usage and
   * the summary tally. Declare every limit you render a `Limit` for.
   */
  limits: SpendLimitUsage[];
  /** Limit id → cap (controlled). */
  value?: Record<string, number>;
  /** Initial limit id → cap (uncontrolled). */
  defaultValue?: Record<string, number>;
  /** Called with the full cap map whenever any cap changes. */
  onValueChange?: (value: Record<string, number>) => void;
  children: React.ReactNode;
}

const Root = React.forwardRef<HTMLElement, SpendLimitsRootProps>(
  function SpendLimitsRoot(
    { limits, value, defaultValue, onValueChange, children, ...rest },
    ref
  ) {
    const titleId = React.useId();
    const [caps, setCap] = useControllableMap(
      value,
      defaultValue,
      onValueChange
    );

    const ctx = React.useMemo<SpendLimitsContextValue>(() => {
      const usage = new Map(limits.map((l) => [l.id, l.used]));
      const getUsed = (id: string) => usage.get(id) ?? 0;
      const getCap = (id: string) =>
        Object.prototype.hasOwnProperty.call(caps, id) ? caps[id]! : null;
      // The summary counts what's actually in force: it walks the declared
      // limits (not the cap map), so a limit left uncapped still shows up and
      // the tally can never overstate how bounded the agent really is.
      const summary: SpendLimitsSummary = {
        total: limits.length,
        ok: 0,
        warning: 0,
        reached: 0,
      };
      for (const limit of limits) {
        const state = stateFor(limit.used, getCap(limit.id));
        if (state === "ok") summary.ok += 1;
        else if (state === "warning") summary.warning += 1;
        else if (state === "reached") summary.reached += 1;
      }
      return {
        getUsed,
        getCap,
        setCap,
        getState: (id) => stateFor(getUsed(id), getCap(id)),
        summary,
        titleId,
      };
    }, [limits, caps, setCap, titleId]);

    return (
      <SpendLimitsContext.Provider value={ctx}>
        <section
          ref={ref as React.Ref<HTMLElement>}
          role="group"
          aria-labelledby={titleId}
          data-acp="root"
          data-limits=""
          {...rest}
        >
          {children}
        </section>
      </SpendLimitsContext.Provider>
    );
  }
);

/* ── Header parts ─────────────────────────────────────────────────── */

export type SpendLimitsHeaderProps = React.HTMLAttributes<HTMLDivElement>;

function Header(props: SpendLimitsHeaderProps) {
  useSpendLimitsContext("Header");
  return <div data-acp="header" {...props} />;
}

export type SpendLimitsIconProps = React.HTMLAttributes<HTMLSpanElement>;

function Icon(props: SpendLimitsIconProps) {
  useSpendLimitsContext("Icon");
  return <span aria-hidden data-acp="icon" {...props} />;
}

export type SpendLimitsTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

/** The question the surface answers: "How far can Shopping Agent go alone?". */
function Title(props: SpendLimitsTitleProps) {
  const { titleId } = useSpendLimitsContext("Title");
  return <h2 id={titleId} data-acp="title" {...props} />;
}

export type SpendLimitsDescriptionProps =
  React.HTMLAttributes<HTMLParagraphElement>;

function Description(props: SpendLimitsDescriptionProps) {
  useSpendLimitsContext("Description");
  return <p data-acp="limits-description" {...props} />;
}

/* ── Summary ──────────────────────────────────────────────────────── */

export interface SpendLimitsSummaryProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "children"> {
  /**
   * Render function receiving the live per-state counts, so the surface can
   * state "1 cap reached · 1 near cap" at a glance.
   */
  children: (summary: SpendLimitsSummary) => React.ReactNode;
}

/** A live, at-a-glance read of how close the agent is to its guardrails. */
function Summary({ children, ...rest }: SpendLimitsSummaryProps) {
  const { summary } = useSpendLimitsContext("Summary");
  return (
    <p data-acp="limits-summary" aria-live="polite" {...rest}>
      {children(summary)}
    </p>
  );
}

/* ── List + Limit ─────────────────────────────────────────────────── */

export type SpendLimitsListProps = React.HTMLAttributes<HTMLUListElement>;

function List(props: SpendLimitsListProps) {
  useSpendLimitsContext("List");
  return <ul data-acp="limits-list" {...props} />;
}

const KIND_LABEL: Record<SpendLimitKind, string> = {
  spend: "Budget",
  rate: "Rate",
};

const STATE_NOTE: Record<SpendLimitState, string | null> = {
  none: null,
  ok: null,
  warning: "Near cap",
  reached: "Cap reached — agent will ask before doing more",
};

const PERIOD_PHRASE: Record<SpendLimitPeriod, string> = {
  day: "today",
  week: "this week",
  month: "this month",
};

function formatAmount(
  kind: SpendLimitKind,
  unit: string,
  n: number
): string {
  return kind === "spend"
    ? `${unit}${n.toLocaleString()}`
    : `${n.toLocaleString()} ${unit}`;
}

/** "used of cap" without repeating the unit noun for a rate limit. */
function formatRange(
  kind: SpendLimitKind,
  unit: string,
  used: number,
  cap: number
): string {
  return kind === "spend"
    ? `${unit}${used.toLocaleString()} of ${unit}${cap.toLocaleString()}`
    : `${used.toLocaleString()} of ${cap.toLocaleString()} ${unit}`;
}

export interface SpendLimitsLimitProps
  extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "id"> {
  /** Stable id used to look up usage and the cap. */
  id: string;
  /** Whether this limit meters money or a count of actions. */
  kind: SpendLimitKind;
  /**
   * The unit. For `spend`, a currency symbol shown before the amount ("$").
   * For `rate`, the noun shown after it ("emails", "API calls").
   */
  unit: string;
  /** The window this cap resets over. */
  period: SpendLimitPeriod;
  /** Plain-language name for the guardrail: "Purchases". */
  label: React.ReactNode;
  /** What the agent spends this budget on. */
  description?: React.ReactNode;
}

/**
 * One guardrail row: a labelled cap, a meter of usage against it, and an
 * editable number so the user can tighten or loosen the boundary in place. The
 * cap is a real number input, labelled per limit, so the guardrail is a single,
 * legible, keyboard-accessible control.
 */
function Limit({
  id,
  kind,
  unit,
  period,
  label,
  description,
  ...rest
}: SpendLimitsLimitProps) {
  const { getUsed, getCap, setCap, getState } = useSpendLimitsContext("Limit");
  const descId = React.useId();
  const capId = React.useId();
  const readoutId = React.useId();
  const used = getUsed(id);
  const cap = getCap(id);
  const state = getState(id);
  // A zero cap has no room at all — the meter reads full, not empty.
  const pct =
    cap == null ? 0 : cap > 0 ? Math.min(100, (used / cap) * 100) : 100;
  const readout =
    cap != null
      ? `${formatRange(kind, unit, used, cap)} ${PERIOD_PHRASE[period]}`
      : `${formatAmount(kind, unit, used)} used · no limit set`;
  const note = STATE_NOTE[state];
  const labelText = typeof label === "string" ? label : "this limit";

  return (
    <li
      data-acp="limits-limit"
      data-kind={kind}
      data-state={state}
      {...rest}
    >
      <div data-acp="limits-limit-body">
        <span data-acp="limits-limit-head">
          <span data-acp="limits-kind" data-kind={kind}>
            {KIND_LABEL[kind]}
          </span>
          <span data-acp="limits-limit-name">{label}</span>
        </span>
        {description != null && (
          <p id={descId} data-acp="limits-limit-description">
            {description}
          </p>
        )}
        <div data-acp="limits-meter" data-state={state}>
          <span data-acp="limits-meter-track" aria-hidden="true">
            <span
              data-acp="limits-meter-fill"
              data-state={state}
              style={{ width: `${pct}%` }}
            />
          </span>
          <span id={readoutId} data-acp="limits-meter-readout">
            {readout}
          </span>
        </div>
        {note != null && (
          <p data-acp="limits-status" data-state={state}>
            {note}
          </p>
        )}
      </div>
      <div data-acp="limits-cap">
        <label htmlFor={capId} data-acp="limits-cap-label">
          Cap
        </label>
        <span data-acp="limits-cap-field">
          {kind === "spend" && (
            <span data-acp="limits-cap-unit" aria-hidden="true">
              {unit}
            </span>
          )}
          <input
            id={capId}
            type="number"
            min={0}
            inputMode="numeric"
            data-acp="limits-cap-input"
            aria-label={`${labelText} cap, per ${period}`}
            aria-describedby={description != null ? descId : undefined}
            value={cap ?? ""}
            onChange={(event) => {
              // A cleared or negative field becomes a cap of 0 — the tightest
              // guardrail — so bad input always fails closed, never unbounded.
              const next = event.target.valueAsNumber;
              setCap(id, Number.isNaN(next) ? 0 : Math.max(0, next));
            }}
          />
          {kind === "rate" && (
            <span data-acp="limits-cap-unit">{unit}</span>
          )}
          <span data-acp="limits-cap-period">per {period}</span>
        </span>
      </div>
    </li>
  );
}

export const SpendLimits = {
  Root,
  Header,
  Icon,
  Title,
  Description,
  Summary,
  List,
  Limit,
};
