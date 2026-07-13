"use client";

import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

/**
 * Irreversibility Gate — a confirmation whose friction scales with the
 * consequence of the action. Reversible actions confirm in a click;
 * irreversible ones require a deliberate, legible gesture.
 *
 * Headless compound component. All parts render unstyled with `data-acp`
 * attributes as styling hooks; import `@agentconsent/react/theme.css`
 * for the default theme.
 *
 * The friction ladder is driven by `severity`:
 * - "reversible": confirm is enabled immediately, neutral styling.
 * - "undoable": confirm is enabled, but the gate advertises the undo
 *   window so the user knows the action is recoverable.
 * - "irreversible": confirm styling turns destructive, and — when a
 *   `confirmPhrase` is supplied — stays disabled until the user types
 *   that exact phrase. Type-to-confirm is the accessible, deliberate
 *   alternative to hold-to-confirm (which is invisible to screen readers
 *   and punishing for motor impairments).
 *
 * Two render modes mirror Action Preview:
 * - inline (default): a `role="group"` card
 * - modal (`asModal`): a Radix AlertDialog — focus is trapped, initial
 *   focus lands on cancel (the least destructive action), and Escape
 *   cancels. Controlled via `open` / `onOpenChange`.
 */

export type IrreversibilitySeverity =
  | "reversible"
  | "undoable"
  | "irreversible";

interface IrreversibilityGateContextValue {
  severity: IrreversibilitySeverity;
  onConfirm: () => void;
  onCancel: () => void;
  asModal: boolean;
  titleId: string;
  descId: string;
  fieldId: string;
  /** The phrase the user must type before confirming, or null if none. */
  requirePhrase: string | null;
  typed: string;
  setTyped: (value: string) => void;
  canConfirm: boolean;
}

const IrreversibilityGateContext =
  React.createContext<IrreversibilityGateContextValue | null>(null);

function useGateContext(part: string): IrreversibilityGateContextValue {
  const ctx = React.useContext(IrreversibilityGateContext);
  if (!ctx) {
    throw new Error(
      `IrreversibilityGate.${part} must be rendered inside IrreversibilityGate.Root`
    );
  }
  return ctx;
}

/* ── Root ─────────────────────────────────────────────────────────── */

export interface IrreversibilityGateRootProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  /** Called when the user confirms the action. */
  onConfirm: () => void;
  /** Called when the user backs out (button, or Escape in modal mode). */
  onCancel: () => void;
  /**
   * How hard the action is to undo. Scales the gate's friction and the
   * confirm button's styling. Defaults to "irreversible" — the case this
   * pattern exists for.
   */
  severity?: IrreversibilitySeverity;
  /**
   * When set and `severity` is "irreversible", the confirm action stays
   * disabled until the user types this exact phrase. Ignored at lower
   * severities, where type-to-confirm would be gratuitous friction.
   */
  confirmPhrase?: string;
  /** Render as a modal AlertDialog instead of an inline card. */
  asModal?: boolean;
  /** Modal mode only: whether the dialog is open (controlled). */
  open?: boolean;
  /** Modal mode only: called when the dialog requests an open-state change. */
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Root = React.forwardRef<HTMLElement, IrreversibilityGateRootProps>(
  function IrreversibilityGateRoot(
    {
      onConfirm,
      onCancel,
      severity = "irreversible",
      confirmPhrase,
      asModal = false,
      open,
      onOpenChange,
      children,
      ...rest
    },
    ref
  ) {
    const titleId = React.useId();
    const descId = React.useId();
    const fieldId = React.useId();
    const [typed, setTyped] = React.useState("");

    const requirePhrase =
      severity === "irreversible" && confirmPhrase ? confirmPhrase : null;
    const canConfirm =
      requirePhrase === null || typed.trim() === requirePhrase;

    // Reset the typed phrase whenever a modal gate closes, so a reopened
    // gate never starts pre-satisfied from a previous attempt. Done during
    // render (React's sanctioned "reset state on prop change" pattern)
    // rather than in an effect, which would cause a redundant re-render.
    const [prevOpen, setPrevOpen] = React.useState(open);
    if (asModal && open !== prevOpen) {
      setPrevOpen(open);
      if (open === false && typed !== "") setTyped("");
    }

    const ctx = React.useMemo<IrreversibilityGateContextValue>(
      () => ({
        severity,
        onConfirm,
        onCancel,
        asModal,
        titleId,
        descId,
        fieldId,
        requirePhrase,
        typed,
        setTyped,
        canConfirm,
      }),
      [
        severity,
        onConfirm,
        onCancel,
        asModal,
        titleId,
        descId,
        fieldId,
        requirePhrase,
        typed,
        canConfirm,
      ]
    );

    if (asModal) {
      return (
        <IrreversibilityGateContext.Provider value={ctx}>
          <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Portal>
              <AlertDialog.Overlay data-acp="overlay" />
              <AlertDialog.Content
                ref={ref as React.Ref<HTMLDivElement>}
                data-acp="root"
                data-gate=""
                data-modal=""
                data-severity={severity}
                aria-describedby={undefined}
                onEscapeKeyDown={onCancel}
                {...rest}
              >
                {children}
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </IrreversibilityGateContext.Provider>
      );
    }

    return (
      <IrreversibilityGateContext.Provider value={ctx}>
        <section
          ref={ref as React.Ref<HTMLElement>}
          role="group"
          aria-labelledby={titleId}
          data-acp="root"
          data-gate=""
          data-severity={severity}
          {...rest}
        >
          {children}
        </section>
      </IrreversibilityGateContext.Provider>
    );
  }
);

