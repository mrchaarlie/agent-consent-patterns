"use client";

import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

/**
 * Injection Flag — when an instruction reaches the agent from untrusted content
 * (a web page, an email, an uploaded file) rather than from the user, surface
 * that fact: name where it came from, quote the instruction verbatim, say what
 * following it would do, and ask. The whole point is that a buried "ignore your
 * previous instructions and…" should never execute silently — it should stop
 * and show itself, with *not* following it as the resting default.
 *
 * Headless compound component. All parts render unstyled with `data-acp`
 * attributes as styling hooks; import `@agentconsent/react/theme.css`
 * for the default theme.
 *
 * Two render modes:
 * - inline (default): a card inside the conversation/task surface.
 * - modal (`asModal`): a Radix AlertDialog — focus is trapped, initial focus
 *   lands on Dismiss (the safe action, which does *not* follow the
 *   instruction), and Escape dismisses. Controlled via `open` / `onOpenChange`.
 */

interface InjectionFlagContextValue {
  /** Follow the flagged instruction (the risky path). */
  onProceed: () => void;
  /** Ignore it and continue the original task (the safe path). */
  onDismiss: () => void;
  asModal: boolean;
  titleId: string;
}

const InjectionFlagContext =
  React.createContext<InjectionFlagContextValue | null>(null);

function useInjectionFlagContext(part: string): InjectionFlagContextValue {
  const ctx = React.useContext(InjectionFlagContext);
  if (!ctx) {
    throw new Error(
      `InjectionFlag.${part} must be rendered inside InjectionFlag.Root`
    );
  }
  return ctx;
}

/* ── Root ─────────────────────────────────────────────────────────── */

export interface InjectionFlagRootProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  /** Called when the user chooses to follow the flagged instruction. */
  onProceed: () => void;
  /**
   * Called when the user declines to follow it (button, or Escape in modal
   * mode). This is the safe path — the agent keeps doing what the *user* asked.
   */
  onDismiss: () => void;
  /** Render as a modal AlertDialog instead of an inline card. */
  asModal?: boolean;
  /** Modal mode only: whether the dialog is open (controlled). */
  open?: boolean;
  /** Modal mode only: called when the dialog requests an open-state change. */
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Root = React.forwardRef<HTMLElement, InjectionFlagRootProps>(
  function InjectionFlagRoot(
    { onProceed, onDismiss, asModal = false, open, onOpenChange, children, ...rest },
    ref
  ) {
    const titleId = React.useId();
    const ctx = React.useMemo(
      () => ({ onProceed, onDismiss, asModal, titleId }),
      [onProceed, onDismiss, asModal, titleId]
    );

    if (asModal) {
      return (
        <InjectionFlagContext.Provider value={ctx}>
          <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Portal>
              <AlertDialog.Overlay data-acp="overlay" />
              <AlertDialog.Content
                ref={ref as React.Ref<HTMLDivElement>}
                data-acp="root"
                data-injection=""
                data-modal=""
                aria-describedby={undefined}
                onEscapeKeyDown={onDismiss}
                {...rest}
              >
                {children}
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </InjectionFlagContext.Provider>
      );
    }

    return (
      <InjectionFlagContext.Provider value={ctx}>
        <section
          ref={ref as React.Ref<HTMLElement>}
          role="group"
          aria-labelledby={titleId}
          data-acp="root"
          data-injection=""
          {...rest}
        >
          {children}
        </section>
      </InjectionFlagContext.Provider>
    );
  }
);

/* ── Header parts ─────────────────────────────────────────────────── */

export type InjectionFlagHeaderProps = React.HTMLAttributes<HTMLDivElement>;

function Header(props: InjectionFlagHeaderProps) {
  useInjectionFlagContext("Header");
  return <div data-acp="header" {...props} />;
}

export type InjectionFlagIconProps = React.HTMLAttributes<HTMLSpanElement>;

function Icon(props: InjectionFlagIconProps) {
  useInjectionFlagContext("Icon");
  return <span aria-hidden data-acp="icon" {...props} />;
}

export type InjectionFlagTitleProps =
  React.HTMLAttributes<HTMLHeadingElement>;

/** The situation, stated plainly: "An instruction came from untrusted content". */
function Title(props: InjectionFlagTitleProps) {
  const { asModal, titleId } = useInjectionFlagContext("Title");
  if (asModal) {
    // Radix wires the dialog's aria-labelledby to its own Title id; don't override.
    return <AlertDialog.Title data-acp="title" {...props} />;
  }
  return <h2 id={titleId} data-acp="title" {...props} />;
}

