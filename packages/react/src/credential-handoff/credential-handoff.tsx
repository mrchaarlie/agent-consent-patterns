"use client";

import * as React from "react";

/**
 * Credential Handoff — an agent should never see a password or a card number.
 * When a task needs a secret, the agent steps aside and hands the exchange to a
 * trusted holder — a password manager, a passkey, the provider's own payment
 * page — which returns a scoped credential (a signed-in session, a one-time
 * token) rather than the secret itself. This surface makes that boundary
 * legible: it names who will hold the secret, states plainly that the agent is
 * excluded, and shows what comes back instead.
 *
 * Headless compound component. All parts render unstyled with `data-acp`
 * attributes as styling hooks; import `@agentconsent/react/theme.css`
 * for the default theme.
 *
 * A decision surface: `onHandoff` continues into the trusted holder,
 * `onCancel` backs out. It is deliberately not a form — it never collects the
 * secret itself.
 */

/** What kind of trusted holder the secret is handed to. */
export type HandoffHandlerKind =
  | "password-manager"
  | "passkey"
  | "payment"
  | "provider";

interface CredentialHandoffContextValue {
  onHandoff: () => void;
  onCancel: () => void;
  titleId: string;
}

const CredentialHandoffContext =
  React.createContext<CredentialHandoffContextValue | null>(null);

function useCredentialHandoffContext(
  part: string
): CredentialHandoffContextValue {
  const ctx = React.useContext(CredentialHandoffContext);
  if (!ctx) {
    throw new Error(
      `CredentialHandoff.${part} must be rendered inside CredentialHandoff.Root`
    );
  }
  return ctx;
}

/* ── Root ─────────────────────────────────────────────────────────── */

export interface CredentialHandoffRootProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  /** Called when the user continues into the trusted holder. */
  onHandoff: () => void;
  /** Called when the user backs out without handing off. */
  onCancel: () => void;
  children: React.ReactNode;
}

const Root = React.forwardRef<HTMLElement, CredentialHandoffRootProps>(
  function CredentialHandoffRoot({ onHandoff, onCancel, children, ...rest }, ref) {
    const titleId = React.useId();
    const ctx = React.useMemo(
      () => ({ onHandoff, onCancel, titleId }),
      [onHandoff, onCancel, titleId]
    );
    return (
      <CredentialHandoffContext.Provider value={ctx}>
        <section
          ref={ref as React.Ref<HTMLElement>}
          role="group"
          aria-labelledby={titleId}
          data-acp="root"
          data-handoff=""
          {...rest}
        >
          {children}
        </section>
      </CredentialHandoffContext.Provider>
    );
  }
);

/* ── Header parts ─────────────────────────────────────────────────── */

export type CredentialHandoffHeaderProps =
  React.HTMLAttributes<HTMLDivElement>;

function Header(props: CredentialHandoffHeaderProps) {
  useCredentialHandoffContext("Header");
  return <div data-acp="header" {...props} />;
}

export type CredentialHandoffIconProps = React.HTMLAttributes<HTMLSpanElement>;

function Icon(props: CredentialHandoffIconProps) {
  useCredentialHandoffContext("Icon");
  return <span aria-hidden data-acp="icon" {...props} />;
}

export type CredentialHandoffTitleProps =
  React.HTMLAttributes<HTMLHeadingElement>;

/** The task needing a secret: "Sign in to Delta" or "Pay Delta $340.00". */
function Title(props: CredentialHandoffTitleProps) {
  const { titleId } = useCredentialHandoffContext("Title");
  return <h2 id={titleId} data-acp="title" {...props} />;
}

export type CredentialHandoffDescriptionProps =
  React.HTMLAttributes<HTMLParagraphElement>;

function Description(props: CredentialHandoffDescriptionProps) {
  useCredentialHandoffContext("Description");
  return <p data-acp="handoff-description" {...props} />;
}

/* ── Handler (who will hold the secret) ───────────────────────────── */

const HANDLER_LABEL: Record<HandoffHandlerKind, string> = {
  "password-manager": "Password manager",
  passkey: "Passkey",
  payment: "Payment",
  provider: "Provider",
};

