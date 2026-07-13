import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

import { ProgressiveScope } from "./progressive-scope";
import type { ProgressiveScopeRootProps } from "./progressive-scope";

// color-contrast needs real layout; jsdom has none. Contrast is verified
// against the token palette in the site's Playwright/axe pass instead.
const AXE_OPTIONS: axe.RunOptions = {
  rules: { "color-contrast": { enabled: false } },
};

function noop() {}

function Demo(props: Partial<ProgressiveScopeRootProps>) {
  return (
    <ProgressiveScope.Root
      access="write"
      onAllowOnce={noop}
      onAllowAlways={noop}
      onDeny={noop}
      {...props}
    >
      <ProgressiveScope.Header>
        <ProgressiveScope.Icon>✦</ProgressiveScope.Icon>
        <ProgressiveScope.Title>
          Inbox Assistant needs to send email
        </ProgressiveScope.Title>
      </ProgressiveScope.Header>
      <ProgressiveScope.Reason>
        To reply to the vendor thread, it needs to send email on your behalf.
      </ProgressiveScope.Reason>
      <ProgressiveScope.Request
        label="Send email on your behalf"
        description="Compose and send new email as you, in this thread."
      />
      <ProgressiveScope.Current>
        Inbox Assistant can already read this label.
      </ProgressiveScope.Current>
      <ProgressiveScope.Actions>
        <ProgressiveScope.Deny>Not now</ProgressiveScope.Deny>
        <ProgressiveScope.AllowAlways>Always allow</ProgressiveScope.AllowAlways>
        <ProgressiveScope.AllowOnce>Just this once</ProgressiveScope.AllowOnce>
      </ProgressiveScope.Actions>
    </ProgressiveScope.Root>
  );
}

describe("ProgressiveScope (inline)", () => {
  it("renders a group labelled by the request title", () => {
    render(<Demo />);
    expect(
      screen.getByRole("group", {
        name: "Inbox Assistant needs to send email",
      })
    ).toBeInTheDocument();
  });

  it("names the requested capability and its access level as text", () => {
    render(<Demo />);
    expect(screen.getByText("Write")).toBeInTheDocument();
    expect(
      screen.getByText("Send email on your behalf")
    ).toBeInTheDocument();
  });

  it("shows the reason and the current standing grant", () => {
    render(<Demo />);
    expect(screen.getByText(/reply to the vendor thread/)).toBeInTheDocument();
    expect(
      screen.getByText(/already read this label/)
    ).toBeInTheDocument();
  });

  it("does not steal focus on mount", () => {
    render(<Demo />);
    expect(document.activeElement).toBe(document.body);
  });

  it("routes each decision to its own callback", async () => {
    const onAllowOnce = vi.fn();
    const onAllowAlways = vi.fn();
    const onDeny = vi.fn();
    render(
      <Demo
        onAllowOnce={onAllowOnce}
        onAllowAlways={onAllowAlways}
        onDeny={onDeny}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Just this once" })
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Always allow" })
    );
    await userEvent.click(screen.getByRole("button", { name: "Not now" }));
    expect(onAllowOnce).toHaveBeenCalledTimes(1);
    expect(onAllowAlways).toHaveBeenCalledTimes(1);
    expect(onDeny).toHaveBeenCalledTimes(1);
  });

  it("marks the request with the access level for styling", () => {
    render(<Demo access="delete" />);
    // both the root and the badge carry data-access
    expect(screen.getByText("Delete")).toHaveAttribute(
      "data-access",
      "delete"
    );
  });

  it("has no axe violations", async () => {
    const { container } = render(<Demo />);
    const results = await axe.run(container, AXE_OPTIONS);
    expect(results.violations).toEqual([]);
  });
});

describe("ProgressiveScope (modal)", () => {
  function ModalDemo(props: Partial<ProgressiveScopeRootProps>) {
    return <Demo asModal open onOpenChange={noop} {...props} />;
  }

  it("renders an alertdialog named by the request title", () => {
    render(<ModalDemo />);
    expect(
      screen.getByRole("alertdialog", {
        name: "Inbox Assistant needs to send email",
      })
    ).toBeInTheDocument();
  });

  it("gives initial focus to deny, never an allow", () => {
    render(<ModalDemo />);
    expect(screen.getByRole("button", { name: "Not now" })).toHaveFocus();
  });

  it("treats Escape as deny and requests close", () => {
    const onDeny = vi.fn();
    const onOpenChange = vi.fn();
    render(<ModalDemo onDeny={onDeny} onOpenChange={onOpenChange} />);
    fireEvent.keyDown(screen.getByRole("alertdialog"), { key: "Escape" });
    expect(onDeny).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("allowing once fires the callback and requests close", async () => {
    const onAllowOnce = vi.fn();
    const onOpenChange = vi.fn();
    render(<ModalDemo onAllowOnce={onAllowOnce} onOpenChange={onOpenChange} />);
    await userEvent.click(
      screen.getByRole("button", { name: "Just this once" })
    );
    expect(onAllowOnce).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("has no axe violations while open", async () => {
    render(<ModalDemo />);
    const dialog = screen.getByRole("alertdialog");
    const results = await axe.run(dialog, AXE_OPTIONS);
    expect(results.violations).toEqual([]);
  });
});
