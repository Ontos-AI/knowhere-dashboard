import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { brandColor } from "@lib/knowhere-tokens";
import { describe, expect, it } from "vitest";

const readWorkspaceFile = (relativePath: string): string => {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
};

const collectSourceFiles = (directory: string): readonly string[] => {
  return readdirSync(join(process.cwd(), directory), { withFileTypes: true }).flatMap((entry) => {
    const relativePath: string = join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectSourceFiles(relativePath);
    }

    return entry.name.endsWith(".tsx") || entry.name.endsWith(".ts") ? [relativePath] : [];
  });
};

describe("wave 6 dashboard brand restyle", () => {
  it("retargets shadcn tokens toward Mist White, Deep Teal, Mineral Green, and Coral Signal", () => {
    const globalsCss: string = readWorkspaceFile("app/globals.css");

    expect(globalsCss).toContain("--background: 70 32% 93%");
    expect(globalsCss).toContain("--foreground: 179 76% 13%");
    expect(globalsCss).toContain("--primary: 168 74% 38%");
    expect(globalsCss).toContain("--destructive: 8 100% 65%");
    expect(globalsCss).not.toContain("--primary: 221.2 83.2% 53.3%");
    expect(brandColor.mistWhite).toBe("#F0F2E6");
    expect(brandColor.deepTeal).toBe("#083B3A");
    expect(brandColor.mineralGreen).toBe("#19A88B");
    expect(brandColor.coralSignal).toBe("#FF634A");
  });

  it("keeps prototype ramps in kh-site.css", () => {
    const siteCss: string = readWorkspaceFile("app/kh-site.css");

    expect(siteCss).toContain(".kh-site {");
    expect(siteCss).toContain("--mist-white-500: #f0f2e6");
  });

  it("uses the three-way Site Theme on dashboard shell, sidebar, and settings", () => {
    const shellSource: string = readWorkspaceFile(
      "app/(dashboard)/_components/dashboard-shell.tsx"
    );
    const sidebarSource: string = readWorkspaceFile("app/(dashboard)/_components/sidebar.tsx");
    const settingsSource: string = readWorkspaceFile(
      "app/(dashboard)/settings/_components/settings-page.tsx"
    );

    expect(shellSource).toContain("<ThemeSwitcher>");
    expect(shellSource).toContain('setTheme("light")');
    expect(shellSource).toContain('setTheme("dark")');
    expect(shellSource).toContain('setTheme("system")');
    expect(shellSource).not.toContain('setTheme(isDark ? "light" : "dark")');

    expect(sidebarSource).toContain('t("themeLight")');
    expect(sidebarSource).toContain('t("themeDark")');
    expect(sidebarSource).toContain('t("themeSystem")');
    expect(sidebarSource).not.toContain("ThemeSwitch");
    expect(sidebarSource).not.toContain('setTheme(checked ? "dark" : "light")');

    expect(settingsSource).toContain('value="light"');
    expect(settingsSource).toContain('value="dark"');
    expect(settingsSource).toContain('value="system"');
    expect(settingsSource).not.toContain("SettingsThemeSwitch");
  });

  it("brands the GitHub hop without Login chrome", () => {
    const githubSource: string = readWorkspaceFile("app/github/page.tsx");

    expect(githubSource).toContain("KnowhereBrand");
    expect(githubSource).toContain("bg-[#f0f2e6]");
    expect(githubSource).toContain("text-[#083b3a]");
    expect(githubSource).toContain("text-[#19a88b]");
    expect(githubSource).not.toContain("kh-site");
    expect(githubSource).not.toContain("login-page-shell");
  });

  it("retargets leftover dashboard form and billing chrome away from blue/purple", () => {
    const inputSource = readWorkspaceFile("components/ui/input.tsx");
    const checkboxSource = readWorkspaceFile("components/ui/checkbox.tsx");
    const billingSource = readWorkspaceFile("app/(dashboard)/billing/page.tsx");
    const uploadSource = readWorkspaceFile("components/features/jobs/file-upload-flow.tsx");

    expect(inputSource).toContain("focus-visible:border-primary");
    expect(inputSource).not.toContain("border-blue-600");
    expect(checkboxSource).toContain("data-[state=checked]:bg-primary");
    expect(checkboxSource).not.toContain("bg-blue-600");
    expect(billingSource).toContain("DashboardActionButton");
    expect(billingSource).not.toContain('from "@components/ui/button"');
    expect(uploadSource).toContain("text-primary");
    expect(uploadSource).not.toContain("text-blue-500");
  });

  it("retargets dashboard tables and dialogs away from zinc hex", () => {
    const zincHexes = [
      "#e4e4e7",
      "#09090b",
      "#71717b",
      "#18181b",
      "#3f3f46",
      "#fafafa",
      "#27272a",
      "#f4f4f5",
      "#9f9fa9",
      "#52525c",
    ] as const;
    const sources = [
      "app/(dashboard)/_components/dashboard-modal-primitives.tsx",
      "app/(dashboard)/_components/dashboard-action-button.tsx",
      "app/(dashboard)/api-keys/_components/api-keys-table.tsx",
      "app/(dashboard)/usage/_components/usage-table.tsx",
      "app/(dashboard)/usage/_components/usage-welcome-modal.tsx",
      "app/(dashboard)/webhooks/secrets/_components/secrets-table.tsx",
      "app/(dashboard)/settings/_components/settings-page.tsx",
      "app/(dashboard)/billing/_components/buy-credits-modal.tsx",
      "components/ui/select.tsx",
    ] as const;

    for (const relativePath of sources) {
      const source = readWorkspaceFile(relativePath);
      for (const hex of zincHexes) {
        expect(source, `${relativePath} still contains ${hex}`).not.toContain(hex);
      }
    }
  });
});

describe("wave 7 dashboard brand restyle", () => {
  it("keeps logged-in type inside the documented Regular / Medium / SemiBold hierarchy", () => {
    const undocumentedWeights = /\bfont-(light|bold|extrabold|black)\b/;

    for (const relativePath of collectSourceFiles("app/(dashboard)")) {
      expect(
        readWorkspaceFile(relativePath),
        `${relativePath} uses a weight outside 400 / 500 / 600`
      ).not.toMatch(undocumentedWeights);
    }
  });

  it("renders the error boundary with the dashboard button instead of the legacy primitive", () => {
    const boundarySource: string = readWorkspaceFile("components/common/error-boundary.tsx");

    expect(boundarySource).toContain("DashboardActionButton");
    expect(boundarySource).not.toContain("@components/ui/button");
    expect(boundarySource).not.toContain("rounded-2xl");
  });

  it("renders the usage upload flow with brand surfaces and the dashboard button", () => {
    const uploadSource: string = readWorkspaceFile("components/features/jobs/file-upload-flow.tsx");
    const offBrandPalette =
      /\b(text|bg|border|from|to|via)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3}\b/;

    expect(uploadSource).toContain("DashboardActionButton");
    expect(uploadSource).not.toContain("@components/ui/button");
    expect(uploadSource).not.toMatch(offBrandPalette);
  });

  it("gives the usage pagination input a light-theme surface", () => {
    const tableSource: string = readWorkspaceFile(
      "app/(dashboard)/usage/_components/usage-table.tsx"
    );
    const paginationInputClassName: string | undefined = tableSource
      .match(/className="h-8 w-\[77px\][^"]*"/)?.[0]
      .replace(/^className="/, "");

    expect(paginationInputClassName).toBeDefined();
    expect(paginationInputClassName).toContain("bg-card");
  });
});
