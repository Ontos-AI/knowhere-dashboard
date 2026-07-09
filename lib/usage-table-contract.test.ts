import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const readWorkspaceFile = (path: string): string => readFileSync(join(process.cwd(), path), "utf8");

describe("Usage table contracts", () => {
  it("does not expose OCR as a usage-table field", () => {
    const usageTableSource: string = readWorkspaceFile(
      "app/(dashboard)/usage/_components/usage-table.tsx"
    );
    const useJobsSource: string = readWorkspaceFile("app/(dashboard)/usage/_hooks/use-jobs.ts");
    const englishMessages = JSON.parse(readWorkspaceFile("i18n/locales/en.json")) as {
      UsageTable: Record<string, string>;
    };
    const chineseMessages = JSON.parse(readWorkspaceFile("i18n/locales/zh.json")) as {
      UsageTable: Record<string, string>;
    };

    expect(usageTableSource).not.toMatch(/\bocr\b/i);
    expect(useJobsSource).not.toMatch(/\bocr\b/i);
    expect(englishMessages.UsageTable).not.toHaveProperty("ocr");
    expect(englishMessages.UsageTable).not.toHaveProperty("yes");
    expect(englishMessages.UsageTable).not.toHaveProperty("no");
    expect(chineseMessages.UsageTable).not.toHaveProperty("ocr");
    expect(chineseMessages.UsageTable).not.toHaveProperty("yes");
    expect(chineseMessages.UsageTable).not.toHaveProperty("no");
  });

  it("uses the Figma download result icon for row actions", () => {
    const rowActionIconSource: string = readWorkspaceFile("public/icons/usage/row-action.svg");

    expect(rowActionIconSource).toContain('viewBox="0 0 10.6667 10.6667"');
    expect(rowActionIconSource).toContain("#71717B");
    expect(rowActionIconSource).toContain("M5.33333 8L2 4.66667");
    expect(rowActionIconSource).not.toContain("#FD9A00");
  });

  it("uses dark-mode palette variables for file type badges", () => {
    const usageTableSource: string = readWorkspaceFile(
      "app/(dashboard)/usage/_components/usage-table.tsx"
    );

    expect(usageTableSource).toContain("darkBackground");
    expect(usageTableSource).toContain("darkBorder");
    expect(usageTableSource).toContain("darkText");
    expect(usageTableSource).toContain("dark:bg-[var(--file-type-dark-background)]");
    expect(usageTableSource).not.toContain("backgroundColor: fileTypeTheme.background");
  });

  it("formats visible usage dates through a compact localized date formatter", (): void => {
    const usagePageSource: string = readWorkspaceFile("app/(dashboard)/usage/page.tsx");

    expect(usagePageSource).toContain("formatUsageTableDate");
    expect(usagePageSource).toContain("usageTableDateFormatterOptions");
    expect(usagePageSource).toContain('second: "2-digit"');
    expect(usagePageSource).toContain("locale");
    expect(usagePageSource).toContain("timeZone: timezone");
    expect(usagePageSource).not.toContain("MM/dd/yyyy, hh:mm:ss aa");
  });

  it("keeps visible usage dates on one line", (): void => {
    const usageTableSource: string = readWorkspaceFile(
      "app/(dashboard)/usage/_components/usage-table.tsx"
    );
    const usagePageSource: string = readWorkspaceFile("app/(dashboard)/usage/page.tsx");

    expect(usageTableSource).toContain(
      "font-mono-display leading-4 whitespace-nowrap text-[#3f3f46]"
    );
    expect(usagePageSource).not.toContain('format: "long"');
  });

  it("keeps the usage upload button label on one line", (): void => {
    const usagePageSource: string = readWorkspaceFile("app/(dashboard)/usage/page.tsx");

    expect(usagePageSource).toContain("min-w-[132px]");
    expect(usagePageSource).toContain("whitespace-nowrap");
    expect(usagePageSource).not.toContain('UsageFileUpload className="h-9 w-[121px]');
  });
});
