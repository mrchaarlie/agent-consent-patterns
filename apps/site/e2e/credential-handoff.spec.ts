import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Credential Handoff pattern page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/patterns/credential-handoff/");
  });

  test("renders the pattern write-up", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Credential Handoff" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Anatomy" })
    ).toBeVisible();
  });

  test("names the trusted holder and announces the exclusion boundary", async ({
    page,
  }) => {
    const surface = page.locator('[data-acp="root"][data-handoff]');
    await expect(
      surface.locator('[data-acp="handoff-handler-name"]')
    ).toHaveText("1Password");
    await expect(surface.getByRole("note")).toContainText(
      "never sees it"
    );
  });

  test("handing off records the scoped result", async ({ page }) => {
    await page.getByRole("button", { name: "Continue in 1Password" }).click();
    // "booking-scoped session" also appears in the prose; scope to the demo's
    // own result message.
    await expect(page.getByText(/^Handed off\./)).toBeVisible();
    await page.getByRole("button", { name: "Reset demo" }).click();
    await expect(
      page.getByRole("button", { name: "Continue in 1Password" })
    ).toBeVisible();
  });

  test("cancelling backs out with nothing exposed", async ({ page }) => {
    await page.getByRole("button", { name: "Not now" }).click();
    await expect(page.getByText(/the agent saw nothing/)).toBeVisible();
  });

  test("has no axe violations (including color contrast)", async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
