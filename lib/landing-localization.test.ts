import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const readWorkspaceFile = (filePath: string): string =>
  readFileSync(join(process.cwd(), filePath), "utf8");

const parseJsonFile = <T>(filePath: string): T => JSON.parse(readWorkspaceFile(filePath)) as T;

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createVisibleCopyPattern = (phrase: string): RegExp =>
  new RegExp(`([>"'\`])\\s*${escapeRegExp(phrase)}\\s*([<"'\`])`);

const landingSourceFiles = [
  "app/(landing)/_components/landing-header.tsx",
  "app/(landing)/_components/landing-home.tsx",
  "app/(landing)/_components/landing-home-data.ts",
  "app/(landing)/_components/hero-playground.tsx",
  "app/(landing)/_components/comparison-showcase.tsx",
  "app/(landing)/_components/integrate-code-panel.tsx",
] as const;

const hardcodedLandingCopy = [
  "GET API KEY",
  "Turn any document into RAG-ready chunks",
  "Supported Formats",
  "Transparent Pricing",
  "Drop a file here or pick a sample on the left",
  "Parsing your document into structured chunks...",
  "Get $5 free credits, no card",
  "Feature",
  "Others",
  "Copied",
  "Copy",
] as const;

type LocaleMessages = {
  readonly Landing?: {
    readonly header?: {
      readonly nav?: {
        readonly playground?: string;
      };
    };
    readonly playground?: {
      readonly dragToParse?: string;
    };
  };
};

describe("landing localization contract", () => {
  it("stores landing copy in both locale message files", () => {
    const englishMessages = parseJsonFile<LocaleMessages>("i18n/locales/en.json");
    const chineseMessages = parseJsonFile<LocaleMessages>("i18n/locales/zh.json");

    expect(englishMessages.Landing).toBeDefined();
    expect(chineseMessages.Landing).toBeDefined();
  });

  it("keeps the drag-to-parse hint in English for every locale", () => {
    const englishMessages = parseJsonFile<LocaleMessages>("i18n/locales/en.json");
    const chineseMessages = parseJsonFile<LocaleMessages>("i18n/locales/zh.json");

    expect(englishMessages.Landing?.playground?.dragToParse).toBe("Drag to parse");
    expect(chineseMessages.Landing?.playground?.dragToParse).toBe("Drag to parse");
  });

  it("uses a natural Chinese label for the playground nav item", () => {
    const chineseMessages = parseJsonFile<LocaleMessages>("i18n/locales/zh.json");

    expect(chineseMessages.Landing?.header?.nav?.playground).toBe("在线体验");
  });

  it("keeps visible landing copy out of component source", () => {
    const combinedLandingSources = landingSourceFiles
      .map((filePath) => readWorkspaceFile(filePath))
      .join("\n");

    for (const phrase of hardcodedLandingCopy) {
      expect(combinedLandingSources).not.toMatch(createVisibleCopyPattern(phrase));
    }
  });
});
