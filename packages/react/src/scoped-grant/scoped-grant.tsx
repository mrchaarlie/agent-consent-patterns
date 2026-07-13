"use client";

import * as React from "react";

/**
 * Scoped Grant — the consent screen for connecting an agent to a service.
 * Where an OAuth scope list says "access your email", this pattern makes the
 * capability granularity legible: which resources, and read vs. write vs.
 * delete, each as an individually reviewable, toggleable permission.
 *
 * Headless compound component. All parts render unstyled with `data-acp`
 * attributes as styling hooks; import `@agentconsent/react/theme.css`
 * for the default theme.
 *
 * Selection is a set of granted scope ids, controllable via `value` /
 * `onValueChange` or uncontrolled via `defaultValue`. Mandatory scopes are
 * declared once at the root (`requiredScopes`) so the grant payload has a
 * single source of truth and children never need to self-register.
 */

export type ScopeAccess = "read" | "write" | "delete";

interface ScopedGrantContextValue {
  isGranted: (id: string) => boolean;
  isRequired: (id: string) => boolean;
  toggle: (id: string) => void;
  granted: string[];
  count: number;
  onGrant: (ids: string[]) => void;
  onCancel?: () => void;
  titleId: string;
}

const ScopedGrantContext =
  React.createContext<ScopedGrantContextValue | null>(null);

function useScopedGrantContext(part: string): ScopedGrantContextValue {
  const ctx = React.useContext(ScopedGrantContext);
  if (!ctx) {
    throw new Error(
      `ScopedGrant.${part} must be rendered inside ScopedGrant.Root`
    );
  }
  return ctx;
}

/** Controllable set state without pulling in a dependency. */
function useGrantedSet(
  value: string[] | undefined,
  defaultValue: string[] | undefined,
  onValueChange: ((ids: string[]) => void) | undefined
): [Set<string>, (updater: (prev: Set<string>) => Set<string>) => void] {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<Set<string>>(
    () => new Set(defaultValue ?? [])
  );
  const current = React.useMemo(
    () => (isControlled ? new Set(value) : internal),
    [isControlled, value, internal]
  );
  const setValue = React.useCallback(
    (updater: (prev: Set<string>) => Set<string>) => {
      const next = updater(current);
      if (!isControlled) setInternal(next);
      onValueChange?.([...next]);
    },
    [current, isControlled, onValueChange]
  );
  return [current, setValue];
}

/* ── Root ─────────────────────────────────────────────────────────── */

export interface ScopedGrantRootProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  /** Granted scope ids (controlled). */
  value?: string[];
  /** Initial granted scope ids (uncontrolled). */
  defaultValue?: string[];
  /** Called whenever the granted set changes. */
  onValueChange?: (ids: string[]) => void;
  /**
   * Scope ids that are mandatory for the connection to function. They are
   * always granted, render as locked, and are always present in the grant
   * payload — declared here so payload/count have one source of truth.
   */
  requiredScopes?: string[];
  /** Called with the final granted ids when the user confirms the grant. */
  onGrant: (ids: string[]) => void;
  /** Called when the user declines to connect. */
  onCancel?: () => void;
  children: React.ReactNode;
}

const Root = React.forwardRef<HTMLFormElement, ScopedGrantRootProps>(
  function ScopedGrantRoot(
    {
      value,
      defaultValue,
      onValueChange,
      requiredScopes,
      onGrant,
      onCancel,
      children,
      ...rest
    },
    ref
  ) {
    const titleId = React.useId();
    const [selected, setSelected] = useGrantedSet(
      value,
      defaultValue,
      onValueChange
    );

    const requiredSet = React.useMemo(
      () => new Set(requiredScopes ?? []),
      [requiredScopes]
    );

    // Effective grant = user selection ∪ required scopes.
    const granted = React.useMemo(() => {
      const set = new Set(selected);
      for (const id of requiredSet) set.add(id);
      return [...set];
    }, [selected, requiredSet]);

    const ctx = React.useMemo<ScopedGrantContextValue>(() => {
      const grantedSet = new Set(granted);
      return {
        isGranted: (id) => grantedSet.has(id),
        isRequired: (id) => requiredSet.has(id),
        toggle: (id) => {
          if (requiredSet.has(id)) return; // locked
          setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
          });
        },
        granted,
        count: grantedSet.size,
        onGrant,
        onCancel,
        titleId,
      };
    }, [granted, requiredSet, setSelected, onGrant, onCancel, titleId]);

    return (
      <ScopedGrantContext.Provider value={ctx}>
        <form
          ref={ref}
          data-acp="root"
          data-grant=""
          aria-labelledby={titleId}
          onSubmit={(event) => {
            event.preventDefault();
            onGrant(granted);
          }}
          {...rest}
        >
          {children}
        </form>
      </ScopedGrantContext.Provider>
    );
  }
);

/* ── Header parts ─────────────────────────────────────────────────── */

export type ScopedGrantHeaderProps = React.HTMLAttributes<HTMLDivElement>;

function Header(props: ScopedGrantHeaderProps) {
  useScopedGrantContext("Header");
  return <div data-acp="header" {...props} />;
}

