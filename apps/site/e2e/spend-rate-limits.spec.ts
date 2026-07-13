import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

test.describe("Spend & Rate Limits pattern page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/patterns/spend-rate-limits/");
  });

  // Scope to the live demo component — the write-up prose quotes several of the
  // same strings ("$34 of $100 this week", the summary tally), so assertions
  // target the component's data-acp hooks, not shared visible text.
  function surface(page: Page) {
    return page.locator('[data-acp="root"][data-limits]');
  }

  function row(page: Page, name: string) {
    return surface(page)
      .locator('[data-acp="limits-limit"]')
      .filter({ hasText: name });
  }

  test("renders the pattern write-up", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Spend & Rate Limits" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Anatomy" })
    ).toBeVisible();
  });

  test("reads usage against each cap in the unit's format", async ({ page }) => {
    await expect(
      row(page, "Purchases").locator('[data-acp="limits-meter-readout"]')
    ).toHaveText("$34 of $100 this week");
    await expect(
      row(page, "Outreach emails").locator('[data-acp="limits-meter-readout"]')
    ).toHaveText("17 of 20 emails today");
  });

  test("derives each limit's state from usage and cap", async ({ page }) => {
    await expect(row(page, "Purchases")).toHaveAttribute("data-state", "ok");
    await expect(row(page, "Outreach emails")).toHaveAttribute(
      "data-state",
      "warning"
    );
    await expect(row(page, "Travel bookings")).toHaveAttribute(
      "data-state",
      "reached"
    );
  });

  test("flags a reached cap as a consent event", async ({ page }) => {
    await expect(
      row(page, "Travel bookings").locator('[data-acp="limits-status"]')
    ).toContainText("agent will ask");
  });

  test("editing a cap re-tallies the summary live", async ({ page }) => {
    const summary = surface(page).locator('[data-acp="limits-summary"]');
    await expect(summary).toHaveText("1 cap reached · 1 near cap");
    await row(page, "Travel bookings").getByRole("spinbutton").fill("300");
    await expect(summary).toHaveText("0 cap reached · 1 near cap");
    await expect(row(page, "Travel bookings")).toHaveAttribute(
      "data-state",
      "ok"
    );
  });

  test("has no axe violations (including color contrast)", async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
