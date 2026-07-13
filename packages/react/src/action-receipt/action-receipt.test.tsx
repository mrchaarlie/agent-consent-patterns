import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

import { ActionReceipt } from "./action-receipt";
import type { ActionReceiptRootProps } from "./action-receipt";

// color-contrast needs real layout; jsdom has none. Contrast is verified
// against the token palette in the site's Playwright/axe pass instead.
const AXE_OPTIONS: axe.RunOptions = {
  rules: { "color-contrast": { enabled: false } },
};

function Demo(props: Partial<ActionReceiptRootProps> & { onUndo?: () => void }) {
  const { onUndo = () => {}, ...rootProps } = props;
  return (
    <ActionReceipt.Root {...rootProps}>
      <ActionReceipt.Header>
        <ActionReceipt.Icon>✉</ActionReceipt.Icon>
        <ActionReceipt.Title>Sent email to Dana Ito</ActionReceipt.Title>
        <ActionReceipt.Outcome />
      </ActionReceipt.Header>
      <ActionReceipt.Details>
        <ActionReceipt.Detail label="To">dana@example.com</ActionReceipt.Detail>
        <ActionReceipt.Detail label="Subject">Q3 board deck</ActionReceipt.Detail>
      </ActionReceipt.Details>
      <ActionReceipt.Authority grant="task: board prep" via="you approved · Jul 8" />
      <ActionReceipt.Meta>
        <ActionReceipt.MetaItem label="When">
          Jul 9, 2:14 PM
        </ActionReceipt.MetaItem>
      </ActionReceipt.Meta>
      <ActionReceipt.Actions>
        <ActionReceipt.Undo onClick={onUndo}>Undo send</ActionReceipt.Undo>
      </ActionReceipt.Actions>
    </ActionReceipt.Root>
  );
}

describe("ActionReceipt", () => {
  it("renders an article labelled by what the agent did", () => {
    render(<Demo />);
    expect(
      screen.getByRole("article", { name: "Sent email to Dana Ito" })
    ).toBeInTheDocument();
  });

  it("shows the outcome as text, defaulting to completed", () => {
    render(<Demo />);
    const badge = screen.getByText("Completed");
    expect(badge).toHaveAttribute("data-outcome", "completed");
  });

  it("names the authority the action ran under", () => {
    render(<Demo />);
    expect(screen.getByText("task: board prep")).toBeInTheDocument();
    expect(screen.getByText("you approved · Jul 8")).toBeInTheDocument();
  });

  it("offers a working undo for a reversible action", async () => {
    const onUndo = vi.fn();
    render(<Demo onUndo={onUndo} />);
    await userEvent.click(screen.getByRole("button", { name: "Undo send" }));
    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  it("renders an inert note instead of undo for an irreversible action", () => {
    render(<Demo reversibility="irreversible" />);
    expect(
      screen.queryByRole("button", { name: "Undo send" })
    ).not.toBeInTheDocument();
    expect(screen.getByText("Can't be undone")).toBeInTheDocument();
  });

  it("renders an undone note once the action has been undone", () => {
    render(<Demo outcome="undone" />);
    expect(
      screen.queryByRole("button", { name: "Undo send" })
    ).not.toBeInTheDocument();
    // "Undone" appears both as the outcome badge and the undo note; scope to the
    // note's hook so the assertion is unambiguous.
    const note = screen.getByText("Undone", {
      selector: "[data-acp='receipt-undo-note']",
    });
    expect(note).toHaveAttribute("data-state", "undone");
  });

  it("carries the outcome on the root as a styling hook", () => {
    render(<Demo outcome="failed" />);
    expect(
      screen.getByRole("article", { name: "Sent email to Dana Ito" })
    ).toHaveAttribute("data-outcome", "failed");
  });

  it("does not steal focus on mount", () => {
    render(<Demo />);
    expect(document.activeElement).toBe(document.body);
  });

  it("has no axe violations", async () => {
    const { container } = render(<Demo />);
    const results = await axe.run(container, AXE_OPTIONS);
    expect(results.violations).toEqual([]);
  });
});
