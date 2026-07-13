import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Scoped Grant pattern page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/patterns/scoped-grant/");
  });

  test("renders the pattern write-up", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Scoped Grant" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Anatomy" })
    ).toBeVisible();
  });

  test("required read scope is locked on and cannot be toggled off", async ({
    page,
  }) => {
    const read = page
      .getByRole("checkbox", { name: /Read messages/ })
      .first();
    await expect(read).toBeChecked();
    await expect(read).toBeDisabled();
  });

  test("granting reflects the count and records the scopes", async ({
    page,
  }) => {
    // Only the Gmail read scope is required, so the grant starts at one.
    const grant = page.getByRole("button", { name: /^Connect ·/ });
    await expect(grant).toHaveText(/· 1 permission$/);

    await page.getByRole("checkbox", { name: /Send replies/ }).check();
    await expect(grant).toHaveText(/· 2 permissions$/);

    await grant.click();
    await expect(page.getByText("Granted scopes")).toBeVisible();
    await expect(page.getByText("gmail.send", { exact: true })).toBeVisible();
  });

  test("keyboard-only grant path works", async ({ page }) => {
    const grant = page.getByRole("button", { name: /^Connect ·/ });
    await grant.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Granted scopes")).toBeVisible();
  });

  test("has no axe violations (including color contrast)", async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
