"use client";

import * as React from "react";

import type { ScopeAccess } from "../scoped-grant/scoped-grant";

/**
 * Connection Card — the settings tile that makes a standing grant visible
 * after the fact. Once an agent is connected to a service, the connection
 * tends to vanish from the user's awareness; this card keeps it legible:
 * current grant state, recency of use, status, and a revoke affordance.
 *
 * Headless compound component. All parts render unstyled with `data-acp`
 * attributes as styling hooks; import `@agentconsent/react/theme.css`
 * for the default theme.
 *
 * Unlike the decision-flow patterns, this is a display surface: it takes no
 * approve/reject callbacks of its own. Wire the management buttons
 * (`Action`) to your own handlers — a destructive revoke can compose with the
 * Irreversibility Gate.
 */

export type { ScopeAccess };

export type ConnectionStatus =
  | "active"
  | "paused"
  | "needs-reauth"
  | "expired";

interface ConnectionCardContextValue {
  status: ConnectionStatus;
  titleId: string;
}

const ConnectionCardContext =
  React.createContext<ConnectionCardContextValue | null>(null);

function useConnectionCardContext(part: string): ConnectionCardContextValue {
  const ctx = React.useContext(ConnectionCardContext);
  if (!ctx) {
    throw new Error(
      `ConnectionCard.${part} must be rendered inside ConnectionCard.Root`
    );
  }
  return ctx;
}

/* ── Root ─────────────────────────────────────────────────────────── */

export interface ConnectionCardRootProps
  extends React.HTMLAttributes<HTMLElement> {
  /** Lifecycle state of the connection — drives the status badge + styling. */
  status?: ConnectionStatus;
  children: React.ReactNode;
}

const Root = React.forwardRef<HTMLElement, ConnectionCardRootProps>(
  function ConnectionCardRoot({ status = "active", children, ...rest }, ref) {
    const titleId = React.useId();
    const ctx = React.useMemo<ConnectionCardContextValue>(
      () => ({ status, titleId }),
      [status, titleId]
    );
    return (
      <ConnectionCardContext.Provider value={ctx}>
        <article
          ref={ref as React.Ref<HTMLElement>}
          aria-labelledby={titleId}
          data-acp="root"
          data-connection=""
          data-status={status}
          {...rest}
        >
          {children}
        </article>
      </ConnectionCardContext.Provider>
    );
  }
);

/* ── Header parts ─────────────────────────────────────────────────── */

export type ConnectionCardHeaderProps = React.HTMLAttributes<HTMLDivElement>;

function Header(props: ConnectionCardHeaderProps) {
  useConnectionCardContext("Header");
  return <div data-acp="header" data-connection-header="" {...props} />;
}

export type ConnectionCardIconProps = React.HTMLAttributes<HTMLSpanElement>;

function Icon(props: ConnectionCardIconProps) {
  useConnectionCardContext("Icon");
  return <span aria-hidden data-acp="icon" {...props} />;
}

export type ConnectionCardTitleProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Who is connected to what: "Inbox Assistant → Gmail". Rendered as a
 * non-heading element with an id so the card's accessible name works at any
 * position in a settings list without imposing a heading level.
 */
function Title(props: ConnectionCardTitleProps) {
  const { titleId } = useConnectionCardContext("Title");
  return <div id={titleId} data-acp="title" {...props} />;
}

export type ConnectionCardStatusProps =
  React.HTMLAttributes<HTMLSpanElement>;

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  active: "Active",
  paused: "Paused",
  "needs-reauth": "Needs re-auth",
  expired: "Expired",
};

/**
 * The lifecycle badge. Defaults to the status label as text (never color
 * alone); pass children to override the wording.
 */
function Status({ children, ...rest }: ConnectionCardStatusProps) {
  const { status } = useConnectionCardContext("Status");
  return (
    <span data-acp="connection-status" data-status={status} {...rest}>
      {children ?? STATUS_LABEL[status]}
    </span>
  );
}

/* ── Scope summary ────────────────────────────────────────────────── */

export type ConnectionCardScopesProps = React.HTMLAttributes<HTMLUListElement>;

function Scopes(props: ConnectionCardScopesProps) {
  useConnectionCardContext("Scopes");
  return <ul data-acp="connection-scopes" {...props} />;
}

const ACCESS_LABEL: Record<ScopeAccess, string> = {
  read: "Read",
  write: "Write",
  delete: "Delete",
};

export interface ConnectionCardScopeProps
  extends React.LiHTMLAttributes<HTMLLIElement> {
  /** Access level of this active capability — surfaced as a text badge. */
  access: ScopeAccess;
  /** Plain-language capability name: "Send messages". */
  children: React.ReactNode;
}

function Scope({ access, children, ...rest }: ConnectionCardScopeProps) {
  useConnectionCardContext("Scope");
  return (
    <li data-acp="connection-scope" data-access={access} {...rest}>
      <span data-acp="connection-access" data-access={access}>
        {ACCESS_LABEL[access]}
      </span>
      <span data-acp="connection-scope-name">{children}</span>
    </li>
  );
}

/* ── Meta (recency, dates) ────────────────────────────────────────── */

export type ConnectionCardMetaProps = React.HTMLAttributes<HTMLDListElement>;

function Meta(props: ConnectionCardMetaProps) {
  useConnectionCardContext("Meta");
  return <dl data-acp="connection-meta" {...props} />;
}

export interface ConnectionCardMetaItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The fact's name: "Last used", "Connected". */
  label: React.ReactNode;
  children: React.ReactNode;
}

function MetaItem({ label, children, ...rest }: ConnectionCardMetaItemProps) {
  useConnectionCardContext("MetaItem");
  return (
    <div data-acp="connection-meta-item" {...rest}>
      <dt data-acp="connection-meta-label">{label}</dt>
      <dd data-acp="connection-meta-value">{children}</dd>
    </div>
  );
}

/* ── Actions ──────────────────────────────────────────────────────── */

export type ConnectionCardActionsProps = React.HTMLAttributes<HTMLDivElement>;

function Actions(props: ConnectionCardActionsProps) {
  useConnectionCardContext("Actions");
  return <div data-acp="actions" data-connection-actions="" {...props} />;
}

export interface ConnectionCardActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** "danger" styles a destructive management action such as revoke. */
  tone?: "default" | "danger";
}

const Action = React.forwardRef<HTMLButtonElement, ConnectionCardActionProps>(
  function ConnectionCardAction({ tone = "default", type, ...rest }, ref) {
    useConnectionCardContext("Action");
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        data-acp="connection-action"
        data-tone={tone}
        {...rest}
      />
    );
  }
);

export const ConnectionCard = {
  Root,
  Header,
  Icon,
  Title,
  Status,
  Scopes,
  Scope,
  Meta,
  MetaItem,
  Actions,
  Action,
};
