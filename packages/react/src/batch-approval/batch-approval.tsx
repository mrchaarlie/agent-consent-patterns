"use client";

import * as React from "react";

/**
 * Batch Approval — a review queue for a run of agent-proposed actions.
 * Reviewing agent work one modal at a time causes approval fatigue: the user
 * falls into a rhythm and starts rubber-stamping. Batch Approval gives the
 * queue triage affordances — select many, approve or reject as a group — while
 * deliberately refusing to let the highest-stakes items be swept up in a bulk
 * "approve all".
 *
 * Headless compound component. All parts render unstyled with `data-acp`
 * attributes as styling hooks; import `@agentconsent/react/theme.css`
 * for the default theme.
 *
 * The queue is declared once at the root (`items`) so selection eligibility
 * and counts have a single source of truth — mirroring Scoped Grant's
 * `requiredScopes`. An item flagged `requiresReview` is excluded from
 * select-all and from batch actions: it can only be approved or rejected
 * on its own row, so the item that most needs a human never gets a group pass.
 *
 * Selection is a set of item ids, controllable via `value` / `onValueChange`
 * or uncontrolled via `defaultValue`.
 */

export interface BatchApprovalItem {
  /** Stable id used in the selection set and in approve/reject payloads. */
  id: string;
  /**
   * When true the item is high-stakes: it is never selectable in bulk and is
   * excluded from select-all and the batch actions. It must be decided on its
   * own row. Irreversible or ambiguous actions belong here.
   */
  requiresReview?: boolean;
}

interface BatchApprovalContextValue {
  isSelected: (id: string) => boolean;
  toggle: (id: string) => void;
  requiresReview: (id: string) => boolean;
  /** Ids eligible for bulk selection (every item that isn't requiresReview). */
  selectableIds: string[];
  selectedIds: string[];
  selectedCount: number;
  selectableCount: number;
  /** True when every selectable item is selected (and there is at least one). */
  allSelected: boolean;
  /** True when some — but not all — selectable items are selected. */
  someSelected: boolean;
  setAllSelected: (checked: boolean) => void;
  approve: (ids: string[]) => void;
  reject: (ids: string[]) => void;
  titleId: string;
}

const BatchApprovalContext =
  React.createContext<BatchApprovalContextValue | null>(null);

function useBatchApprovalContext(part: string): BatchApprovalContextValue {
  const ctx = React.useContext(BatchApprovalContext);
  if (!ctx) {
    throw new Error(
      `BatchApproval.${part} must be rendered inside BatchApproval.Root`
    );
  }
  return ctx;
}

/** Per-row context so Item's action buttons know which id they act on. */
const BatchApprovalItemContext = React.createContext<{ id: string } | null>(
  null
);

function useItemId(part: string): string {
  const ctx = React.useContext(BatchApprovalItemContext);
  if (!ctx) {
    throw new Error(
      `BatchApproval.${part} must be rendered inside BatchApproval.Item`
    );
  }
  return ctx.id;
}

/** Controllable set state without pulling in a dependency. */
function useSelectedSet(
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

export interface BatchApprovalRootProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  /**
   * The queue, declared once so selection eligibility and counts have one
   * source of truth. Order is presentation-only; children still render each
   * row. Items marked `requiresReview` are excluded from bulk selection.
   */
  items: BatchApprovalItem[];
  /** Selected item ids (controlled). */
  value?: string[];
  /** Initial selected item ids (uncontrolled). */
  defaultValue?: string[];
  /** Called whenever the selection changes. */
  onValueChange?: (ids: string[]) => void;
  /** Called with the ids the user approved (one id per row, many for batch). */
  onApprove: (ids: string[]) => void;
  /** Called with the ids the user rejected. */
  onReject: (ids: string[]) => void;
  children: React.ReactNode;
}

