import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Action Receipt pattern page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/patterns/action-receipt/");
  });

  test("renders the pattern write-up", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Action Receipt" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Anatomy" })
    ).toBeVisible();
  });

  test("names the authority the action ran under", async ({ page }) => {
    const receipt = page.locator('[data-acp="root"][data-receipt]');
    await expect(
      receipt.locator('[data-acp="receipt-authority-grant"]')
    ).toHaveText("Standing grant · Send email");
  });

  test("undo recalls the send and leaves no second undo", async ({ page }) => {
    const receipt = page.locator('[data-acp="root"][data-receipt]');
    await expect(receipt).toHaveAttribute("data-outcome", "completed");
    await page.getByRole("button", { name: "Undo send" }).click();
    await expect(receipt).toHaveAttribute("data-outcome", "undone");
    await expect(
      page.getByRole("button", { name: "Undo send" })
    ).toHaveCount(0);
    await expect(
      receipt.locator('[data-acp="receipt-undo-note"]')
    ).toHaveText("Undone");
  });

  test("keyboard-only undo path works", async ({ page }) => {
    const undo = page.getByRole("button", { name: "Undo send" });
    await undo.focus();
    await page.keyboard.press("Enter");
    await expect(
      page.locator('[data-acp="root"][data-receipt]')
    ).toHaveAttribute("data-outcome", "undone");
  });

  test("has no axe violations (including color contrast)", async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
