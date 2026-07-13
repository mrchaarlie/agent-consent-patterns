import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

import { ConsentMemory } from "./consent-memory";
import type { ConsentMemoryRootProps } from "./consent-memory";

// color-contrast needs real layout; jsdom has none. Contrast is verified
// against the token palette in the site's Playwright/axe pass instead.
const AXE_OPTIONS: axe.RunOptions = {
  rules: { "color-contrast": { enabled: false } },
};

function Demo(props: Partial<ConsentMemoryRootProps>) {
  return (
    <ConsentMemory.Root
      defaultValue="once"
      onAllow={() => {}}
      onDeny={() => {}}
      {...props}
    >
      <ConsentMemory.Header>
        <ConsentMemory.Icon>✦</ConsentMemory.Icon>
        <ConsentMemory.Title>
          Allow Inbox Assistant to send email?
        </ConsentMemory.Title>
      </ConsentMemory.Header>
      <ConsentMemory.Description>
        The agent wants to reply to Dana Okafor now.
      </ConsentMemory.Description>
      <ConsentMemory.Options>
        <ConsentMemory.Option
          value="once"
          durability="once"
          label="Just this once"
          consequence="The agent asks again next time it wants to send email."
        />
        <ConsentMemory.Option
          value="session"
          durability="session"
          label="For this session"
          consequence="No more prompts until you close the app."
        />
        <ConsentMemory.Option
          value="scoped"
          durability="scoped"
          label="Always, for Dana"
          consequence="The agent can email Dana any time without asking."
        />
        <ConsentMemory.Option
          value="always"
          durability="always"
          label="Always, for anyone"
          consequence="The agent can email anyone, any time, without asking again."
        />
      </ConsentMemory.Options>
      <ConsentMemory.Actions>
        <ConsentMemory.Deny>Not now</ConsentMemory.Deny>
        <ConsentMemory.Allow>
          {({ durability }) =>
            durability === "always" || durability === "scoped"
              ? "Allow always"
              : "Allow"
          }
        </ConsentMemory.Allow>
      </ConsentMemory.Actions>
    </ConsentMemory.Root>
  );
}

describe("ConsentMemory", () => {
  it("renders a form labelled by the permission question", () => {
    render(<Demo />);
    expect(
      screen.getByRole("form", {
        name: "Allow Inbox Assistant to send email?",
      })
    ).toBeInTheDocument();
  });

  it("does not steal focus on mount", () => {
    render(<Demo />);
    expect(document.activeElement).toBe(document.body);
  });

  it("presents the durability options as a radio group", () => {
    render(<Demo />);
    expect(screen.getAllByRole("radio")).toHaveLength(4);
  });

  it("defaults to the least-standing option", () => {
    render(<Demo />);
    expect(screen.getByRole("radio", { name: /Just this once/ })).toBeChecked();
    expect(
      screen.getByRole("radio", { name: /Always, for anyone/ })
    ).not.toBeChecked();
  });

  it("associates each option with its consequence for screen readers", () => {
    render(<Demo />);
    const always = screen.getByRole("radio", { name: /Always, for anyone/ });
    const describedby = always.getAttribute("aria-describedby");
    expect(describedby).toBeTruthy();
    expect(document.getElementById(describedby!)).toHaveTextContent(
      /email anyone, any time, without asking again/
    );
  });

  it("labels the confirm by the selected durability", async () => {
    render(<Demo />);
    expect(screen.getByRole("button", { name: "Allow" })).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("radio", { name: /Always, for anyone/ })
    );
    expect(
      screen.getByRole("button", { name: "Allow always" })
    ).toBeInTheDocument();
  });

  it("confirms with the selected option value", async () => {
    const onAllow = vi.fn();
    render(<Demo onAllow={onAllow} />);
    await userEvent.click(screen.getByRole("radio", { name: /for Dana/ }));
    await userEvent.click(screen.getByRole("button", { name: "Allow always" }));
    expect(onAllow).toHaveBeenCalledWith("scoped");
  });

  it("carries the selected durability as a styling hook on the option", async () => {
    render(<Demo />);
    await userEvent.click(
      screen.getByRole("radio", { name: /Always, for anyone/ })
    );
    const option = screen
      .getByRole("radio", { name: /Always, for anyone/ })
      .closest("[data-acp='memory-option']");
    expect(option).toHaveAttribute("data-durability", "always");
    expect(option).toHaveAttribute("data-selected", "");
  });

  it("calls onDeny when the user declines", async () => {
    const onDeny = vi.fn();
    render(<Demo onDeny={onDeny} />);
    await userEvent.click(screen.getByRole("button", { name: "Not now" }));
    expect(onDeny).toHaveBeenCalledTimes(1);
  });

  it("has no axe violations", async () => {
    const { container } = render(<Demo />);
    const results = await axe.run(container, AXE_OPTIONS);
    expect(results.violations).toEqual([]);
  });
});
