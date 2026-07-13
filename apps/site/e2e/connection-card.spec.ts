import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Connection Card pattern page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/patterns/connection-card/");
  });

  test("renders the pattern write-up", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Connection Card" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Anatomy" })
    ).toBeVisible();
  });

  test("pausing flips the status badge and recency", async ({ page }) => {
    const card = page.getByRole("article", { name: /Inbox Assistant/ });
    const statusBadge = card.locator('[data-acp="connection-status"]');
    await expect(statusBadge).toHaveText("Active");
    await page.getByRole("button", { name: "Pause" }).click();
    await expect(statusBadge).toHaveText("Paused");
    await expect(page.getByText(/Paused ·/)).toBeVisible(); // action log
    await page.getByRole("button", { name: "Resume" }).click();
    await expect(statusBadge).toHaveText("Active");
  });

  test("revoking disconnects the card", async ({ page }) => {
    await page.getByRole("button", { name: "Revoke" }).click();
    await expect(page.getByText(/Disconnected\./)).toBeVisible();
    await page.getByRole("button", { name: "Reset demo" }).click();
    await expect(
      page.getByRole("article", { name: /Inbox Assistant/ })
    ).toBeVisible();
  });

  test("revoke is marked as a destructive action", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Revoke" })
    ).toHaveAttribute("data-tone", "danger");
  });

  test("has no axe violations (including color contrast)", async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
