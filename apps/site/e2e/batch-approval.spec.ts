import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Batch Approval pattern page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/patterns/batch-approval/");
  });

  test("renders the pattern write-up", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Batch Approval" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Anatomy" })
    ).toBeVisible();
  });

  test("select-all batches the routine items but not the flagged ones", async ({
    page,
  }) => {
    const approve = page.getByRole("button", { name: "Approve selected" });
    await expect(approve).toBeDisabled();

    await page.getByRole("checkbox", { name: "Select all reviewable" }).check();
    await expect(approve).toBeEnabled();
    await approve.click();

    await expect(page.getByText(/^Approved 4:/)).toBeVisible();
    // The two flagged actions survive the batch pass.
    await expect(
      page.getByText("Permanently delete “Invoice #4471” thread")
    ).toBeVisible();
    await expect(
      page.getByText("Forward contract to legal@acme.com")
    ).toBeVisible();
  });

  test("flagged items carry the review flag and no checkbox", async ({
    page,
  }) => {
    const flags = page.locator('[data-acp="batch-item-flag"]');
    await expect(flags).toHaveCount(2);
    await expect(flags.first()).toHaveText("Review individually");
  });

  test("a flagged item can be approved on its own row", async ({ page }) => {
    const row = page
      .locator('[data-acp="batch-item"]')
      .filter({ hasText: "Invoice #4471" });
    await row.getByRole("button", { name: "Approve" }).click();
    await expect(page.getByText(/^Approved 1:.*Invoice #4471/)).toBeVisible();
  });

  test("has no axe violations (including color contrast)", async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
