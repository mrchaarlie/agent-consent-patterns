import AxeBuilder from "@axe-core/playwright";
import { type Page, expect, test } from "@playwright/test";

const SEARCH = '[data-acp="site-search"]';

/** The search input is revealed by the trigger button (or Cmd/Ctrl+K). */
async function openSearch(page: Page) {
  await page.locator(`${SEARCH} > button`).click();
  await expect(page.locator(`${SEARCH} input`)).toBeVisible();
}

test.describe("Site-wide header search", () => {
  test("typing filters and clicking a result navigates", async ({ page }) => {
    await page.goto("/");
    await openSearch(page);
    const input = page.locator(`${SEARCH} input`);
    await input.fill("scoped");
    await expect(input).toHaveAttribute("aria-expanded", "true");
    const option = page.getByRole("option", { name: /Scoped Grant/ });
    await expect(option).toBeVisible();
    await expect(option).toContainText("Pattern");
    await option.click();
    await expect(page).toHaveURL(/\/patterns\/scoped-grant\/$/);
    // Selecting a result collapses the search back to its icon.
    await expect(page.locator(`${SEARCH} input`)).toHaveCount(0);
  });

  test("Cmd/Ctrl+K opens the search, Escape collapses it", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(`${SEARCH} input`)).toHaveCount(0);
    await page.keyboard.press("ControlOrMeta+k");
    const input = page.locator(`${SEARCH} input`);
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
    // Escape on an empty query collapses the input entirely.
    await input.press("Escape");
    await expect(page.locator(`${SEARCH} input`)).toHaveCount(0);
  });

  test("keyboard: arrows move the active option, Enter navigates", async ({
    page,
  }) => {
    await page.goto("/");
    await openSearch(page);
    const input = page.locator(`${SEARCH} input`);
    await input.fill("agent identity");
    await expect(input).toHaveAttribute("aria-expanded", "true");
    const first = await input.getAttribute("aria-activedescendant");
    expect(first).toBe("site-search-opt-0");
    await input.press("ArrowDown");
    await expect(input).toHaveAttribute(
      "aria-activedescendant",
      "site-search-opt-1",
    );
    await input.press("ArrowUp");
    await expect(input).toHaveAttribute(
      "aria-activedescendant",
      "site-search-opt-0",
    );
    await input.press("Enter");
    await expect(page).toHaveURL(/\/research\/agent-identity\/$/);
  });

  test("glossary terms resolve to research-page anchors", async ({ page }) => {
    await page.goto("/");
    await openSearch(page);
    const input = page.locator(`${SEARCH} input`);
    await input.fill("confused");
    const option = page.getByRole("option", { name: /Confused deputy/ });
    await expect(option).toContainText("Term");
    await option.click();
    await expect(page).toHaveURL(/\/research\/#term-confused-deputy$/);
    await expect(page.locator("#term-confused-deputy")).toBeInViewport();
  });

  test("escape and outside clicks dismiss; empty and garbage queries behave", async ({
    page,
  }) => {
    await page.goto("/");
    await openSearch(page);
    const input = page.locator(`${SEARCH} input`);

    await expect(page.locator("#site-search-listbox")).toHaveCount(0);

    await input.fill("pattern");
    await expect(page.locator("#site-search-listbox")).toBeVisible();
    await input.press("Escape");
    await expect(page.locator("#site-search-listbox")).toHaveCount(0);

    await input.fill("zzzznothing");
    await expect(page.locator("#site-search-listbox")).toContainText(
      "No results",
    );
    // Scope to the listbox: the native selects in the chrome also expose
    // role="option" children.
    await expect(
      page.locator("#site-search-listbox").getByRole("option"),
    ).toHaveCount(0);

    await page.locator("#main").click({ position: { x: 8, y: 8 } });
    await expect(page.locator(`${SEARCH} input`)).toHaveCount(0);
  });

  test("no axe violations with the listbox open", async ({ page }) => {
    await page.goto("/");
    await openSearch(page);
    await page.locator(`${SEARCH} input`).fill("consent");
    await expect(page.locator("#site-search-listbox")).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