export interface CredentialHandoffHandlerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** What kind of holder this is — surfaced as a text badge. */
  kind: HandoffHandlerKind;
  /** The holder's name: "1Password", "Apple Pay", "Delta's payment page". */
  name: React.ReactNode;
}

/**
 * The trusted holder the secret goes to. Naming it — and its kind — is how the
 * user knows the exchange leaves the agent for something they already trust.
 */
function Handler({ kind, name, children, ...rest }: CredentialHandoffHandlerProps) {
  useCredentialHandoffContext("Handler");
  return (
    <div data-acp="handoff-handler" data-kind={kind} {...rest}>
      <span data-acp="handoff-handler-kind" data-kind={kind}>
        {HANDLER_LABEL[kind]}
      </span>
      <span data-acp="handoff-handler-name">{name}</span>
      {children}
    </div>
  );
}

/* ── Boundary (the agent is excluded) ─────────────────────────────── */

export type CredentialHandoffBoundaryProps =
  React.HTMLAttributes<HTMLDivElement>;

/**
 * The pattern's distinct element: an explicit statement that the agent is
 * outside this exchange. Rendered as a `note` so assistive tech announces the
 * exclusion, not just the visual fence.
 */
function Boundary(props: CredentialHandoffBoundaryProps) {
  useCredentialHandoffContext("Boundary");
  return <div role="note" data-acp="handoff-boundary" {...props} />;
}

/* ── Returns (what the agent gets back instead) ───────────────────── */

export type CredentialHandoffReturnsProps =
  React.HTMLAttributes<HTMLUListElement> & {
    /** Heading for the list; defaults to "The agent receives:". */
    legend?: React.ReactNode;
  };

/**
 * What the agent gets back in place of the secret — a scoped session, a
 * one-time token, a confirmation. Never the secret itself.
 */
function Returns({ legend, children, ...rest }: CredentialHandoffReturnsProps) {
  useCredentialHandoffContext("Returns");
  const labelId = React.useId();
  return (
    <div data-acp="handoff-returns">
      <p id={labelId} data-acp="handoff-returns-legend">
        {legend ?? "The agent receives:"}
      </p>
      <ul aria-labelledby={labelId} data-acp="handoff-returns-list" {...rest}>
        {children}
      </ul>
    </div>
  );
}

export type CredentialHandoffReturnProps =
  React.LiHTMLAttributes<HTMLLIElement>;

function Return(props: CredentialHandoffReturnProps) {
  useCredentialHandoffContext("Return");
  return <li data-acp="handoff-return" {...props} />;
}

/* ── Actions ──────────────────────────────────────────────────────── */

export type CredentialHandoffActionsProps =
  React.HTMLAttributes<HTMLDivElement>;

function Actions(props: CredentialHandoffActionsProps) {
  useCredentialHandoffContext("Actions");
  return <div data-acp="actions" {...props} />;
}

export type CredentialHandoffButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement>;

/** Continue into the trusted holder — the primary path. */
const Handoff = React.forwardRef<
  HTMLButtonElement,
  CredentialHandoffButtonProps
>(function CredentialHandoffHandoff({ onClick, ...rest }, ref) {
  const { onHandoff } = useCredentialHandoffContext("Handoff");
  return (
    <button
      ref={ref}
      type="button"
      data-acp="handoff-continue"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onHandoff();
      }}
      {...rest}
    />
  );
});

/** Back out without handing off. */
const Cancel = React.forwardRef<
  HTMLButtonElement,
  CredentialHandoffButtonProps
>(function CredentialHandoffCancel({ onClick, ...rest }, ref) {
  const { onCancel } = useCredentialHandoffContext("Cancel");
  return (
    <button
      ref={ref}
      type="button"
      data-acp="handoff-cancel"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onCancel();
      }}
      {...rest}
    />
  );
});

export const CredentialHandoff = {
  Root,
  Header,
  Icon,
  Title,
  Description,
  Handler,
  Boundary,
  Returns,
  Return,
  Actions,
  Handoff,
  Cancel,
};
