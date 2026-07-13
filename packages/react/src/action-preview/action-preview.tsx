"use client";

import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

/**
 * Action Preview — show exactly what an agent is about to do before it
 * executes, and collect an explicit approve/reject decision.
 *
 * Headless compound component. All parts render unstyled with `data-acp`
 * attributes as styling hooks; import `@agentconsent/react/theme.css`
 * for the default theme.
 *
 * Two render modes:
 * - inline (default): a card inside the conversation/task surface
 * - modal (`asModal`): a Radix AlertDialog — focus is trapped, initial
 *   focus lands on the reject (least destructive) action, and Escape
 *   rejects. Modal mode is controlled via `open` / `onOpenChange`.
 */

export type ActionPreviewConsequence = "reversible" | "irreversible";

interface ActionPreviewContextValue {
  consequence: ActionPreviewConsequence;
  onApprove: () => void;
  onReject: () => void;
  asModal: boolean;
  titleId: string;
}

const ActionPreviewContext =
  React.createContext<ActionPreviewContextValue | null>(null);

function useActionPreviewContext(part: string): ActionPreviewContextValue {
  const ctx = React.useContext(ActionPreviewContext);
  if (!ctx) {
    throw new Error(
      `ActionPreview.${part} must be rendered inside ActionPreview.Root`
    );
  }
  return ctx;
}

/* ── Root ─────────────────────────────────────────────────────────── */

export interface ActionPreviewRootProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  /** Called when the user approves the action. */
  onApprove: () => void;
  /** Called when the user rejects the action (button, or Escape in modal mode). */
  onReject: () => void;
  /**
   * How hard the action is to undo. Irreversible consequence shifts the
   * approve button to destructive styling and changes nothing else —
   * friction weighting beyond that belongs to the Irreversibility Gate
   * pattern.
   */
  consequence?: ActionPreviewConsequence;
  /** Render as a modal AlertDialog instead of an inline card. */
  asModal?: boolean;
  /** Modal mode only: whether the dialog is open (controlled). */
  open?: boolean;
  /** Modal mode only: called when the dialog requests an open-state change. */
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Root = React.forwardRef<HTMLElement, ActionPreviewRootProps>(
  function ActionPreviewRoot(
    {
      onApprove,
      onReject,
      consequence = "reversible",
      asModal = false,
      open,
      onOpenChange,
      children,
      ...rest
    },
    ref
  ) {
    const titleId = React.useId();
    const ctx = React.useMemo(
      () => ({ consequence, onApprove, onReject, asModal, titleId }),
      [consequence, onApprove, onReject, asModal, titleId]
    );

    if (asModal) {
      return (
        <ActionPreviewContext.Provider value={ctx}>
          <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Portal>
              <AlertDialog.Overlay data-acp="overlay" />
              <AlertDialog.Content
                ref={ref as React.Ref<HTMLDivElement>}
                data-acp="root"
                data-modal=""
                data-consequence={consequence}
                aria-describedby={undefined}
                onEscapeKeyDown={onReject}
                {...rest}
              >
                {children}
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </ActionPreviewContext.Provider>
      );
    }

    return (
      <ActionPreviewContext.Provider value={ctx}>
        <section
          ref={ref as React.Ref<HTMLElement>}
          role="group"
          aria-labelledby={titleId}
          data-acp="root"
          data-consequence={consequence}
          {...rest}
        >
          {children}
        </section>
      </ActionPreviewContext.Provider>
    );
  }
);

/* ── Header parts ─────────────────────────────────────────────────── */

export type ActionPreviewHeaderProps = React.HTMLAttributes<HTMLDivElement>;

function Header(props: ActionPreviewHeaderProps) {
  useActionPreviewContext("Header");
  return <div data-acp="header" {...props} />;
}

export type ActionPreviewIconProps = React.HTMLAttributes<HTMLSpanElement>;

function Icon(props: ActionPreviewIconProps) {
  useActionPreviewContext("Icon");
  return <span aria-hidden data-acp="icon" {...props} />;
}

export type ActionPreviewTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

/** The action, stated as a verb phrase: "Send email to Dana Ito". */
function Title(props: ActionPreviewTitleProps) {
  const { asModal, titleId } = useActionPreviewContext("Title");
  if (asModal) {
    // Radix wires the dialog's aria-labelledby to its own Title id; don't override it.
    return <AlertDialog.Title data-acp="title" {...props} />;
  }
  return <h2 id={titleId} data-acp="title" {...props} />;
}