const Root = React.forwardRef<HTMLElement, BatchApprovalRootProps>(
  function BatchApprovalRoot(
    {
      items,
      value,
      defaultValue,
      onValueChange,
      onApprove,
      onReject,
      children,
      ...rest
    },
    ref
  ) {
    const titleId = React.useId();
    const [selected, setSelected] = useSelectedSet(
      value,
      defaultValue,
      onValueChange
    );

    const reviewSet = React.useMemo(
      () => new Set(items.filter((i) => i.requiresReview).map((i) => i.id)),
      [items]
    );
    const selectableIds = React.useMemo(
      () => items.filter((i) => !i.requiresReview).map((i) => i.id),
      [items]
    );

    const ctx = React.useMemo<BatchApprovalContextValue>(() => {
      // Only selectable ids count toward selection state; a requiresReview id
      // can never enter the set (toggle guards it), but intersect defensively.
      const selectedSelectable = selectableIds.filter((id) =>
        selected.has(id)
      );
      const selectedCount = selectedSelectable.length;
      const selectableCount = selectableIds.length;
      const clearFrom = (prev: Set<string>, ids: string[]) => {
        const next = new Set(prev);
        for (const id of ids) next.delete(id);
        return next;
      };
      return {
        isSelected: (id) => selected.has(id),
        toggle: (id) => {
          if (reviewSet.has(id)) return; // never bulk-selectable
          setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
          });
        },
        requiresReview: (id) => reviewSet.has(id),
        selectableIds,
        selectedIds: selectedSelectable,
        selectedCount,
        selectableCount,
        allSelected: selectableCount > 0 && selectedCount === selectableCount,
        someSelected: selectedCount > 0 && selectedCount < selectableCount,
        setAllSelected: (checked) => {
          setSelected((prev) => {
            if (!checked) return clearFrom(prev, selectableIds);
            const next = new Set(prev);
            for (const id of selectableIds) next.add(id);
            return next;
          });
        },
        approve: (ids) => {
          onApprove(ids);
          setSelected((prev) => clearFrom(prev, ids));
        },
        reject: (ids) => {
          onReject(ids);
          setSelected((prev) => clearFrom(prev, ids));
        },
        titleId,
      };
    }, [
      selected,
      selectableIds,
      reviewSet,
      setSelected,
      onApprove,
      onReject,
      titleId,
    ]);

    return (
      <BatchApprovalContext.Provider value={ctx}>
        <section
          ref={ref as React.Ref<HTMLElement>}
          role="group"
          aria-labelledby={titleId}
          data-acp="root"
          data-batch=""
          {...rest}
        >
          {children}
        </section>
      </BatchApprovalContext.Provider>
    );
  }
);

/* ── Header parts ─────────────────────────────────────────────────── */

export type BatchApprovalHeaderProps = React.HTMLAttributes<HTMLDivElement>;

function Header(props: BatchApprovalHeaderProps) {
  useBatchApprovalContext("Header");
  return <div data-acp="header" {...props} />;
}

export type BatchApprovalIconProps = React.HTMLAttributes<HTMLSpanElement>;

function Icon(props: BatchApprovalIconProps) {
  useBatchApprovalContext("Icon");
  return <span aria-hidden data-acp="icon" {...props} />;
}

export type BatchApprovalTitleProps =
  React.HTMLAttributes<HTMLHeadingElement>;

/** What the queue is: "Agent proposed 6 actions". */
function Title(props: BatchApprovalTitleProps) {
  const { titleId } = useBatchApprovalContext("Title");
  return <h2 id={titleId} data-acp="title" {...props} />;
}

export type BatchApprovalDescriptionProps =
  React.HTMLAttributes<HTMLParagraphElement>;

function Description(props: BatchApprovalDescriptionProps) {
  useBatchApprovalContext("Description");
  return <p data-acp="batch-description" {...props} />;
}

/* ── Toolbar (batch triage) ───────────────────────────────────────── */

export type BatchApprovalToolbarProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * The batch triage bar. Holds `SelectAll`, a live `SelectionCount`, and the
 * batch `Approve` / `Reject` buttons — all scoped to the selectable items.
 */
function Toolbar(props: BatchApprovalToolbarProps) {
  useBatchApprovalContext("Toolbar");
  return <div data-acp="batch-toolbar" role="group" {...props} />;
}

export type BatchApprovalSelectAllProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  /** Label content; defaults to "Select all reviewable". */
  children?: React.ReactNode;
};

/**
 * Selects every *selectable* item at once — items marked `requiresReview` are
 * never included, so "select all" can never sweep up the item that most needs
 * a person. Reflects the mixed state as `indeterminate`.
 */
function SelectAll({ children, ...rest }: BatchApprovalSelectAllProps) {
  const { allSelected, someSelected, setAllSelected, selectableCount } =
    useBatchApprovalContext("SelectAll");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const inputId = React.useId();

  // indeterminate is a DOM-only property, not an attribute — set it on the
  // node after render. Reading from context (not state) so no extra render.
  React.useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = someSelected;
  }, [someSelected]);

  return (
    <div data-acp="batch-select-all" {...rest}>
      <input
        ref={inputRef}
        id={inputId}
        type="checkbox"
        data-acp="batch-select-all-checkbox"
        checked={allSelected}
        disabled={selectableCount === 0}
        onChange={(event) => setAllSelected(event.target.checked)}
      />
      <label htmlFor={inputId} data-acp="batch-select-all-label">
        {children ?? "Select all reviewable"}
      </label>
    </div>
  );
}

export interface BatchApprovalSelectionCountProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /**
   * Render function receiving the live counts, so a label can read
   * "3 of 5 selected" without lifting state. Defaults to "{n} selected".
   */
  children?: (state: {
    selectedCount: number;
    selectableCount: number;
  }) => React.ReactNode;
}

/** Live, polite count of what a batch action would touch. */
function SelectionCount({ children, ...rest }: BatchApprovalSelectionCountProps) {
  const { selectedCount, selectableCount } =
    useBatchApprovalContext("SelectionCount");
  return (
    <span data-acp="batch-selection-count" aria-live="polite" {...rest}>
      {children
        ? children({ selectedCount, selectableCount })
        : `${selectedCount} selected`}
    </span>
  );
}

