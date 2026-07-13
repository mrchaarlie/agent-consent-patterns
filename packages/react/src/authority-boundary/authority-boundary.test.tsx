import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

import { AuthorityBoundary } from "./authority-boundary";
import type { AuthorityBoundaryRootProps } from "./authority-boundary";

// color-contrast needs real layout; jsdom has none. Contrast is verified
// against the token palette in the site's Playwright/axe pass instead.
const AXE_OPTIONS: axe.RunOptions = {
  rules: { "color-contrast": { enabled: false } },
};

const DEFAULTS = {
  "read-inbox": "auto",
  "send-email": "ask",
  "delete-thread": "never",
} as const;

function Demo(props: Partial<AuthorityBoundaryRootProps>) {
  return (
    <AuthorityBoundary.Root defaultValue={{ ...DEFAULTS }} {...props}>
      <AuthorityBoundary.Header>
        <AuthorityBoundary.Icon>⚖</AuthorityBoundary.Icon>
        <AuthorityBoundary.Title>
          What can Inbox Assistant do on its own?
        </AuthorityBoundary.Title>
      </AuthorityBoundary.Header>
      <AuthorityBoundary.Summary>
        {({ auto, ask, never }) =>
          `${auto} automatic · ${ask} ask first · ${never} never`
        }
      </AuthorityBoundary.Summary>
      <AuthorityBoundary.List>
        <AuthorityBoundary.Capability
          id="read-inbox"
          access="read"
          label="Read your inbox"
          description="Scan messages to draft replies."
        />
        <AuthorityBoundary.Capability
          id="send-email"
          access="write"
          label="Send email"
          description="Send a drafted message."
        />
        <AuthorityBoundary.Capability
          id="delete-thread"
          access="delete"
          label="Delete threads"
          description="Permanently remove a conversation."
          disallow={["auto"]}
        />
      </AuthorityBoundary.List>
    </AuthorityBoundary.Root>
  );
}

function control(name: RegExp): HTMLElement {
  return screen
    .getByText(name, {
      selector: "[data-acp='authority-capability-name']",
    })
    .closest("[data-acp='authority-capability']") as HTMLElement;
}

describe("AuthorityBoundary", () => {
  it("renders a group labelled by the surface title", () => {
    render(<Demo />);
    expect(
      screen.getByRole("group", {
        name: "What can Inbox Assistant do on its own?",
      })
    ).toBeInTheDocument();
  });

  it("does not steal focus on mount", () => {
    render(<Demo />);
    expect(document.activeElement).toBe(document.body);
  });

  it("reflects the initial level of each capability", () => {
    render(<Demo />);
    expect(
      within(control(/Read your inbox/)).getByRole("radio", {
        name: "Automatic",
      })
    ).toBeChecked();
    expect(
      within(control(/Send email/)).getByRole("radio", { name: "Ask first" })
    ).toBeChecked();
    expect(
      within(control(/Delete threads/)).getByRole("radio", { name: "Never" })
    ).toBeChecked();
  });

  it("summarises the standing authority live", async () => {
    render(<Demo />);
    expect(
      screen.getByText("1 automatic · 1 ask first · 1 never")
    ).toBeInTheDocument();
    await userEvent.click(
      within(control(/Send email/)).getByRole("radio", { name: "Automatic" })
    );
    expect(
      screen.getByText("2 automatic · 0 ask first · 1 never")
    ).toBeInTheDocument();
  });

  it("emits the full level map on a change", async () => {
    const onValueChange = vi.fn();
    render(<Demo onValueChange={onValueChange} />);
    await userEvent.click(
      within(control(/Send email/)).getByRole("radio", { name: "Automatic" })
    );
    expect(onValueChange).toHaveBeenCalledWith({
      "read-inbox": "auto",
      "send-email": "auto",
      "delete-thread": "never",
    });
  });

  it("forbids a disallowed level from being chosen", () => {
    render(<Demo />);
    expect(
      within(control(/Delete threads/)).getByRole("radio", {
        name: "Automatic",
      })
    ).toBeDisabled();
  });

  it("carries the capability's current level as a styling hook", async () => {
    render(<Demo />);
    const sendRow = control(/Send email/);
    expect(sendRow).toHaveAttribute("data-level", "ask");
    await userEvent.click(
      within(sendRow).getByRole("radio", { name: "Never" })
    );
    expect(control(/Send email/)).toHaveAttribute("data-level", "never");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Demo />);
    const results = await axe.run(container, AXE_OPTIONS);
    expect(results.violations).toEqual([]);
  });
});
