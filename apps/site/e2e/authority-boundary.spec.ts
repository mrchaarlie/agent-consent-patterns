import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Authority Boundary pattern page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/patterns/authority-boundary/");
  });

  test("renders the pattern write-up", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Authority Boundary" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Anatomy" })
    ).toBeVisible();
  });

  function row(page: import("@playwright/test").Page, name: string) {
    return page
      .locator('[data-acp="authority-capability"]')
      .filter({ hasText: name });
  }

  test("reflects each capability's initial level", async ({ page }) => {
    await expect(
      row(page, "Read your inbox").getByRole("radio", { name: "Automatic" })
    ).toBeChecked();
    await expect(
      row(page, "Send email").getByRole("radio", { name: "Ask first" })
    ).toBeChecked();
  });

  test("moving a capability re-tallies the summary", async ({ page }) => {
    const summary = page.locator('[data-acp="authority-summary"]');
    await expect(summary).toHaveText("2 automatic · 2 ask first · 1 off-limits");
    // The radio is a visually-hidden sr-only control; users (and this test)
    // drive it through its label, the visible segment.
    await row(page, "Send email")
      .getByText("Automatic", { exact: true })
      .click();
    await expect(summary).toHaveText("3 automatic · 1 ask first · 1 off-limits");
  });

  test("permanent deletion cannot be set to Automatic", async ({ page }) => {
    await expect(
      row(page, "Permanently delete").getByRole("radio", { name: "Automatic" })
    ).toBeDisabled();
    await expect(
      row(page, "Permanently delete").getByRole("radio", { name: "Never" })
    ).toBeChecked();
  });

  test("has no axe violations (including color contrast)", async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
