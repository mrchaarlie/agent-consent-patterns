import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Guides and site navigation", () => {
  test("Reference and Build menus expose their grouped destinations", async ({
    page,
  }) => {
    await page.goto("/");

    const reference = page.getByText("Reference", { exact: true });
    await reference.click();
    await expect(reference).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("link", { name: "Patterns", exact: true })).toHaveAttribute(
      "href",
      "/patterns/",
    );
    await expect(page.getByRole("link", { name: "Principles", exact: true })).toHaveAttribute(
      "href",
      "/principles/",
    );
    await expect(page.getByRole("link", { name: "Glossary", exact: true })).toHaveAttribute(
      "href",
      "/glossary/",
    );

    const build = page.getByText("Build", { exact: true });
    await build.focus();
    await page.keyboard.press("Enter");
    await expect(reference).toHaveAttribute("aria-expanded", "false");
    await expect(build).toHaveAttribute("aria-expanded", "true");
    await expect(
      page.getByRole("link", { name: "React library" }),
    ).toHaveAttribute("href", "/library/");
    await expect(page.getByRole("link", { name: "Agent skill" })).toHaveAttribute(
      "href",
      "/skill/",
    );

    await page.locator("#main").click({ position: { x: 8, y: 8 } });
    await expect(build).toHaveAttribute("aria-expanded", "false");

    await reference.click();
    await page.keyboard.press("Escape");
    await expect(reference).toHaveAttribute("aria-expanded", "false");
  });

  test("library guide gives install and composition guidance", async ({ page }) => {
    await page.goto("/library/");
    await expect(
      page.getByRole("heading", { level: 1, name: "React library" }),
    ).toBeVisible();
    await expect(page.getByText("npm install @agentconsent/react")).toBeVisible();
    await expect(page.getByText("ActionPreview.Root")).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("skill guide gives Claude, Codex, and portable setup paths", async ({
    page,
  }) => {
    await page.goto("/skill/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Agent skill" }),
    ).toBeVisible();
    await expect(
      page.getByText("codex plugin marketplace add mrchaarlie/agent-consent-patterns"),
    ).toBeVisible();
    await expect(page.getByText("Other compatible agents")).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("footer publishes the contact address", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "mailto:contact@agentconsent.dev",
    );

    const readingLabel = page.getByText("Reading level", { exact: true });
    const readingSelect = page.locator('[data-acp="reading-level"] select');
    const labelBox = await readingLabel.boundingBox();
    const selectBox = await readingSelect.boundingBox();
    expect(labelBox?.x).toBeLessThan(selectBox?.x ?? 0);

    for (const width of [780, 1024]) {
      await page.setViewportSize({ width, height: 800 });
      const buildBox = await page.getByText("Build", { exact: true }).boundingBox();
      const readingBox = await page.locator('[data-acp="reading-level"]').boundingBox();
      expect(buildBox).not.toBeNull();
      expect(readingBox).not.toBeNull();
      expect(buildBox!.x + buildBox!.width + 16).toBeLessThanOrEqual(readingBox!.x);
      expect(buildBox!.y + buildBox!.height).toBeGreaterThan(readingBox!.y);
      expect(readingBox!.y + readingBox!.height).toBeGreaterThan(buildBox!.y);
    }

    await page.setViewportSize({ width: 375, height: 800 });
    const mobileBuildBox = await page.getByText("Build", { exact: true }).boundingBox();
    const mobileReadingBox = await page.locator('[data-acp="reading-level"]').boundingBox();
    expect(mobileBuildBox).not.toBeNull();
    expect(mobileReadingBox).not.toBeNull();
    expect(mobileBuildBox!.y + mobileBuildBox!.height).toBeLessThanOrEqual(mobileReadingBox!.y);
    await expect(page.getByText("Reading level", { exact: true })).toBeVisible();
    await expect(page.getByText("Agent Consent Patterns", { exact: true })).toBeHidden();

    const licenseBox = await page.getByText("MIT licensed.", { exact: false }).boundingBox();
    const moreNavBox = await page.getByRole("navigation", { name: "More" }).boundingBox();
    expect(licenseBox).not.toBeNull();
    expect(moreNavBox).not.toBeNull();
    expect(licenseBox!.y + licenseBox!.height).toBeLessThanOrEqual(moreNavBox!.y);

    const theme = page.locator('[data-acp="theme-switch"] select');
    await expect(theme).toHaveValue("system");
    await theme.selectOption("dark");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    const themeBox = await theme.boundingBox();
    expect(themeBox).not.toBeNull();
    expect(moreNavBox!.y + moreNavBox!.height).toBeGreaterThan(themeBox!.y);
    expect(themeBox!.y + themeBox!.height).toBeGreaterThan(moreNavBox!.y);
    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();
    expect((viewport?.width ?? 0) - ((themeBox?.x ?? 0) + (themeBox?.width ?? 0))).toBeLessThanOrEqual(32);
  });
});