export type InjectionFlagDescriptionProps =
  React.HTMLAttributes<HTMLParagraphElement>;

/** Plain-language framing of why this is being surfaced. */
function Description(props: InjectionFlagDescriptionProps) {
  useInjectionFlagContext("Description");
  return <p data-acp="injection-description" {...props} />;
}

/* ── Source (provenance of the instruction) ───────────────────────── */

export interface InjectionFlagSourceProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The untrusted origin type: "a web page", "an email", "an uploaded file". */
  origin: React.ReactNode;
  /** A specific pointer to it: a URL, a sender, a filename. */
  location?: React.ReactNode;
}

/**
 * Where the instruction came from — the provenance that makes it untrusted.
 * Carried in text (and an untrusted accent), never implied by styling alone.
 */
function Source({ origin, location, children, ...rest }: InjectionFlagSourceProps) {
  useInjectionFlagContext("Source");
  return (
    <div data-acp="injection-source" {...rest}>
      <span data-acp="injection-source-label">Came from</span>
      <span data-acp="injection-origin">{origin}</span>
      {location != null && (
        <span data-acp="injection-location">{location}</span>
      )}
      {children}
    </div>
  );
}

/* ── Quote (the instruction, verbatim) ────────────────────────────── */

export interface InjectionFlagQuoteProps
  extends React.HTMLAttributes<HTMLQuoteElement> {
  /** Label above the quote; defaults to "The instruction reads:". */
  label?: React.ReactNode;
  /** The flagged instruction, quoted exactly as it appeared. */
  children: React.ReactNode;
}

/**
 * The injected instruction, quoted verbatim and visually fenced. Showing the
 * literal text — not a paraphrase — is the heart of the pattern: the user sees
 * exactly what is trying to steer the agent.
 */
function Quote({ label, children, ...rest }: InjectionFlagQuoteProps) {
  useInjectionFlagContext("Quote");
  const labelId = React.useId();
  return (
    <figure data-acp="injection-quote-figure">
      <figcaption id={labelId} data-acp="injection-quote-label">
        {label ?? "The instruction reads:"}
      </figcaption>
      <blockquote
        data-acp="injection-quote"
        aria-labelledby={labelId}
        {...rest}
      >
        {children}
      </blockquote>
    </figure>
  );
}

/* ── Consequence (what following it would do) ─────────────────────── */

export type InjectionFlagConsequenceProps =
  React.HTMLAttributes<HTMLParagraphElement>;

/**
 * What the agent would do if it followed the instruction, stated concretely so
 * the stakes of "Proceed" are legible: "I would forward your inbox to an
 * outside address."
 */
function Consequence(props: InjectionFlagConsequenceProps) {
  useInjectionFlagContext("Consequence");
  return <p data-acp="injection-consequence" {...props} />;
}

/* ── Actions ──────────────────────────────────────────────────────── */

export type InjectionFlagActionsProps = React.HTMLAttributes<HTMLDivElement>;

function Actions(props: InjectionFlagActionsProps) {
  useInjectionFlagContext("Actions");
  return <div data-acp="actions" {...props} />;
}

export type InjectionFlagButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Follow the flagged instruction — the risky path, styled subordinate so the UI
 * never nudges toward obeying untrusted content.
 */
const Proceed = React.forwardRef<HTMLButtonElement, InjectionFlagButtonProps>(
  function InjectionFlagProceed({ onClick, ...rest }, ref) {
    const { onProceed, asModal } = useInjectionFlagContext("Proceed");
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) onProceed();
    };
    const button = (
      <button
        ref={ref}
        type="button"
        data-acp="injection-proceed"
        onClick={handleClick}
        {...rest}
      />
    );
    return asModal ? (
      <AlertDialog.Action asChild>{button}</AlertDialog.Action>
    ) : (
      button
    );
  }
);

/**
 * Ignore the instruction and keep doing what the user asked — the safe path.
 * In modal mode this is the AlertDialog cancel, so Radix gives it initial focus
 * and it never sits under the pointer of an accidental proceed.
 */
const Dismiss = React.forwardRef<HTMLButtonElement, InjectionFlagButtonProps>(
  function InjectionFlagDismiss({ onClick, ...rest }, ref) {
    const { onDismiss, asModal } = useInjectionFlagContext("Dismiss");
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) onDismiss();
    };
    const button = (
      <button
        ref={ref}
        type="button"
        data-acp="injection-dismiss"
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

export const InjectionFlag = {
  Root,
  Header,
  Icon,
  Title,
  Description,
  Source,
  Quote,
  Consequence,
  Actions,
  Proceed,
  Dismiss,
};