export type BatchApprovalButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement>;

/** Batch-approve every selected item. Disabled when nothing is selected. */
const BatchApprove = React.forwardRef<
  HTMLButtonElement,
  BatchApprovalButtonProps
>(function BatchApprovalBatchApprove({ onClick, disabled, ...rest }, ref) {
  const { approve, selectedIds, selectedCount } =
    useBatchApprovalContext("BatchApprove");
  const isDisabled = disabled || selectedCount === 0;
  return (
    <button
      ref={ref}
      type="button"
      data-acp="approve"
      data-batch-action="approve"
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) approve(selectedIds);
      }}
      {...rest}
    />
  );
});

/** Batch-reject every selected item. Disabled when nothing is selected. */
const BatchReject = React.forwardRef<
  HTMLButtonElement,
  BatchApprovalButtonProps
>(function BatchApprovalBatchReject({ onClick, disabled, ...rest }, ref) {
  const { reject, selectedIds, selectedCount } =
    useBatchApprovalContext("BatchReject");
  const isDisabled = disabled || selectedCount === 0;
  return (
    <button
      ref={ref}
      type="button"
      data-acp="reject"
      data-batch-action="reject"
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) reject(selectedIds);
      }}
      {...rest}
    />
  );
});

/* ── List + Item ──────────────────────────────────────────────────── */

export type BatchApprovalListProps = React.HTMLAttributes<HTMLUListElement>;

function List(props: BatchApprovalListProps) {
  useBatchApprovalContext("List");
  return <ul data-acp="batch-list" {...props} />;
}

export interface BatchApprovalItemProps
  extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "id" | "title"> {
  /** Stable id; must appear in the root's `items`. */
  id: string;
  /** The proposed action, as a verb phrase: "Send reply to Dana Okafor". */
  title: React.ReactNode;
  /** One line of specifics under the title. */
  detail?: React.ReactNode;
}

/**
 * One row of the queue. Renders its own selection checkbox — disabled and
 * replaced with a "review individually" flag when the item `requiresReview`.
 * Per-row action buttons (`Item.Approve` / `Item.Reject`) go in `children`.
 */
function Item({ id, title, detail, children, ...rest }: BatchApprovalItemProps) {
  const { isSelected, toggle, requiresReview } =
    useBatchApprovalContext("Item");
  const inputId = React.useId();
  const detailId = React.useId();
  const selected = isSelected(id);
  const review = requiresReview(id);
  const itemCtx = React.useMemo(() => ({ id }), [id]);

  return (
    <BatchApprovalItemContext.Provider value={itemCtx}>
      <li
        data-acp="batch-item"
        data-selected={selected ? "" : undefined}
        data-review={review ? "" : undefined}
        {...rest}
      >
        <div data-acp="batch-item-select">
          {review ? (
            <span data-acp="batch-item-flag">Review individually</span>
          ) : (
            <input
              id={inputId}
              type="checkbox"
              data-acp="batch-item-checkbox"
              checked={selected}
              aria-describedby={detail != null ? detailId : undefined}
              onChange={() => toggle(id)}
            />
          )}
        </div>
        <div data-acp="batch-item-body">
          {review ? (
            <span data-acp="batch-item-title">{title}</span>
          ) : (
            <label htmlFor={inputId} data-acp="batch-item-title">
              {title}
            </label>
          )}
          {detail != null && (
            <p id={detailId} data-acp="batch-item-detail">
              {detail}
            </p>
          )}
        </div>
        {children != null && (
          <div data-acp="batch-item-actions">{children}</div>
        )}
      </li>
    </BatchApprovalItemContext.Provider>
  );
}

/** Approve just this row. */
const ItemApprove = React.forwardRef<
  HTMLButtonElement,
  BatchApprovalButtonProps
>(function BatchApprovalItemApprove({ onClick, ...rest }, ref) {
  const { approve } = useBatchApprovalContext("Item.Approve");
  const id = useItemId("Item.Approve");
  return (
    <button
      ref={ref}
      type="button"
      data-acp="batch-item-approve"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) approve([id]);
      }}
      {...rest}
    />
  );
});

/** Reject just this row. */
const ItemReject = React.forwardRef<
  HTMLButtonElement,
  BatchApprovalButtonProps
>(function BatchApprovalItemReject({ onClick, ...rest }, ref) {
  const { reject } = useBatchApprovalContext("Item.Reject");
  const id = useItemId("Item.Reject");
  return (
    <button
      ref={ref}
      type="button"
      data-acp="batch-item-reject"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) reject([id]);
      }}
      {...rest}
    />
  );
});

export const BatchApproval = {
  Root,
  Header,
  Icon,
  Title,
  Description,
  Toolbar,
  SelectAll,
  SelectionCount,
  BatchApprove,
  BatchReject,
  List,
  Item,
  ItemApprove,
  ItemReject,
};
