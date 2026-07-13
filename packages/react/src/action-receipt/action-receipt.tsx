"use client";

import * as React from "react";

/**
 * Action Receipt — consent doesn't end at approval. After an agent acts, the
 * user needs a durable record of what it did, under what authority, and when —
 * with a way to undo it where the action allows. Without a receipt, an approval
 * (or a standing grant firing on its own) vanishes the moment it executes, and
 * the user has no surface to notice, question, or reverse it.
 *
 * Headless compound component. All parts render unstyled with `data-acp`
 * attributes as styling hooks; import `@agentconsent/react/theme.css`
 * for the default theme.
 *
 * Like Connection Card, this is a display surface: it takes no decision
 * callbacks of its own. The one interactive part, `Undo`, is wired to your
 * handler — and it renders as an inert note (not a button) when the action was
 * irreversible or has already been undone, so the receipt can never offer an
 * undo it can't honour.
 */

/** How the action turned out. Drives the outcome badge and styling. */
export type ReceiptOutcome = "completed" | "undone" | "failed";

/** Whether the action can be reversed — governs whether Undo is offered. */
export type ReceiptReversibility = "reversible" | "irreversible";

interface ActionReceiptContextValue {
  outcome: ReceiptOutcome;
  reversibility: ReceiptReversibility;
  titleId: string;
}

const ActionReceiptContext =
  React.createContext<ActionReceiptContextValue | null>(null);

function useActionReceiptContext(part: string): ActionReceiptContextValue {
  const ctx = React.useContext(ActionReceiptContext);
  if (!ctx) {
    throw new Error(
      `ActionReceipt.${part} must be rendered inside ActionReceipt.Root`
    );
  }
  return ctx;
}

/* ── Root ─────────────────────────────────────────────────────────── */

export interface ActionReceiptRootProps
  extends React.HTMLAttributes<HTMLElement> {
  /** How the action turned out. Defaults to `completed`. */
  outcome?: ReceiptOutcome;
  /**
   * Whether the action can be reversed. Defaults to `reversible`. An
   * `irreversible` receipt renders no undo button — only an honest note.
   */
  reversibility?: ReceiptReversibility;
  children: React.ReactNode;
}

const Root = React.forwardRef<HTMLElement, ActionReceiptRootProps>(
  function ActionReceiptRoot(
    { outcome = "completed", reversibility = "reversible", children, ...rest },
    ref
  ) {
    const titleId = React.useId();
    const ctx = React.useMemo<ActionReceiptContextValue>(
      () => ({ outcome, reversibility, titleId }),
      [outcome, reversibility, titleId]
    );
    return (
      <ActionReceiptContext.Provider value={ctx}>
        <article
          ref={ref as React.Ref<HTMLElement>}
          aria-labelledby={titleId}
          data-acp="root"
          data-receipt=""
          data-outcome={outcome}
          {...rest}
        >
          {children}
        </article>
      </ActionReceiptContext.Provider>
    );
  }
);

/* ── Header parts ─────────────────────────────────────────────────── */

export type ActionReceiptHeaderProps = React.HTMLAttributes<HTMLDivElement>;

function Header(props: ActionReceiptHeaderProps) {
  useActionReceiptContext("Header");
  return <div data-acp="header" data-receipt-header="" {...props} />;
}

export type ActionReceiptIconProps = React.HTMLAttributes<HTMLSpanElement>;

function Icon(props: ActionReceiptIconProps) {
  useActionReceiptContext("Icon");
  return <span aria-hidden data-acp="icon" {...props} />;
}

export type ActionReceiptTitleProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * What the agent did, in the past tense: "Sent email to Dana Ito". A non-heading
 * element with an id, so a receipt slots into an activity log at any depth
 * without imposing a heading level.
 */
function Title(props: ActionReceiptTitleProps) {
  const { titleId } = useActionReceiptContext("Title");
  return <div id={titleId} data-acp="title" {...props} />;
}

export type ActionReceiptOutcomeProps = React.HTMLAttributes<HTMLSpanElement>;

const OUTCOME_LABEL: Record<ReceiptOutcome, string> = {
  completed: "Completed",
  undone: "Undone",
  failed: "Failed",
};

/**
 * The outcome badge, as text (never color alone). Pass children to override the
 * wording.
 */
function Outcome({ children, ...rest }: ActionReceiptOutcomeProps) {
  const { outcome } = useActionReceiptContext("Outcome");
  return (
    <span data-acp="receipt-outcome" data-outcome={outcome} {...rest}>
      {children ?? OUTCOME_LABEL[outcome]}
    </span>
  );
}

