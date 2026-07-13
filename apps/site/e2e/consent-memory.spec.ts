import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Consent Memory pattern page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/patterns/consent-memory/");
  });

  test("renders the pattern write-up", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Consent Memory" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Anatomy" })
    ).toBeVisible();
  });

  test("defaults to the least-standing option", async ({ page }) => {
    await expect(
      page.getByRole("radio", { name: /Just this once/ })
    ).toBeChecked();
    await expect(
      page.getByRole("button", { name: "Allow once" })
    ).toBeVisible();
  });

  test("the confirm relabels itself for a standing grant", async ({ page }) => {
    await page.getByRole("radio", { name: /Always, for anyone/ }).check();
    await expect(
      page.getByRole("button", { name: "Allow always" })
    ).toBeVisible();
  });

  test("confirming a standing grant records its durability", async ({
    page,
  }) => {
    await page.getByRole("radio", { name: /Always, for Dana/ }).check();
    await page.getByRole("button", { name: "Allow always" }).click();
    await expect(page.getByText(/Standing grant created for Dana/)).toBeVisible();
  });

  test("the selected standing option carries the durability hook", async ({
    page,
  }) => {
    await page.getByRole("radio", { name: /Always, for anyone/ }).check();
    const option = page
      .locator('[data-acp="memory-option"]')
      .filter({ hasText: "Always, for anyone" });
    await expect(option).toHaveAttribute("data-durability", "always");
    await expect(option).toHaveAttribute("data-selected", "");
  });

  test("has no axe violations (including color contrast)", async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
