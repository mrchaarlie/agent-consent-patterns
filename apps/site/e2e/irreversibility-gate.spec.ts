import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Irreversibility Gate pattern page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/patterns/irreversibility-gate/");
  });

  test("renders the pattern write-up", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Irreversibility Gate" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Anatomy" })
    ).toBeVisible();
  });

  test("irreversible tier gates confirm behind the typed phrase", async ({
    page,
  }) => {
    const confirm = page.getByRole("button", { name: "Delete forever" });
    await expect(confirm).toBeDisabled();
    await page.getByRole("textbox").fill("DELETE");
    await expect(confirm).toBeEnabled();
    await confirm.click();
    await expect(
      page.getByText(/Confirmed · severity: irreversible/)
    ).toBeVisible();
  });

  test("reversible tier confirms in one click, no type gate", async ({
    page,
  }) => {
    await page.getByRole("radio", { name: '"reversible"' }).check();
    await expect(page.getByRole("textbox")).toHaveCount(0);
    const confirm = page.getByRole("button", { name: "Archive them" });
    await expect(confirm).toBeEnabled();
    await confirm.click();
    await expect(
      page.getByText(/Confirmed · severity: reversible/)
    ).toBeVisible();
  });

  test("confirm carries the severity as a styling hook", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Delete forever" })
    ).toHaveAttribute("data-severity", "irreversible");
  });

  test("has no axe violations (including color contrast)", async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
