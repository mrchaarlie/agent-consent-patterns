import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

import { BatchApproval } from "./batch-approval";
import type { BatchApprovalItem } from "./batch-approval";

// color-contrast needs real layout; jsdom has none. Contrast is verified
// against the token palette in the site's Playwright/axe pass instead.
const AXE_OPTIONS: axe.RunOptions = {
  rules: { "color-contrast": { enabled: false } },
};

const ITEMS: BatchApprovalItem[] = [
  { id: "a" },
  { id: "b" },
  { id: "c" },
  { id: "d", requiresReview: true },
];

const TITLES: Record<string, string> = {
  a: "Reply to Dana",
  b: "Reply to Sam",
  c: "Archive newsletter",
  d: "Delete invoice thread",
};

function Demo(props: {
  onApprove?: (ids: string[]) => void;
  onReject?: (ids: string[]) => void;
  defaultValue?: string[];
}) {
  return (
    <BatchApproval.Root
      items={ITEMS}
      defaultValue={props.defaultValue}
      onApprove={props.onApprove ?? (() => {})}
      onReject={props.onReject ?? (() => {})}
    >
      <BatchApproval.Header>
        <BatchApproval.Icon>▤</BatchApproval.Icon>
        <BatchApproval.Title>Agent proposed 4 actions</BatchApproval.Title>
      </BatchApproval.Header>
      <BatchApproval.Description>
        Review before the agent sends them.
      </BatchApproval.Description>
      <BatchApproval.Toolbar>
        <BatchApproval.SelectAll />
        <BatchApproval.SelectionCount />
        <BatchApproval.BatchReject>Reject selected</BatchApproval.BatchReject>
        <BatchApproval.BatchApprove>Approve selected</BatchApproval.BatchApprove>
      </BatchApproval.Toolbar>
      <BatchApproval.List>
        {ITEMS.map((item) => (
          <BatchApproval.Item key={item.id} id={item.id} title={TITLES[item.id]}>
            <BatchApproval.ItemReject>Reject</BatchApproval.ItemReject>
            <BatchApproval.ItemApprove>Approve</BatchApproval.ItemApprove>
          </BatchApproval.Item>
        ))}
      </BatchApproval.List>
    </BatchApproval.Root>
  );
}

describe("BatchApproval", () => {
  it("renders a group labelled by the queue title", () => {
    render(<Demo />);
    expect(
      screen.getByRole("group", { name: "Agent proposed 4 actions" })
    ).toBeInTheDocument();
  });

  it("does not steal focus on mount", () => {
    render(<Demo />);
    expect(document.activeElement).toBe(document.body);
  });

  it("renders a selection checkbox for selectable items only", () => {
    render(<Demo />);
    // 3 selectable items + 1 select-all = 4 checkboxes; the review item has none.
    expect(screen.getAllByRole("checkbox")).toHaveLength(4);
    expect(screen.getByText("Review individually")).toBeInTheDocument();
  });

  it("select-all covers every selectable item but not the review item", async () => {
    const onApprove = vi.fn();
    render(<Demo onApprove={onApprove} />);
    await userEvent.click(
      screen.getByRole("checkbox", { name: "Select all reviewable" })
    );
    expect(
      screen.getByRole("button", { name: "Approve selected" })
    ).toBeEnabled();
    await userEvent.click(
      screen.getByRole("button", { name: "Approve selected" })
    );
    expect(onApprove).toHaveBeenCalledTimes(1);
    expect(onApprove.mock.calls[0]![0].sort()).toEqual(["a", "b", "c"]);
  });

  it("reports the live selection count", async () => {
    render(<Demo />);
    expect(screen.getByText("0 selected")).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("checkbox", { name: "Reply to Dana" })
    );
    expect(screen.getByText("1 selected")).toBeInTheDocument();
  });

  it("disables the batch actions when nothing is selected", () => {
    render(<Demo />);
    expect(
      screen.getByRole("button", { name: "Approve selected" })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Reject selected" })
    ).toBeDisabled();
  });

  it("batch-approves exactly the selected ids", async () => {
    const onApprove = vi.fn();
    render(<Demo onApprove={onApprove} />);
    await userEvent.click(
      screen.getByRole("checkbox", { name: "Reply to Dana" })
    );
    await userEvent.click(
      screen.getByRole("checkbox", { name: "Archive newsletter" })
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Approve selected" })
    );
    expect(onApprove).toHaveBeenCalledTimes(1);
    expect(onApprove.mock.calls[0]![0].sort()).toEqual(["a", "c"]);
  });

  it("clears approved items from the selection", async () => {
    render(<Demo />);
    await userEvent.click(
      screen.getByRole("checkbox", { name: "Reply to Dana" })
    );
    expect(screen.getByText("1 selected")).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Approve selected" })
    );
    expect(screen.getByText("0 selected")).toBeInTheDocument();
  });

  it("approves a single row from its own action", async () => {
    const onApprove = vi.fn();
    render(<Demo onApprove={onApprove} />);
    const reviewRow = screen
      .getByText("Delete invoice thread")
      .closest("[data-acp='batch-item']") as HTMLElement;
    await userEvent.click(
      within(reviewRow).getByRole("button", { name: "Approve" })
    );
    expect(onApprove).toHaveBeenCalledWith(["d"]);
  });

  it("rejects a single row from its own action", async () => {
    const onReject = vi.fn();
    render(<Demo onReject={onReject} />);
    const row = screen
      .getByText("Reply to Sam")
      .closest("[data-acp='batch-item']") as HTMLElement;
    await userEvent.click(
      within(row).getByRole("button", { name: "Reject" })
    );
    expect(onReject).toHaveBeenCalledWith(["b"]);
  });

  it("has no axe violations", async () => {
    const { container } = render(<Demo defaultValue={["a"]} />);
    const results = await axe.run(container, AXE_OPTIONS);
    expect(results.violations).toEqual([]);
  });
});
