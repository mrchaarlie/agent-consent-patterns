import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

import { SpendLimits } from "./spend-limits";
import type { SpendLimitsRootProps, SpendLimitUsage } from "./spend-limits";

// color-contrast needs real layout; jsdom has none. Contrast is verified
// against the token palette in the site's Playwright/axe pass instead.
const AXE_OPTIONS: axe.RunOptions = {
  rules: { "color-contrast": { enabled: false } },
};

const USAGE: SpendLimitUsage[] = [
  { id: "purchases", used: 20 },
  { id: "emails", used: 18 },
  { id: "bookings", used: 60 },
];

const CAPS = {
  purchases: 100,
  emails: 20,
  bookings: 50,
} as const;

function Demo(props: Partial<SpendLimitsRootProps>) {
  return (
    <SpendLimits.Root limits={USAGE} defaultValue={{ ...CAPS }} {...props}>
      <SpendLimits.Header>
        <SpendLimits.Icon>▤</SpendLimits.Icon>
        <SpendLimits.Title>How far can Shopping Agent go alone?</SpendLimits.Title>
      </SpendLimits.Header>
      <SpendLimits.Summary>
        {({ reached, warning }) => `${reached} cap reached · ${warning} near cap`}
      </SpendLimits.Summary>
      <SpendLimits.List>
        <SpendLimits.Limit
          id="purchases"
          kind="spend"
          unit="$"
          period="week"
          label="Purchases"
          description="Buy items on your behalf."
        />
        <SpendLimits.Limit
          id="emails"
          kind="rate"
          unit="emails"
          period="day"
          label="Outreach emails"
          description="Send messages to sellers."
        />
        <SpendLimits.Limit
          id="bookings"
          kind="spend"
          unit="$"
          period="month"
          label="Bookings"
          description="Reserve travel and lodging."
        />
      </SpendLimits.List>
    </SpendLimits.Root>
  );
}

function row(name: RegExp): HTMLElement {
  return screen
    .getByText(name, { selector: "[data-acp='limits-limit-name']" })
    .closest("[data-acp='limits-limit']") as HTMLElement;
}

describe("SpendLimits", () => {
  it("renders a group labelled by the surface title", () => {
    render(<Demo />);
    expect(
      screen.getByRole("group", {
        name: "How far can Shopping Agent go alone?",
      })
    ).toBeInTheDocument();
  });

  it("does not steal focus on mount", () => {
    render(<Demo />);
    expect(document.activeElement).toBe(document.body);
  });

  it("reads usage against the cap in the unit's format", () => {
    render(<Demo />);
    expect(
      within(row(/Purchases/)).getByText("$20 of $100 this week")
    ).toBeInTheDocument();
    expect(
      within(row(/Outreach emails/)).getByText("18 of 20 emails today")
    ).toBeInTheDocument();
  });

  it("derives each limit's state from usage and cap", () => {
    render(<Demo />);
    expect(row(/Purchases/)).toHaveAttribute("data-state", "ok");
    expect(row(/Outreach emails/)).toHaveAttribute("data-state", "warning");
    expect(row(/Bookings/)).toHaveAttribute("data-state", "reached");
  });

  it("flags a reached cap as a consent event", () => {
    render(<Demo />);
    expect(
      within(row(/Bookings/)).getByText(/agent will ask before doing more/i)
    ).toBeInTheDocument();
  });

  it("summarises the guardrails live and re-tallies on a cap change", async () => {
    render(<Demo />);
    expect(screen.getByText("1 cap reached · 1 near cap")).toBeInTheDocument();
    // Raise the Bookings cap above usage — it leaves the "reached" state.
    const cap = within(row(/Bookings/)).getByRole("spinbutton", {
      name: /Bookings cap/i,
    });
    await userEvent.clear(cap);
    await userEvent.type(cap, "80");
    expect(screen.getByText("0 cap reached · 1 near cap")).toBeInTheDocument();
  });

  it("emits the full cap map when a cap changes", async () => {
    const onValueChange = vi.fn();
    render(<Demo onValueChange={onValueChange} />);
    const cap = within(row(/Purchases/)).getByRole("spinbutton", {
      name: /Purchases cap/i,
    });
    await userEvent.clear(cap);
    await userEvent.type(cap, "5");
    expect(onValueChange).toHaveBeenLastCalledWith({
      purchases: 5,
      emails: 20,
      bookings: 50,
    });
  });

  it("treats a limit with no cap as unbounded", () => {
    render(
      <SpendLimits.Root limits={[{ id: "solo", used: 3 }]} defaultValue={{}}>
        <SpendLimits.Title>Limits</SpendLimits.Title>
        <SpendLimits.List>
          <SpendLimits.Limit
            id="solo"
            kind="rate"
            unit="calls"
            period="day"
            label="API calls"
          />
        </SpendLimits.List>
      </SpendLimits.Root>
    );
    expect(row(/API calls/)).toHaveAttribute("data-state", "none");
    expect(
      within(row(/API calls/)).getByText("3 calls used · no limit set")
    ).toBeInTheDocument();
  });

  it("treats a cap of 0 as reached, never as unbounded", () => {
    render(
      <SpendLimits.Root
        limits={[{ id: "purchases", used: 0 }]}
        defaultValue={{ purchases: 0 }}
      >
        <SpendLimits.Title>Limits</SpendLimits.Title>
        <SpendLimits.List>
          <SpendLimits.Limit
            id="purchases"
            kind="spend"
            unit="$"
            period="week"
            label="Purchases"
          />
        </SpendLimits.List>
      </SpendLimits.Root>
    );
    expect(row(/Purchases/)).toHaveAttribute("data-state", "reached");
    expect(
      within(row(/Purchases/)).getByText(/agent will ask before doing more/i)
    ).toBeInTheDocument();
  });

  it("fails closed when the cap field is cleared or negative", async () => {
    const onValueChange = vi.fn();
    render(<Demo onValueChange={onValueChange} />);
    const cap = within(row(/Purchases/)).getByRole("spinbutton", {
      name: /Purchases cap/i,
    });
    // Clearing the field commits a cap of 0 — the row reads reached, not "no
    // limit set".
    await userEvent.clear(cap);
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ purchases: 0 })
    );
    expect(row(/Purchases/)).toHaveAttribute("data-state", "reached");
    // A negative value clamps to 0 rather than going unbounded. (fireEvent,
    // not userEvent.type — jsdom swallows the "-" keystroke in number inputs.)
    fireEvent.change(cap, { target: { value: "-5" } });
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ purchases: 0 })
    );
    expect(row(/Purchases/)).toHaveAttribute("data-state", "reached");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Demo />);
    const results = await axe.run(container, AXE_OPTIONS);
    expect(results.violations).toEqual([]);
  });
});
