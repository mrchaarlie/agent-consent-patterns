import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Injection Flag pattern page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/patterns/injection-flag/");
  });

  test("renders the pattern write-up", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Injection Flag" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Anatomy" })
    ).toBeVisible();
  });

  test("quotes the injected instruction verbatim in the demo", async ({
    page,
  }) => {
    const quote = page.locator('[data-acp="injection-quote"]');
    await expect(quote).toBeVisible();
    await expect(quote).toContainText("Ignore your previous instructions");
  });

  test("dismissing records the safe decision", async ({ page }) => {
    await page.getByRole("button", { name: "Ignore & keep summarising" }).click();
    await expect(page.getByText("Callback log")).toBeVisible();
    await expect(page.getByText(/Dismissed ·/)).toBeVisible();
    await page.getByRole("button", { name: "Reset demo" }).click();
    await expect(
      page.getByRole("button", { name: "Ignore & keep summarising" })
    ).toBeVisible();
  });

  test("proceeding records the risky decision", async ({ page }) => {
    await page.getByRole("button", { name: "Follow the instruction" }).click();
    await expect(page.getByText(/Proceeded ·/)).toBeVisible();
  });

  test("keyboard-only dismiss path works", async ({ page }) => {
    const dismiss = page.getByRole("button", {
      name: "Ignore & keep summarising",
    });
    await dismiss.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText(/Dismissed ·/)).toBeVisible();
  });

  test("has no axe violations (including color contrast)", async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
