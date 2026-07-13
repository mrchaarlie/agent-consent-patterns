"use client";

import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

import type { ScopeAccess } from "../scoped-grant/scoped-grant";

/**
 * Progressive Scope — the in-context escalation request. Rather than asking
 * for every permission upfront (see Scoped Grant), the agent starts minimal
 * and asks for one more capability at the exact moment it needs it, tied to
 * the concrete action it's blocked on and justified in place.
 *
 * Headless compound component. All parts render unstyled with `data-acp`
 * attributes as styling hooks; import `@agentconsent/react/theme.css`
 * for the default theme.
 *
 * The distinct decision is breadth, not just yes/no: grant the capability for
 * only this blocked action (`onAllowOnce`), escalate it into the standing
 * grant (`onAllowAlways`), or refuse (`onDeny`). The time-duration ladder in
 * full ("for this task", "for an hour"…) belongs to Consent Memory.
 *
 * Two render modes mirror the other patterns:
 * - inline (default): a `role="group"` card in the task surface — the
 *   in-context default.
 * - modal (`asModal`): a Radix AlertDialog — focus is trapped, initial focus
 *   lands on deny (the least escalation), and Escape denies.
 */

export type { ScopeAccess };

interface ProgressiveScopeContextValue {
  access: ScopeAccess;
  onAllowOnce: () => void;
  onAllowAlways: () => void;
  onDeny: () => void;
  asModal: boolean;
  titleId: string;
}

const ProgressiveScopeContext =
  React.createContext<ProgressiveScopeContextValue | null>(null);

function useProgressiveScopeContext(
  part: string
): ProgressiveScopeContextValue {
  const ctx = React.useContext(ProgressiveScopeContext);
  if (!ctx) {
    throw new Error(
      `ProgressiveScope.${part} must be rendered inside ProgressiveScope.Root`
    );
  }
  return ctx;
}

/* ── Root ─────────────────────────────────────────────────────────── */

export interface ProgressiveScopeRootProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  /** Power level of the newly requested capability — surfaced as a text badge. */
  access?: ScopeAccess;
  /** Grant the capability for only the blocked action. */
  onAllowOnce: () => void;
  /** Escalate the capability into the standing grant. */
  onAllowAlways: () => void;
  /** Refuse the escalation (button, or Escape in modal mode). */
  onDeny: () => void;
  /** Render as a modal AlertDialog instead of an inline card. */
  asModal?: boolean;
  /** Modal mode only: whether the dialog is open (controlled). */
  open?: boolean;
  /** Modal mode only: called when the dialog requests an open-state change. */
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Root = React.forwardRef<HTMLElement, ProgressiveScopeRootProps>(
  function ProgressiveScopeRoot(
    {
      access = "read",
      onAllowOnce,
      onAllowAlways,
      onDeny,
      asModal = false,
      open,
      onOpenChange,
      children,
      ...rest
    },
    ref
  ) {
    const titleId = React.useId();
    const ctx = React.useMemo<ProgressiveScopeContextValue>(
      () => ({
        access,
        onAllowOnce,
        onAllowAlways,
        onDeny,
        asModal,
        titleId,
      }),
      [access, onAllowOnce, onAllowAlways, onDeny, asModal, titleId]
    );

    if (asModal) {
      return (
        <ProgressiveScopeContext.Provider value={ctx}>
          <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Portal>
              <AlertDialog.Overlay data-acp="overlay" />
              <AlertDialog.Content
                ref={ref as React.Ref<HTMLDivElement>}
                data-acp="root"
                data-escalation=""
                data-modal=""
                data-access={access}
                aria-describedby={undefined}
                onEscapeKeyDown={onDeny}
                {...rest}
              >
                {children}
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </ProgressiveScopeContext.Provider>
      );
    }

    return (
      <ProgressiveScopeContext.Provider value={ctx}>
        <section
          ref={ref as React.Ref<HTMLElement>}
          role="group"
          aria-labelledby={titleId}
          data-acp="root"
          data-escalation=""
          data-access={access}
          {...rest}
        >
          {children}
        </section>
      </ProgressiveScopeContext.Provider>
    );
  }
);

/* ── Header parts ─────────────────────────────────────────────────── */

export type ProgressiveScopeHeaderProps =
  React.HTMLAttributes<HTMLDivElement>;

function Header(props: ProgressiveScopeHeaderProps) {
  useProgressiveScopeContext("Header");
  return <div data-acp="header" {...props} />;
}

export type ProgressiveScopeIconProps =
  React.HTMLAttributes<HTMLSpanElement>;

function Icon(props: ProgressiveScopeIconProps) {
  useProgressiveScopeContext("Icon");
  return <span aria-hidden data-acp="icon" {...props} />;
}

