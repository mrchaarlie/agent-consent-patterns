import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Action Preview pattern page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/patterns/action-preview/");
  });

  test("renders the pattern write-up", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "Action Preview" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Anatomy" })
    ).toBeVisible();
  });

  test("demo approve flow records the decision", async ({ page }) => {
    await page.getByRole("button", { name: "Send email" }).click();
    await expect(page.getByText("Callback log")).toBeVisible();
    await expect(page.getByText(/Approved · consequence: reversible/)).toBeVisible();
    await page.getByRole("button", { name: "Reset demo" }).click();
    await expect(page.getByRole("button", { name: "Send email" })).toBeVisible();
  });

  test("irreversible consequence re-weights the approve action", async ({
    page,
  }) => {
    await page.getByRole("radio", { name: '"irreversible"' }).check();
    const approve = page.getByRole("button", { name: "Send now" });
    await expect(approve).toHaveAttribute("data-consequence", "irreversible");
  });

  test("demo frame theme toggle scopes dark mode to the frame", async ({
    page,
  }) => {
    const frame = page.locator("[data-theme]").first();
    await expect(frame).toHaveAttribute("data-theme", "light");
    await page.getByRole("button", { name: "dark", exact: true }).click();
    await expect(frame).toHaveAttribute("data-theme", "dark");
  });

  test("keyboard-only approval path works", async ({ page }) => {
    const approve = page.getByRole("button", { name: "Send email" });
    await approve.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText(/Approved · consequence/)).toBeVisible();
  });

  test("has no axe violations (including color contrast)", async ({
    page,
  }) => {
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});

test("home page renders and has no axe violations", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: /Consent patterns/ })
  ).toBeVisible();
  // Primary hero CTA into the taxonomy (exact, so it doesn't also match the
  // "Browse the patterns →" links further down the page).
  await expect(
    page.getByRole("link", { name: "Browse the patterns", exact: true })
  ).toHaveAttribute("href", "/patterns/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
