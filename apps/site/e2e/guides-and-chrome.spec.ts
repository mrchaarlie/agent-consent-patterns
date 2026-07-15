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

  test("skill guide selects installation instructions for popular agents", async ({
    page,
  }) => {
    await page.goto("/skill/");
    await expect(
      page.getByRole("heading", { level: 1, name: "Agent skill" }),
    ).toBeVisible();
    const installer = page.locator('[data-acp="skill-installer"]');
    await expect(installer.getByLabel("Choose your agent")).toHaveValue("claude");
    for (const name of [
      "Claude",
      "ChatGPT (Codex)",
      "Gemini CLI",
      "Cursor",
      "Qwen Code",
      "DeepSeek (Deep Code)",
      "Grok",
      "GitHub Copilot",
      "Windsurf",
      "Other compatible agent",
    ]) {
      // Native <select> options report as hidden while the dropdown is closed;
      // assert the option exists rather than that it is visible.
      await expect(installer.getByRole("option", { name })).toHaveCount(1);
    }
    await expect(installer.getByRole("radio", { name: "CLI" })).toBeChecked();
    await expect(installer.getByRole("radio", { name: "Project" })).toBeChecked();
    await expect(
      installer.getByText("claude plugin marketplace add mrchaarlie/agent-consent-patterns"),
    ).toBeVisible();
    await expect(installer.getByRole("button", { name: "Copy to clipboard" })).toBeVisible();

    await installer.getByText("App", { exact: true }).click();
    // Natural-language option comes first, then the manual marketplace steps.
    await expect(
      installer.getByRole("heading", { level: 3 }).first(),
    ).toHaveText("Ask in natural language");
    await expect(
      installer.getByText("In any Claude chat, send this message."),
    ).toBeVisible();
    await expect(
      installer.getByText(
        "Add the Agent Consent Patterns plugin from https://github.com/mrchaarlie/agent-consent-patterns",
      ),
    ).toBeVisible();
    await expect(
      installer.getByRole("heading", { name: "Or, add it from the marketplace" }),
    ).toBeVisible();
    await expect(installer.getByText("Customize, then Plugins.")).toBeVisible();
    await expect(
      installer.getByText("Select agent-consent-patterns from the marketplace"),
    ).toBeVisible();
    await expect(
      installer.getByRole("button", { name: "Copy repository URL" }),
    ).toBeVisible();

    await installer.getByLabel("Choose your agent").selectOption("chatgpt-codex");
    await expect(installer.getByRole("radio", { name: "App" })).toBeChecked();
    // Natural-language option comes first, then the Plugins page search.
    await expect(
      installer.getByRole("heading", { level: 3 }).first(),
    ).toHaveText("Ask in natural language");
    await expect(
      installer.getByText("In a ChatGPT (Codex) task, send this message."),
    ).toBeVisible();
    await expect(
      installer.getByText(
        "Add the Agent Consent Patterns plugin from https://github.com/mrchaarlie/agent-consent-patterns",
      ),
    ).toBeVisible();
    await expect(
      installer.getByRole("heading", { name: "Find it in the Plugins page" }),
    ).toBeVisible();
    await expect(
      installer.getByText(
        "Open the Plugins page, search for \"Agent Consent Patterns\", then install the official plugin.",
      ),
    ).toBeVisible();
    await installer.getByText("CLI", { exact: true }).click();
    await expect(
      installer.getByText("codex plugin marketplace add mrchaarlie/agent-consent-patterns"),
    ).toBeVisible();

    await installer.getByLabel("Choose your agent").selectOption("other");
    await expect(
      installer.getByText(
        "Download or copy this portable SKILL.md into your agent's documented skills location.",
      ),
    ).toBeVisible();
    await expect(installer.getByText("Install with")).toHaveCount(0);
    await expect(installer.getByRole("radio")).toHaveCount(0);

    await installer.getByLabel("Choose your agent").selectOption("grok");
    await expect(installer.getByRole("radio", { name: "Project" })).toBeChecked();
    await expect(
      installer.getByText("mkdir -p .grok/skills/agent-consent-patterns && curl -fsSL https://raw.githubusercontent.com/mrchaarlie/agent-consent-patterns/main/plugins/agent-consent-patterns/skills/agent-consent-patterns/SKILL.md -o .grok/skills/agent-consent-patterns/SKILL.md"),
    ).toBeVisible();
    await installer.getByText("Global", { exact: true }).click();
    await expect(
      installer.getByText("mkdir -p ~/.grok/skills/agent-consent-patterns && curl -fsSL https://raw.githubusercontent.com/mrchaarlie/agent-consent-patterns/main/plugins/agent-consent-patterns/skills/agent-consent-patterns/SKILL.md -o ~/.grok/skills/agent-consent-patterns/SKILL.md"),
    ).toBeVisible();

    await installer.getByLabel("Choose your agent").selectOption("copilot");
    await expect(
      installer.getByText("mkdir -p .github/skills/agent-consent-patterns && curl -fsSL https://raw.githubusercontent.com/mrchaarlie/agent-consent-patterns/main/plugins/agent-consent-patterns/skills/agent-consent-patterns/SKILL.md -o .github/skills/agent-consent-patterns/SKILL.md"),
    ).toBeVisible();

    await installer.getByLabel("Choose your agent").selectOption("windsurf");
    await expect(
      installer.getByText("Windsurf's 6,000-character global-rule limit"),
    ).toBeVisible();
    await expect(installer.locator("ol")).toHaveCount(0);

    await installer.getByLabel("Choose your agent").selectOption("cursor");
    await expect(installer.getByRole("radio", { name: "Project" })).toBeChecked();
    await expect(
      installer.getByText("mkdir -p .cursor/rules && { printf '%s\\n' '---' 'description: Design and review consent, permission, approval, and human-in-the-loop UX.' 'alwaysApply: false' '---' && curl -fsSL https://raw.githubusercontent.com/mrchaarlie/agent-consent-patterns/main/plugins/agent-consent-patterns/skills/agent-consent-patterns/SKILL.md | awk 'BEGIN { delimiters = 0 } { if (delimiters < 2 && /^---$/) { delimiters++; next } if (delimiters >= 2) print }'; } > .cursor/rules/agent-consent-patterns.mdc"),
    ).toBeVisible();
    await installer.getByText("Global", { exact: true }).click();
    await expect(installer.getByRole("radio", { name: "Global" })).toBeChecked();
    await expect(
      installer.getByText("Open Cursor Settings, then Rules."),
    ).toBeVisible();
    await expect(
      installer.getByRole("link", { name: "Get the portable SKILL.md" }),
    ).toHaveAttribute(
      "href",
      "https://raw.githubusercontent.com/mrchaarlie/agent-consent-patterns/main/plugins/agent-consent-patterns/skills/agent-consent-patterns/SKILL.md",
    );
    await expect(installer.getByText(".cursor/skills", { exact: false })).toHaveCount(0);
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
