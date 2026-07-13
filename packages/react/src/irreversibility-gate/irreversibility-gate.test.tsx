import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

import { IrreversibilityGate } from "./irreversibility-gate";
import type { IrreversibilityGateRootProps } from "./irreversibility-gate";

// color-contrast needs real layout; jsdom has none. Contrast is verified
// against the token palette in the site's Playwright/axe pass instead.
const AXE_OPTIONS: axe.RunOptions = {
  rules: { "color-contrast": { enabled: false } },
};

function Demo(props: Partial<IrreversibilityGateRootProps>) {
  return (
    <IrreversibilityGate.Root
      onConfirm={() => {}}
      onCancel={() => {}}
      {...props}
    >
      <IrreversibilityGate.Header>
        <IrreversibilityGate.Icon>⚠</IrreversibilityGate.Icon>
        <IrreversibilityGate.Title>
          Delete 1,240 files
        </IrreversibilityGate.Title>
      </IrreversibilityGate.Header>
      <IrreversibilityGate.Description>
        The agent wants to empty the export directory.
      </IrreversibilityGate.Description>
      <IrreversibilityGate.Consequences>
        <IrreversibilityGate.Consequence>
          Permanently removes 1,240 files (4.2 GB).
        </IrreversibilityGate.Consequence>
        <IrreversibilityGate.Consequence>
          Cannot be undone — no version history exists.
        </IrreversibilityGate.Consequence>
      </IrreversibilityGate.Consequences>
      <IrreversibilityGate.ConfirmField />
      <IrreversibilityGate.Actions>
        <IrreversibilityGate.Cancel>Keep files</IrreversibilityGate.Cancel>
        <IrreversibilityGate.Confirm>Delete them</IrreversibilityGate.Confirm>
      </IrreversibilityGate.Actions>
    </IrreversibilityGate.Root>
  );
}

describe("IrreversibilityGate (inline)", () => {
  it("renders a group labelled by the action title", () => {
    render(<Demo severity="reversible" />);
    expect(
      screen.getByRole("group", { name: "Delete 1,240 files" })
    ).toBeInTheDocument();
  });

  it("enumerates the concrete consequences as list items", () => {
    render(<Demo severity="reversible" />);
    expect(
      screen.getByText(/Permanently removes 1,240 files/)
    ).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("does not steal focus on mount", () => {
    render(<Demo severity="reversible" />);
    expect(document.activeElement).toBe(document.body);
  });

  it("marks the confirm button with the severity", () => {
    render(<Demo severity="irreversible" />);
    expect(
      screen.getByRole("button", { name: "Delete them" })
    ).toHaveAttribute("data-severity", "irreversible");
  });

  it("confirms in one click at low severity", async () => {
    const onConfirm = vi.fn();
    render(<Demo severity="reversible" onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole("button", { name: "Delete them" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when the cancel button is activated", async () => {
    const onCancel = vi.fn();
    render(<Demo severity="reversible" onCancel={onCancel} />);
    await userEvent.click(screen.getByRole("button", { name: "Keep files" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("hides the type-to-confirm field unless a phrase is required", () => {
    render(<Demo severity="irreversible" />);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("gates confirm behind the exact phrase when required", async () => {
    const onConfirm = vi.fn();
    render(
      <Demo
        severity="irreversible"
        confirmPhrase="DELETE"
        onConfirm={onConfirm}
      />
    );
    const confirm = screen.getByRole("button", { name: "Delete them" });
    expect(confirm).toBeDisabled();

    await userEvent.type(screen.getByRole("textbox"), "delete");
    expect(confirm).toBeDisabled();

    await userEvent.clear(screen.getByRole("textbox"));
    await userEvent.type(screen.getByRole("textbox"), "DELETE");
    expect(confirm).toBeEnabled();

    await userEvent.click(confirm);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("ignores confirmPhrase at severities below irreversible", () => {
    render(<Demo severity="undoable" confirmPhrase="DELETE" />);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete them" })).toBeEnabled();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Demo severity="irreversible" confirmPhrase="DELETE" />
    );
    const results = await axe.run(container, AXE_OPTIONS);
    expect(results.violations).toEqual([]);
  });
});

describe("IrreversibilityGate (modal)", () => {
  function ModalDemo(props: Partial<IrreversibilityGateRootProps>) {
    return <Demo asModal open onOpenChange={() => {}} {...props} />;
  }

  it("renders an alertdialog named by the action title", () => {
    render(<ModalDemo severity="reversible" />);
    expect(
      screen.getByRole("alertdialog", { name: "Delete 1,240 files" })
    ).toBeInTheDocument();
  });

  it("gives initial focus to cancel, never confirm", () => {
    render(<ModalDemo severity="reversible" />);
    expect(screen.getByRole("button", { name: "Keep files" })).toHaveFocus();
  });

  it("treats Escape as cancel and requests close", () => {
    const onCancel = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <ModalDemo
        severity="reversible"
        onCancel={onCancel}
        onOpenChange={onOpenChange}
      />
    );
    fireEvent.keyDown(screen.getByRole("alertdialog"), { key: "Escape" });
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("confirming fires onConfirm and requests close", async () => {
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <ModalDemo
        severity="reversible"
        onConfirm={onConfirm}
        onOpenChange={onOpenChange}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Delete them" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("has no axe violations while open", async () => {
    render(<ModalDemo severity="irreversible" confirmPhrase="DELETE" />);
    const dialog = screen.getByRole("alertdialog");
    const results = await axe.run(dialog, AXE_OPTIONS);
    expect(results.violations).toEqual([]);
  });
});
