import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

import { ScopedGrant } from "./scoped-grant";
import type { ScopedGrantRootProps } from "./scoped-grant";

// color-contrast needs real layout; jsdom has none. Contrast is verified
// against the token palette in the site's Playwright/axe pass instead.
const AXE_OPTIONS: axe.RunOptions = {
  rules: { "color-contrast": { enabled: false } },
};

function Demo(props: Partial<ScopedGrantRootProps>) {
  return (
    <ScopedGrant.Root
      onGrant={() => {}}
      onCancel={() => {}}
      requiredScopes={["gmail.read"]}
      {...props}
    >
      <ScopedGrant.Header>
        <ScopedGrant.Icon>✉</ScopedGrant.Icon>
        <ScopedGrant.Title>Connect Inbox Assistant to Gmail</ScopedGrant.Title>
      </ScopedGrant.Header>
      <ScopedGrant.Description>
        Choose what Inbox Assistant may do. You can change this later.
      </ScopedGrant.Description>
      <ScopedGrant.Group label="Gmail" resource="Board 2026 label only">
        <ScopedGrant.Scope
          id="gmail.read"
          access="read"
          label="Read messages"
          description="See subjects and bodies of messages in the label."
        />
        <ScopedGrant.Scope
          id="gmail.send"
          access="write"
          label="Send messages on your behalf"
          description="Compose and send new email as you."
        />
        <ScopedGrant.Scope
          id="gmail.delete"
          access="delete"
          label="Delete messages"
          description="Permanently move messages to trash."
        />
      </ScopedGrant.Group>
      <ScopedGrant.Actions>
        <ScopedGrant.Cancel>Cancel</ScopedGrant.Cancel>
        <ScopedGrant.Grant>
          {({ count }) => `Grant ${count} permissions`}
        </ScopedGrant.Grant>
      </ScopedGrant.Actions>
    </ScopedGrant.Root>
  );
}

describe("ScopedGrant", () => {
  it("renders a form labelled by the connection title", () => {
    render(<Demo />);
    expect(
      screen.getByRole("form", { name: "Connect Inbox Assistant to Gmail" })
    ).toBeInTheDocument();
  });

  it("renders each scope as a checkbox with a plain-language label", () => {
    render(<Demo />);
    expect(
      screen.getByRole("checkbox", { name: /Send messages on your behalf/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /Delete messages/ })
    ).toBeInTheDocument();
  });

  it("surfaces the access level as text, not color alone", () => {
    render(<Demo />);
    expect(screen.getByText("Write")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("groups scopes by resource with an accessible legend", () => {
    render(<Demo />);
    expect(
      screen.getByRole("group", { name: /Gmail/ })
    ).toBeInTheDocument();
  });

  it("keeps required scopes checked, disabled, and un-toggleable", async () => {
    render(<Demo />);
    const read = screen.getByRole("checkbox", { name: /Read messages/ });
    expect(read).toBeChecked();
    expect(read).toBeDisabled();
    await userEvent.click(read);
    expect(read).toBeChecked();
  });

  it("toggles optional scopes and reflects the count in the Grant label", async () => {
    render(<Demo />);
    // starts at 1 (the required read scope only)
    expect(
      screen.getByRole("button", { name: "Grant 1 permissions" })
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("checkbox", { name: /Send messages/ })
    );
    expect(
      screen.getByRole("button", { name: "Grant 2 permissions" })
    ).toBeInTheDocument();
  });

  it("submits the effective granted set, required scopes included", async () => {
    const onGrant = vi.fn();
    render(<Demo onGrant={onGrant} />);
    await userEvent.click(
      screen.getByRole("checkbox", { name: /Delete messages/ })
    );
    await userEvent.click(
      screen.getByRole("button", { name: /^Grant/ })
    );
    expect(onGrant).toHaveBeenCalledTimes(1);
    const ids = onGrant.mock.calls[0]![0] as string[];
    expect(new Set(ids)).toEqual(new Set(["gmail.read", "gmail.delete"]));
  });

  it("supports controlled selection via value + onValueChange", async () => {
    const onValueChange = vi.fn();
    render(
      <Demo
        value={["gmail.read"]}
        onValueChange={onValueChange}
        requiredScopes={["gmail.read"]}
      />
    );
    await userEvent.click(
      screen.getByRole("checkbox", { name: /Send messages/ })
    );
    expect(onValueChange).toHaveBeenCalledWith(
      expect.arrayContaining(["gmail.read", "gmail.send"])
    );
  });

  it("calls onCancel when the user declines", async () => {
    const onCancel = vi.fn();
    render(<Demo onCancel={onCancel} />);
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("has no axe violations", async () => {
    const { container } = render(<Demo />);
    const results = await axe.run(container, AXE_OPTIONS);
    expect(results.violations).toEqual([]);
  });
});