/* ── Header parts ─────────────────────────────────────────────────── */

export type IrreversibilityGateHeaderProps =
  React.HTMLAttributes<HTMLDivElement>;

function Header(props: IrreversibilityGateHeaderProps) {
  useGateContext("Header");
  return <div data-acp="header" {...props} />;
}

export type IrreversibilityGateIconProps =
  React.HTMLAttributes<HTMLSpanElement>;

function Icon(props: IrreversibilityGateIconProps) {
  const { severity } = useGateContext("Icon");
  return <span aria-hidden data-acp="gate-icon" data-severity={severity} {...props} />;
}

export type IrreversibilityGateTitleProps =
  React.HTMLAttributes<HTMLHeadingElement>;

/** The action, stated as a verb phrase: "Delete 1,240 files". */
function Title(props: IrreversibilityGateTitleProps) {
  const { asModal, titleId } = useGateContext("Title");
  if (asModal) {
    // Radix wires the dialog's aria-labelledby to its own Title id.
    return <AlertDialog.Title data-acp="title" {...props} />;
  }
  return <h2 id={titleId} data-acp="title" {...props} />;
}

export type IrreversibilityGateDescriptionProps =
  React.HTMLAttributes<HTMLParagraphElement>;

/** One line of framing above the enumerated consequences. */
function Description(props: IrreversibilityGateDescriptionProps) {
  const { descId } = useGateContext("Description");
  return <p id={descId} data-acp="gate-description" {...props} />;
}

/* ── Consequences ─────────────────────────────────────────────────── */

export type IrreversibilityGateConsequencesProps =
  React.HTMLAttributes<HTMLUListElement>;

function Consequences(props: IrreversibilityGateConsequencesProps) {
  useGateContext("Consequences");
  return <ul data-acp="gate-consequences" {...props} />;
}

export type IrreversibilityGateConsequenceProps =
  React.LiHTMLAttributes<HTMLLIElement>;

/** One concrete, specific effect: "Permanently deletes 1,240 files". */
function Consequence({ children, ...rest }: IrreversibilityGateConsequenceProps) {
  useGateContext("Consequence");
  return (
    <li data-acp="gate-consequence" {...rest}>
      <span aria-hidden data-acp="gate-consequence-marker" />
      <span data-acp="gate-consequence-text">{children}</span>
    </li>
  );
}

/* ── Type-to-confirm field ────────────────────────────────────────── */

export type IrreversibilityGateConfirmFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "id"
>;

/**
 * The type-to-confirm input. Renders only when the gate actually requires
 * a phrase (severity "irreversible" + a `confirmPhrase`); otherwise it
 * renders nothing, so demos can leave it in the tree unconditionally.
 */
function ConfirmField({
  children,
  ...rest
}: IrreversibilityGateConfirmFieldProps & { children?: React.ReactNode }) {
  const { requirePhrase, typed, setTyped, fieldId } =
    useGateContext("ConfirmField");
  if (requirePhrase === null) return null;
  return (
    <div data-acp="confirm-field">
      <label htmlFor={fieldId} data-acp="confirm-field-label">
        {children ?? (
          <>
            Type <code data-acp="confirm-field-phrase">{requirePhrase}</code> to
            confirm
          </>
        )}
      </label>
      <input
        id={fieldId}
        data-acp="confirm-field-input"
        type="text"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        value={typed}
        onChange={(event) => setTyped(event.target.value)}
        {...rest}
      />
    </div>
  );
}

/* ── Actions ──────────────────────────────────────────────────────── */

export type IrreversibilityGateActionsProps =
  React.HTMLAttributes<HTMLDivElement>;

function Actions(props: IrreversibilityGateActionsProps) {
  useGateContext("Actions");
  return <div data-acp="actions" {...props} />;
}

export type IrreversibilityGateButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const Confirm = React.forwardRef<
  HTMLButtonElement,
  IrreversibilityGateButtonProps
>(function IrreversibilityGateConfirm(
  { onClick, disabled, ...rest },
  ref
) {
  const { onConfirm, asModal, severity, canConfirm } =
    useGateContext("Confirm");
  const isDisabled = disabled || !canConfirm;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) onConfirm();
  };
  const button = (
    <button
      ref={ref}
      type="button"
      data-acp="confirm"
      data-severity={severity}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      onClick={handleClick}
      {...rest}
    />
  );
  // AlertDialog.Action closes the dialog after click and never receives
  // initial focus (Radix focuses Cancel), so confirm is always deliberate.
  return asModal ? (
    <AlertDialog.Action asChild>{button}</AlertDialog.Action>
  ) : (
    button
  );
});

const Cancel = React.forwardRef<
  HTMLButtonElement,
  IrreversibilityGateButtonProps
>(function IrreversibilityGateCancel({ onClick, ...rest }, ref) {
  const { onCancel, asModal } = useGateContext("Cancel");
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) onCancel();
  };
  const button = (
    <button
      ref={ref}
      type="button"
      data-acp="cancel"
      onClick={handleClick}
      {...rest}
    />
  );
  return asModal ? (
    <AlertDialog.Cancel asChild>{button}</AlertDialog.Cancel>
  ) : (
    button
  );
});

export const IrreversibilityGate = {
  Root,
  Header,
  Icon,
  Title,
  Description,
  Consequences,
  Consequence,
  ConfirmField,
  Actions,
  Confirm,
  Cancel,
};
