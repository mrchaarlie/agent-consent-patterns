import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Progressive Scope pattern page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/patterns/progressive-scope/");
  });

  test("renders the pattern write-up", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Progressive Scope" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Anatomy" })
    ).toBeVisible();
  });

  test("each decision routes to its own callback", async ({ page }) => {
    await page.getByRole("button", { name: "Just this once" }).click();
    await expect(page.getByText(/Allowed once · write/)).toBeVisible();

    await page.getByRole("button", { name: "Reset demo" }).click();
    await page.getByRole("button", { name: "Always allow" }).click();
    await expect(
      page.getByText(/Escalated to standing grant · write/)
    ).toBeVisible();
  });

  test("access prop re-weights the requested capability", async ({ page }) => {
    await page.getByRole("radio", { name: '"delete"' }).check();
    // the request badge reads Delete and carries the access hook
    const badge = page.locator('[data-acp="request-access"]');
    await expect(badge).toHaveText("Delete");
    await expect(badge).toHaveAttribute("data-access", "delete");
  });

  test("keyboard-only deny path works", async ({ page }) => {
    const deny = page.getByRole("button", { name: "Not now" });
    await deny.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText(/Denied · write/)).toBeVisible();
  });

  test("has no axe violations (including color contrast)", async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