/* ── Fields ───────────────────────────────────────────────────────── */

export type ActionPreviewFieldsProps = React.HTMLAttributes<HTMLDListElement>;

function Fields(props: ActionPreviewFieldsProps) {
  useActionPreviewContext("Fields");
  return <dl data-acp="fields" {...props} />;
}

export interface ActionPreviewFieldProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The fact's name: "To", "Amount", "File". */
  label: React.ReactNode;
  /** The fact's exact value — never a summary. */
  children: React.ReactNode;
}

function Field({ label, children, ...rest }: ActionPreviewFieldProps) {
  useActionPreviewContext("Field");
  return (
    <div data-acp="field" {...rest}>
      <dt data-acp="field-label">{label}</dt>
      <dd data-acp="field-value">{children}</dd>
    </div>
  );
}

/* ── Content (long payloads, collapsible) ─────────────────────────── */

export interface ActionPreviewContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Toggle label: "Message body", "Full diff". */
  label: React.ReactNode;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

function Content({
  label,
  defaultExpanded = false,
  children,
  ...rest
}: ActionPreviewContentProps) {
  useActionPreviewContext("Content");
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const bodyId = React.useId();
  return (
    <div data-acp="content" data-expanded={expanded ? "" : undefined} {...rest}>
      <button
        type="button"
        data-acp="content-toggle"
        aria-expanded={expanded}
        aria-controls={bodyId}
        onClick={() => setExpanded((v) => !v)}
      >
        {label}
      </button>
      <div id={bodyId} data-acp="content-body" hidden={!expanded}>
        {children}
      </div>
    </div>
  );
}

/* ── Source (who is asking, under what authority) ─────────────────── */

export interface ActionPreviewSourceProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The agent requesting approval: "Inbox Assistant". */
  agent: React.ReactNode;
  /** The authority it acts under: task name, grant, or trigger. */
  authority?: React.ReactNode;
}

function Source({ agent, authority, children, ...rest }: ActionPreviewSourceProps) {
  useActionPreviewContext("Source");
  return (
    <div data-acp="source" {...rest}>
      <span data-acp="source-agent">{agent}</span>
      {authority != null && (
        <span data-acp="source-authority">{authority}</span>
      )}
      {children}
    </div>
  );
}

/* ── Actions ──────────────────────────────────────────────────────── */

export type ActionPreviewActionsProps = React.HTMLAttributes<HTMLDivElement>;

function Actions(props: ActionPreviewActionsProps) {
  useActionPreviewContext("Actions");
  return <div data-acp="actions" {...props} />;
}

export type ActionPreviewButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const Approve = React.forwardRef<HTMLButtonElement, ActionPreviewButtonProps>(
  function ActionPreviewApprove({ onClick, ...rest }, ref) {
    const { onApprove, asModal, consequence } =
      useActionPreviewContext("Approve");
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) onApprove();
    };
    const button = (
      <button
        ref={ref}
        type="button"
        data-acp="approve"
        data-consequence={consequence}
        onClick={handleClick}
        {...rest}
      />
    );
    // AlertDialog.Action closes the dialog after click; approval must never
    // receive initial focus, which Radix guarantees by focusing Cancel.
    return asModal ? (
      <AlertDialog.Action asChild>{button}</AlertDialog.Action>
    ) : (
      button
    );
  }
);

const Reject = React.forwardRef<HTMLButtonElement, ActionPreviewButtonProps>(
  function ActionPreviewReject({ onClick, ...rest }, ref) {
    const { onReject, asModal } = useActionPreviewContext("Reject");
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) onReject();
    };
    const button = (
      <button
        ref={ref}
        type="button"
        data-acp="reject"
        onClick={handleClick}
        {...rest}
      />
    );
    return asModal ? (
      <AlertDialog.Cancel asChild>{button}</AlertDialog.Cancel>
    ) : (
      button
    );
  }
);

export const ActionPreview = {
  Root,
  Header,
  Icon,
  Title,
  Fields,
  Field,
  Content,
  Source,
  Actions,
  Approve,
  Reject,
};