export type ProgressiveScopeTitleProps =
  React.HTMLAttributes<HTMLHeadingElement>;

/** The ask, stated plainly: "Inbox Assistant needs to send email". */
function Title(props: ProgressiveScopeTitleProps) {
  const { asModal, titleId } = useProgressiveScopeContext("Title");
  if (asModal) {
    return <AlertDialog.Title data-acp="title" {...props} />;
  }
  return <h2 id={titleId} data-acp="title" {...props} />;
}

/* ── Context (what triggered the request) ─────────────────────────── */

export type ProgressiveScopeReasonProps =
  React.HTMLAttributes<HTMLParagraphElement>;

/**
 * Why the agent is asking now — tied to the concrete, blocked action.
 * "To reply to the vendor, it needs to send email on your behalf."
 */
function Reason(props: ProgressiveScopeReasonProps) {
  useProgressiveScopeContext("Reason");
  return <p data-acp="escalation-reason" {...props} />;
}

/* ── Request (the specific new capability) ────────────────────────── */

export interface ProgressiveScopeRequestProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Plain-language capability being requested: "Send email on your behalf". */
  label: React.ReactNode;
  /** What granting it lets the agent do. */
  description?: React.ReactNode;
}

const ACCESS_LABEL: Record<ScopeAccess, string> = {
  read: "Read",
  write: "Write",
  delete: "Delete",
};

function Request({ label, description, ...rest }: ProgressiveScopeRequestProps) {
  const { access } = useProgressiveScopeContext("Request");
  return (
    <div data-acp="request" data-access={access} {...rest}>
      <div data-acp="request-head">
        <span data-acp="request-access" data-access={access}>
          {ACCESS_LABEL[access]}
        </span>
        <span data-acp="request-name">{label}</span>
      </div>
      {description != null && (
        <p data-acp="request-description">{description}</p>
      )}
    </div>
  );
}

/* ── Current (what the agent already has) ─────────────────────────── */

export type ProgressiveScopeCurrentProps =
  React.HTMLAttributes<HTMLDivElement>;

/**
 * Frames the escalation as additive by naming the standing grant it builds
 * on: "Inbox Assistant can already read this label."
 */
function Current({ children, ...rest }: ProgressiveScopeCurrentProps) {
  useProgressiveScopeContext("Current");
  return (
    <div data-acp="escalation-current" {...rest}>
      <span aria-hidden data-acp="escalation-current-marker" />
      <span>{children}</span>
    </div>
  );
}

/* ── Actions ──────────────────────────────────────────────────────── */

export type ProgressiveScopeActionsProps =
  React.HTMLAttributes<HTMLDivElement>;

function Actions(props: ProgressiveScopeActionsProps) {
  useProgressiveScopeContext("Actions");
  return <div data-acp="actions" data-escalation-actions="" {...props} />;
}

export type ProgressiveScopeButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement>;

function makeAllowButton(
  displayName: string,
  hook: "allow-once" | "allow-always",
  pick: (
    ctx: ProgressiveScopeContextValue
  ) => () => void
) {
  const Component = React.forwardRef<
    HTMLButtonElement,
    ProgressiveScopeButtonProps
  >(function AllowButton({ onClick, ...rest }, ref) {
    const ctx = useProgressiveScopeContext(displayName);
    const action = pick(ctx);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) action();
    };
    const button = (
      <button
        ref={ref}
        type="button"
        data-acp={hook}
        onClick={handleClick}
        {...rest}
      />
    );
    return ctx.asModal ? (
      <AlertDialog.Action asChild>{button}</AlertDialog.Action>
    ) : (
      button
    );
  });
  Component.displayName = displayName;
  return Component;
}

const AllowOnce = makeAllowButton(
  "ProgressiveScopeAllowOnce",
  "allow-once",
  (ctx) => ctx.onAllowOnce
);

const AllowAlways = makeAllowButton(
  "ProgressiveScopeAllowAlways",
  "allow-always",
  (ctx) => ctx.onAllowAlways
);

const Deny = React.forwardRef<HTMLButtonElement, ProgressiveScopeButtonProps>(
  function ProgressiveScopeDeny({ onClick, ...rest }, ref) {
    const { onDeny, asModal } = useProgressiveScopeContext("Deny");
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) onDeny();
    };
    const button = (
      <button
        ref={ref}
        type="button"
        data-acp="deny"
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

export const ProgressiveScope = {
  Root,
  Header,
  Icon,
  Title,
  Reason,
  Request,
  Current,
  Actions,
  AllowOnce,
  AllowAlways,
  Deny,
};