export type ScopedGrantIconProps = React.HTMLAttributes<HTMLSpanElement>;

function Icon(props: ScopedGrantIconProps) {
  useScopedGrantContext("Icon");
  return <span aria-hidden data-acp="icon" {...props} />;
}

export type ScopedGrantTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

/** What is being connected to what: "Connect Inbox Assistant to Gmail". */
function Title(props: ScopedGrantTitleProps) {
  const { titleId } = useScopedGrantContext("Title");
  return <h2 id={titleId} data-acp="title" {...props} />;
}

export type ScopedGrantDescriptionProps =
  React.HTMLAttributes<HTMLParagraphElement>;

function Description(props: ScopedGrantDescriptionProps) {
  useScopedGrantContext("Description");
  return <p data-acp="grant-description" {...props} />;
}

/* ── Group (per-resource scoping) ─────────────────────────────────── */

export interface ScopedGrantGroupProps
  extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, "resource"> {
  /** The resource this cluster of scopes applies to: "Gmail". */
  label: React.ReactNode;
  /** How the resource is narrowed: "Board 2026 label only". */
  resource?: React.ReactNode;
}

/**
 * Clusters scopes by the resource they touch, so "read" against one folder
 * and "delete" against the whole account are never conflated. Renders a
 * fieldset/legend so assistive tech announces the grouping.
 */
function Group({ label, resource, children, ...rest }: ScopedGrantGroupProps) {
  useScopedGrantContext("Group");
  return (
    <fieldset data-acp="grant-group" {...rest}>
      <legend data-acp="grant-group-legend">
        <span data-acp="grant-group-label">{label}</span>
        {resource != null && (
          <span data-acp="grant-group-resource">{resource}</span>
        )}
      </legend>
      {children}
    </fieldset>
  );
}

/* ── Scope (one capability) ───────────────────────────────────────── */

export interface ScopedGrantScopeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  /** Stable id used in the granted set and `requiredScopes`. */
  id: string;
  /** Power level of this capability — surfaced as a text badge, never color alone. */
  access: ScopeAccess;
  /** Plain-language capability name: "Send messages on your behalf". */
  label: React.ReactNode;
  /** What granting it actually lets the agent do. */
  description?: React.ReactNode;
}

const ACCESS_LABEL: Record<ScopeAccess, string> = {
  read: "Read",
  write: "Write",
  delete: "Delete",
};

function Scope({
  id,
  access,
  label,
  description,
  ...rest
}: ScopedGrantScopeProps) {
  const { isGranted, isRequired, toggle } = useScopedGrantContext("Scope");
  const inputId = React.useId();
  const descId = React.useId();
  const granted = isGranted(id);
  const required = isRequired(id);
  return (
    <div
      data-acp="scope"
      data-access={access}
      data-granted={granted ? "" : undefined}
      data-required={required ? "" : undefined}
      {...rest}
    >
      <input
        type="checkbox"
        id={inputId}
        data-acp="scope-checkbox"
        checked={granted}
        disabled={required}
        aria-describedby={description != null ? descId : undefined}
        onChange={() => toggle(id)}
      />
      <div data-acp="scope-body">
        <label htmlFor={inputId} data-acp="scope-label">
          <span data-acp="scope-access" data-access={access}>
            {ACCESS_LABEL[access]}
          </span>
          <span data-acp="scope-name">{label}</span>
          {required && (
            <span data-acp="scope-required-tag"> · required</span>
          )}
        </label>
        {description != null && (
          <p id={descId} data-acp="scope-description">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Actions ──────────────────────────────────────────────────────── */

export type ScopedGrantActionsProps = React.HTMLAttributes<HTMLDivElement>;

function Actions(props: ScopedGrantActionsProps) {
  useScopedGrantContext("Actions");
  return <div data-acp="actions" {...props} />;
}

export interface ScopedGrantGrantProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /**
   * Button content. As a render function it receives the live grant count,
   * so the label can read "Grant 3 permissions" without lifting state.
   */
  children:
    | React.ReactNode
    | ((state: { count: number }) => React.ReactNode);
}

const Grant = React.forwardRef<HTMLButtonElement, ScopedGrantGrantProps>(
  function ScopedGrantGrant({ children, ...rest }, ref) {
    const { count } = useScopedGrantContext("Grant");
    return (
      <button ref={ref} type="submit" data-acp="grant" {...rest}>
        {typeof children === "function" ? children({ count }) : children}
      </button>
    );
  }
);

export type ScopedGrantCancelProps =
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const Cancel = React.forwardRef<HTMLButtonElement, ScopedGrantCancelProps>(
  function ScopedGrantCancel({ onClick, ...rest }, ref) {
    const { onCancel } = useScopedGrantContext("Cancel");
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) onCancel?.();
    };
    return (
      <button
        ref={ref}
        type="button"
        data-acp="cancel"
        onClick={handleClick}
        {...rest}
      />
    );
  }
);

export const ScopedGrant = {
  Root,
  Header,
  Icon,
  Title,
  Description,
  Group,
  Scope,
  Actions,
  Grant,
  Cancel,
};
