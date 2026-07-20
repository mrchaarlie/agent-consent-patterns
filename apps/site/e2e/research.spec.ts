import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Research index with merged glossary", () => {
  test("one filter narrows both topics and glossary terms", async ({
    page,
  }) => {
    await page.goto("/research/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Research" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Glossary" }),
    ).toBeVisible();

    const input = page.locator("#research-search");
    await expect(page.locator('p[role="status"]')).toHaveText("12 topics · 12 terms");

    // "provenance" is a glossary term but not a topic (it also appears in a
    // few other terms' definitions, so only pin the topic count).
    await input.fill("provenance");
    await expect(page.locator('p[role="status"]')).toHaveText(
      /^0 topics · \d+ terms? match$/,
    );
    await expect(page.getByText("No topics match.")).toBeVisible();
    await expect(page.locator("#term-provenance")).toBeVisible();

    // "identity" hits topics; the Agent Identity card navigates.
    await input.fill("identity");
    await page
      .getByRole("link", { name: /Agent Identity/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/research\/agent-identity\/$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Agent Identity" }),
    ).toBeVisible();
    // Attribution footer is always present on topic pages.
    await expect(
      page.getByRole("heading", { level: 2, name: "Sources" }),
    ).toBeVisible();
  });

  test("topic pages cross-link related topics", async ({ page }) => {
    await page.goto("/research/agent-identity/");
    await page
      .getByRole("link", { name: /Delegated Authority/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/research\/delegated-authority\/$/);
  });

  test("no axe violations on the merged index", async ({ page }) => {
    await page.goto("/research/");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
