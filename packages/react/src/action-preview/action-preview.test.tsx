import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

import { ActionPreview } from "./action-preview";
import type { ActionPreviewRootProps } from "./action-preview";

// color-contrast needs real layout; jsdom has none. Contrast is verified
// against the token palette in the site's Playwright/axe pass instead.
const AXE_OPTIONS: axe.RunOptions = {
  rules: { "color-contrast": { enabled: false } },
};

function Demo(props: Partial<ActionPreviewRootProps>) {
  return (
    <ActionPreview.Root onApprove={() => {}} onReject={() => {}} {...props}>
      <ActionPreview.Header>
        <ActionPreview.Icon>✉</ActionPreview.Icon>
        <ActionPreview.Title>Send email to Dana Ito</ActionPreview.Title>
      </ActionPreview.Header>
      <ActionPreview.Fields>
        <ActionPreview.Field label="To">dana@example.com</ActionPreview.Field>
        <ActionPreview.Field label="Subject">Q3 board deck</ActionPreview.Field>
      </ActionPreview.Fields>
      <ActionPreview.Content label="Message body">
        Hi Dana — attached is the Q3 deck for Thursday.
      </ActionPreview.Content>
      <ActionPreview.Source
        agent="Inbox Assistant"
        authority="task: board prep"
      />
      <ActionPreview.Actions>
        <ActionPreview.Reject>Don&apos;t send</ActionPreview.Reject>
        <ActionPreview.Approve>Send email</ActionPreview.Approve>
      </ActionPreview.Actions>
    </ActionPreview.Root>
  );
}

describe("ActionPreview (inline)", () => {
  it("renders a group labelled by the action title", () => {
    render(<Demo />);
    expect(
      screen.getByRole("group", { name: "Send email to Dana Ito" })
    ).toBeInTheDocument();
  });

  it("renders fields as definition list rows with exact values", () => {
    render(<Demo />);
    expect(screen.getByText("To")).toBeInTheDocument();
    expect(screen.getByText("dana@example.com")).toBeInTheDocument();
  });

  it("calls onApprove when the approve button is activated", async () => {
    const onApprove = vi.fn();
    render(<Demo onApprove={onApprove} />);
    await userEvent.click(screen.getByRole("button", { name: "Send email" }));
    expect(onApprove).toHaveBeenCalledTimes(1);
  });

  it("calls onReject when the reject button is activated", async () => {
    const onReject = vi.fn();
    render(<Demo onReject={onReject} />);
    await userEvent.click(screen.getByRole("button", { name: "Don't send" }));
    expect(onReject).toHaveBeenCalledTimes(1);
  });

  it("does not steal focus on mount — approval must be deliberate", () => {
    render(<Demo />);
    expect(document.activeElement).toBe(document.body);
  });

  it("marks the approve button with the consequence level", () => {
    render(<Demo consequence="irreversible" />);
    expect(screen.getByRole("button", { name: "Send email" })).toHaveAttribute(
      "data-consequence",
      "irreversible"
    );
  });

  it("expands and collapses long content with correct aria wiring", async () => {
    render(<Demo />);
    const toggle = screen.getByRole("button", { name: "Message body" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText(/attached is the Q3 deck/)).not.toBeVisible();

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const body = screen.getByText(/attached is the Q3 deck/);
    expect(body.id).toBe(toggle.getAttribute("aria-controls"));
  });

  it("has no axe violations", async () => {
    const { container } = render(<Demo />);
    const results = await axe.run(container, AXE_OPTIONS);
    expect(results.violations).toEqual([]);
  });
});

describe("ActionPreview (modal)", () => {
  function ModalDemo(props: Partial<ActionPreviewRootProps>) {
    return <Demo asModal open onOpenChange={() => {}} {...props} />;
  }

  it("renders an alertdialog with the action title as its name", () => {
    render(<ModalDemo />);
    expect(
      screen.getByRole("alertdialog", { name: "Send email to Dana Ito" })
    ).toBeInTheDocument();
  });

  it("gives initial focus to the reject action, never approve", () => {
    render(<ModalDemo />);
    expect(screen.getByRole("button", { name: "Don't send" })).toHaveFocus();
  });

  it("treats Escape as reject and requests close", () => {
    const onReject = vi.fn();
    const onOpenChange = vi.fn();
    render(<ModalDemo onReject={onReject} onOpenChange={onOpenChange} />);
    fireEvent.keyDown(screen.getByRole("alertdialog"), { key: "Escape" });
    expect(onReject).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("approving fires onApprove and requests close", async () => {
    const onApprove = vi.fn();
    const onOpenChange = vi.fn();
    render(<ModalDemo onApprove={onApprove} onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Send email" }));
    expect(onApprove).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("has no axe violations while open", async () => {
    render(<ModalDemo />);
    const dialog = screen.getByRole("alertdialog");
    const results = await axe.run(dialog, AXE_OPTIONS);
    expect(results.violations).toEqual([]);
  });
});
