import AxeBuilder from "@axe-core/playwright";
import { type Page, expect, test } from "@playwright/test";

const SWITCH = '[data-acp="reading-level"]';

/** Open the reading-level menu and pick a level by its visible label. */
async function setLevel(page: Page, label: string) {
  await page
    .locator(SWITCH)
    .getByRole("button", { name: /Reading level/ })
    .click();
  await page
    .locator(SWITCH)
    .getByRole("menuitemradio", { name: label })
    .click();
}

test.describe("Reading level switcher", () => {
  test("defaults to Human: exactly the human variants are visible", async ({
    page,
  }) => {
    await page.goto("/patterns/scoped-grant/");
    await expect(page.locator("html")).toHaveAttribute("data-level", "human");
    await expect(page.locator('[data-lvl="human"]').first()).toBeVisible();
    await expect(page.locator('[data-lvl="caveman"]').first()).toBeHidden();
    await expect(page.locator('[data-lvl="academic"]').first()).toBeHidden();
  });

  test("switching level swaps the visible copy", async ({ page }) => {
    await page.goto("/patterns/scoped-grant/");
    await setLevel(page, "Caveman");
    await expect(page.locator("html")).toHaveAttribute("data-level", "caveman");
    await expect(page.locator('[data-lvl="caveman"]').first()).toBeVisible();
    await expect(page.locator('[data-lvl="human"]').first()).toBeHidden();
  });

  test("level persists across navigation and reload", async ({ page }) => {
    await page.goto("/patterns/scoped-grant/");
    await setLevel(page, "Academic");

    await page
      .locator("header")
      .getByRole("link", { name: "Research", exact: true })
      .click();
    await expect(page.locator("html")).toHaveAttribute(
      "data-level",
      "academic",
    );
    await expect(page.locator('[data-lvl="academic"]').first()).toBeVisible();

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute(
      "data-level",
      "academic",
    );
    await expect(
      page.locator(SWITCH).getByRole("button", { name: /Reading level/ }),
    ).toHaveAccessibleName(/Academic/);
  });

  for (const level of ["Caveman", "Default", "Academic"] as const) {
    test(`no axe violations at ${level} level (including color contrast)`, async ({
      page,
    }) => {
      await page.goto("/patterns/scoped-grant/");
      await setLevel(page, level);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  }
});