/* ── Details (what was done) ──────────────────────────────────────── */

export type ActionReceiptDetailsProps =
  React.HTMLAttributes<HTMLDListElement>;

function Details(props: ActionReceiptDetailsProps) {
  useActionReceiptContext("Details");
  return <dl data-acp="receipt-details" {...props} />;
}

export interface ActionReceiptDetailProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The fact's name: "To", "Amount", "File". */
  label: React.ReactNode;
  /** The exact value acted on — never a summary. */
  children: React.ReactNode;
}

function Detail({ label, children, ...rest }: ActionReceiptDetailProps) {
  useActionReceiptContext("Detail");
  return (
    <div data-acp="receipt-detail" {...rest}>
      <dt data-acp="receipt-detail-label">{label}</dt>
      <dd data-acp="receipt-detail-value">{children}</dd>
    </div>
  );
}

/* ── Authority (what permitted the action) ────────────────────────── */

export interface ActionReceiptAuthorityProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The grant, approval, or standing rule the action ran under. */
  grant: React.ReactNode;
  /** How that authority was established: "you approved · Jul 8", "always-allow". */
  via?: React.ReactNode;
}

/**
 * Under what authority the action was taken — the receipt's distinct job. It
 * ties the act back to the consent that permitted it, so a user reviewing the
 * log can see *why* the agent was allowed to do this, not just that it did.
 */
function Authority({ grant, via, children, ...rest }: ActionReceiptAuthorityProps) {
  useActionReceiptContext("Authority");
  return (
    <div data-acp="receipt-authority" {...rest}>
      <span data-acp="receipt-authority-label">Under authority</span>
      <span data-acp="receipt-authority-grant">{grant}</span>
      {via != null && <span data-acp="receipt-authority-via">{via}</span>}
      {children}
    </div>
  );
}

/* ── Meta (when, and other facts) ─────────────────────────────────── */

export type ActionReceiptMetaProps = React.HTMLAttributes<HTMLDListElement>;

function Meta(props: ActionReceiptMetaProps) {
  useActionReceiptContext("Meta");
  return <dl data-acp="receipt-meta" {...props} />;
}

export interface ActionReceiptMetaItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The fact's name: "When", "Reference". */
  label: React.ReactNode;
  children: React.ReactNode;
}

function MetaItem({ label, children, ...rest }: ActionReceiptMetaItemProps) {
  useActionReceiptContext("MetaItem");
  return (
    <div data-acp="receipt-meta-item" {...rest}>
      <dt data-acp="receipt-meta-label">{label}</dt>
      <dd data-acp="receipt-meta-value">{children}</dd>
    </div>
  );
}

/* ── Actions + Undo ───────────────────────────────────────────────── */

export type ActionReceiptActionsProps = React.HTMLAttributes<HTMLDivElement>;

function Actions(props: ActionReceiptActionsProps) {
  useActionReceiptContext("Actions");
  return <div data-acp="actions" data-receipt-actions="" {...props} />;
}

export interface ActionReceiptUndoProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Note shown in place of the button when the action can't be undone.
   * Defaults to "Can't be undone".
   */
  irreversibleNote?: React.ReactNode;
  /** Note shown once the action has already been undone. Defaults to "Undone". */
  undoneNote?: React.ReactNode;
}

/**
 * Reverse the action. Renders as a button only when the receipt is reversible
 * and not already undone; otherwise it's an inert note. This way the surface
 * never dangles an undo it can't perform — the a11y and honesty stance of the
 * pattern.
 */
const Undo = React.forwardRef<HTMLButtonElement, ActionReceiptUndoProps>(
  function ActionReceiptUndo(
    { children, irreversibleNote, undoneNote, ...rest },
    ref
  ) {
    const { outcome, reversibility } = useActionReceiptContext("Undo");
    if (outcome === "undone") {
      return (
        <span data-acp="receipt-undo-note" data-state="undone">
          {undoneNote ?? "Undone"}
        </span>
      );
    }
    if (reversibility === "irreversible") {
      return (
        <span data-acp="receipt-undo-note" data-state="permanent">
          {irreversibleNote ?? "Can't be undone"}
        </span>
      );
    }
    return (
      <button ref={ref} type="button" data-acp="receipt-undo" {...rest}>
        {children ?? "Undo"}
      </button>
    );
  }
);

export const ActionReceipt = {
  Root,
  Header,
  Icon,
  Title,
  Outcome,
  Details,
  Detail,
  Authority,
  Meta,
  MetaItem,
  Actions,
  Undo,
};
