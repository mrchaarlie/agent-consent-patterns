import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Principles essay", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/principles/");
  });

  test("renders the essay and its principles", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Principles of agent consent" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "An agent can never exceed its principal",
      })
    ).toBeVisible();
  });

  test("links principles to the patterns that uphold them", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "Action Receipt" }).first()
    ).toHaveAttribute("href", "/patterns/action-receipt/");
  });

  test("has no axe violations (including color contrast)", async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
