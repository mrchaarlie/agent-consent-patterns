import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

import { ConnectionCard } from "./connection-card";
import type { ConnectionCardRootProps } from "./connection-card";

// color-contrast needs real layout; jsdom has none. Contrast is verified
// against the token palette in the site's Playwright/axe pass instead.
const AXE_OPTIONS: axe.RunOptions = {
  rules: { "color-contrast": { enabled: false } },
};

function Demo(props: Partial<ConnectionCardRootProps> & { onRevoke?: () => void }) {
  const { onRevoke = () => {}, ...rootProps } = props;
  return (
    <ConnectionCard.Root {...rootProps}>
      <ConnectionCard.Header>
        <ConnectionCard.Icon>✉</ConnectionCard.Icon>
        <ConnectionCard.Title>Inbox Assistant → Gmail</ConnectionCard.Title>
        <ConnectionCard.Status />
      </ConnectionCard.Header>
      <ConnectionCard.Scopes>
        <ConnectionCard.Scope access="read">Read messages</ConnectionCard.Scope>
        <ConnectionCard.Scope access="write">Send replies</ConnectionCard.Scope>
      </ConnectionCard.Scopes>
      <ConnectionCard.Meta>
        <ConnectionCard.MetaItem label="Last used">
          2 hours ago
        </ConnectionCard.MetaItem>
        <ConnectionCard.MetaItem label="Connected">
          Mar 3, 2026
        </ConnectionCard.MetaItem>
      </ConnectionCard.Meta>
      <ConnectionCard.Actions>
        <ConnectionCard.Action>Manage</ConnectionCard.Action>
        <ConnectionCard.Action tone="danger" onClick={onRevoke}>
          Revoke
        </ConnectionCard.Action>
      </ConnectionCard.Actions>
    </ConnectionCard.Root>
  );
}

describe("ConnectionCard", () => {
  it("renders an article labelled by the connection title", () => {
    render(<Demo />);
    expect(
      screen.getByRole("article", { name: "Inbox Assistant → Gmail" })
    ).toBeInTheDocument();
  });

  it("shows the status as text, defaulting to active", () => {
    render(<Demo />);
    const badge = screen.getByText("Active");
    expect(badge).toHaveAttribute("data-status", "active");
  });

  it("renders a non-default status label from the prop", () => {
    render(<Demo status="needs-reauth" />);
    expect(screen.getByText("Needs re-auth")).toHaveAttribute(
      "data-status",
      "needs-reauth"
    );
  });

  it("lists active scopes with their access level as text", () => {
    render(<Demo />);
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("Read")).toBeInTheDocument();
    expect(screen.getByText("Write")).toBeInTheDocument();
    expect(screen.getByText("Send replies")).toBeInTheDocument();
  });

  it("renders recency metadata as a definition list", () => {
    render(<Demo />);
    expect(screen.getByText("Last used")).toBeInTheDocument();
    expect(screen.getByText("2 hours ago")).toBeInTheDocument();
  });

  it("fires the handler wired to a management action", async () => {
    const onRevoke = vi.fn();
    render(<Demo onRevoke={onRevoke} />);
    await userEvent.click(screen.getByRole("button", { name: "Revoke" }));
    expect(onRevoke).toHaveBeenCalledTimes(1);
  });

  it("marks a destructive action with the danger tone", () => {
    render(<Demo />);
    expect(screen.getByRole("button", { name: "Revoke" })).toHaveAttribute(
      "data-tone",
      "danger"
    );
  });

  it("has no axe violations", async () => {
    const { container } = render(<Demo status="needs-reauth" />);
    const results = await axe.run(container, AXE_OPTIONS);
    expect(results.violations).toEqual([]);
  });
});
