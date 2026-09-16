import { readFileSync } from "node:fs";
import { join } from "node:path";
import { brandColor, colorHex, siteThemes } from "@lib/knowhere-tokens";
import { describe, expect, it } from "vitest";

describe("wave 0 site tokens", () => {
  it("keeps Brand 500s aligned with the prototype 500 ramps", () => {
    expect(brandColor.mistWhite).toBe(colorHex["mist-white"][500]);
    expect(brandColor.mineralGreen).toBe(colorHex["mineral-green"][500]);
    expect(brandColor.deepTeal).toBe(colorHex["deep-teal"][500]);
    expect(brandColor.coralSignal).toBe(colorHex["coral-signal"][500]);
  });

  it("loads Poppins, Frex, and Geist Mono instead of Geist Sans", () => {
    const layoutSource: string = readFileSync(join(process.cwd(), "app/layout.tsx"), "utf8");

    expect(layoutSource).toContain("Poppins-Variable.woff2");
    expect(layoutSource).toContain("FrexSansGB-VF.woff2");
    expect(layoutSource).toContain("GeistMono-Regular.woff2");
    expect(layoutSource).toContain('variable: "--font-poppins"');
    expect(layoutSource).toContain('variable: "--font-frex"');
    expect(layoutSource).toContain('variable: "--font-geist-mono"');
    expect(layoutSource).not.toContain("Geist-VariableFont_wght.ttf");
    expect(layoutSource).not.toContain("--font-geist-sans");
  });

  it("scopes prototype ramps and semantic tokens to .kh-site", () => {
    const siteCss: string = readFileSync(join(process.cwd(), "app/kh-site.css"), "utf8");

    expect(siteCss).toContain("--kh-mist-white: #f0f2e6");
    expect(siteCss).toContain("--kh-mineral-green: #19a88b");
    expect(siteCss).toContain("--kh-deep-teal: #083b3a");
    expect(siteCss).toContain("--kh-coral-signal: #ff634a");
    expect(siteCss).toContain(".kh-site {");
    expect(siteCss).toContain("--mist-white-500: #f0f2e6");
    expect(siteCss).toContain("--paper: #ffffff");
    expect(siteCss).toContain("--chrome-paper: #ffffff");
    expect(siteCss).toContain(".dark .kh-site");
    expect(siteCss).toContain('html[data-theme="dark"] .kh-site');
    expect(siteCss).toContain("--ink: #f9faf5");
    expect(siteCss).toContain("--mist-white-900: #f9faf5");
  });

  it("exposes a three-option Site Theme menu modeled on the language switcher", () => {
    const themeSwitcherSource: string = readFileSync(
      join(process.cwd(), "components/theme-switcher.tsx"),
      "utf8"
    );

    expect(siteThemes).toEqual(["system", "light", "dark"]);
    expect(themeSwitcherSource).toContain("<DropdownMenu modal={false}>");
    expect(themeSwitcherSource).toContain('["light", "dark", "system"]');
    expect(themeSwitcherSource).toContain('t("themeLight")');
    expect(themeSwitcherSource).toContain('t("themeDark")');
    expect(themeSwitcherSource).toContain('t("themeSystem")');
    expect(themeSwitcherSource).toContain("setTheme(menuTheme)");
    expect(themeSwitcherSource).toContain("aria-checked={isActive}");
    expect(themeSwitcherSource).not.toContain("border-[#e4e4e7]");
  });

  it("persists Site Theme through next-themes localStorage", () => {
    const themeProviderSource: string = readFileSync(
      join(process.cwd(), "components/theme-provider.tsx"),
      "utf8"
    );

    expect(themeProviderSource).toContain('storageKey = "theme"');
    expect(themeProviderSource).toContain('defaultTheme = "system"');
    expect(themeProviderSource).toContain("enableSystem = true");
    expect(themeProviderSource).toContain('attribute = ["class", "data-theme"]');
  });
});
