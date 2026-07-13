import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

import { CredentialHandoff } from "./credential-handoff";
import type { CredentialHandoffRootProps } from "./credential-handoff";

// color-contrast needs real layout; jsdom has none. Contrast is verified
// against the token palette in the site's Playwright/axe pass instead.
const AXE_OPTIONS: axe.RunOptions = {
  rules: { "color-contrast": { enabled: false } },
};

function Demo(props: Partial<CredentialHandoffRootProps>) {
  return (
    <CredentialHandoff.Root
      onHandoff={() => {}}
      onCancel={() => {}}
      {...props}
    >
      <CredentialHandoff.Header>
        <CredentialHandoff.Icon>🔑</CredentialHandoff.Icon>
        <CredentialHandoff.Title>Sign in to Delta</CredentialHandoff.Title>
      </CredentialHandoff.Header>
      <CredentialHandoff.Description>
        Booking your flight needs you to sign in.
      </CredentialHandoff.Description>
      <CredentialHandoff.Handler kind="password-manager" name="1Password" />
      <CredentialHandoff.Boundary>
        Your password goes straight to 1Password. The agent never sees it.
      </CredentialHandoff.Boundary>
      <CredentialHandoff.Returns>
        <CredentialHandoff.Return>
          A signed-in session, scoped to booking
        </CredentialHandoff.Return>
        <CredentialHandoff.Return>No stored password</CredentialHandoff.Return>
      </CredentialHandoff.Returns>
      <CredentialHandoff.Actions>
        <CredentialHandoff.Cancel>Not now</CredentialHandoff.Cancel>
        <CredentialHandoff.Handoff>
          Continue in 1Password
        </CredentialHandoff.Handoff>
      </CredentialHandoff.Actions>
    </CredentialHandoff.Root>
  );
}

describe("CredentialHandoff", () => {
  it("renders a group labelled by the task title", () => {
    render(<Demo />);
    expect(
      screen.getByRole("group", { name: "Sign in to Delta" })
    ).toBeInTheDocument();
  });

  it("names the trusted holder and its kind", () => {
    render(<Demo />);
    expect(screen.getByText("1Password")).toBeInTheDocument();
    expect(screen.getByText("Password manager")).toBeInTheDocument();
  });

  it("announces the exclusion boundary as a note", () => {
    render(<Demo />);
    expect(screen.getByRole("note")).toHaveTextContent(
      /the agent never sees it/i
    );
  });

  it("lists what the agent receives instead of the secret", () => {
    render(<Demo />);
    const list = screen.getByRole("list", { name: "The agent receives:" });
    expect(list).toBeInTheDocument();
    expect(
      screen.getByText("A signed-in session, scoped to booking")
    ).toBeInTheDocument();
  });

  it("calls onHandoff when the continue button is activated", async () => {
    const onHandoff = vi.fn();
    render(<Demo onHandoff={onHandoff} />);
    await userEvent.click(
      screen.getByRole("button", { name: "Continue in 1Password" })
    );
    expect(onHandoff).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when the cancel button is activated", async () => {
    const onCancel = vi.fn();
    render(<Demo onCancel={onCancel} />);
    await userEvent.click(screen.getByRole("button", { name: "Not now" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
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
