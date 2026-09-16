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
  "components/site-chrome/site-header.tsx",
  "components/site-chrome/site-footer.tsx",
  "app/(landing)/_components/landing-home.tsx",
] as const;

const hardcodedLandingCopy = [
  "GET API KEY",
  "Turn any document into RAG-ready chunks",
  "Supported Formats",
  "Transparent Pricing",
  "Drop a file here or pick a sample on the left",
  "Parsing your document into structured chunks...",
  "Get $5 free credits, no card",
  "Start free trial",
  "Simple, transparent pricing.",
  "Copy",
] as const;

type LocaleMessages = {
  readonly SiteChrome?: {
    readonly nav?: {
      readonly playground?: string;
    };
  };
  readonly Landing?: {
    readonly header?: {
      readonly nav?: {
        readonly playground?: string;
      };
    };
    readonly playground?: {
      readonly dragToParse?: string;
    };
    readonly skipToContent?: string;
    readonly hero?: {
      readonly title?: string;
      readonly startFreeTrial?: string;
    };
    readonly product?: {
      readonly title?: string;
    };
    readonly pricing?: {
      readonly title?: string;
    };
    readonly comparison?: {
      readonly feature?: string;
    };
    readonly integration?: {
      readonly copy?: string;
    };
    readonly finalCta?: {
      readonly title?: string;
    };
  };
};

describe("landing localization contract", () => {
  it("stores landing copy in both locale message files", () => {
    const englishMessages = parseJsonFile<LocaleMessages>("i18n/locales/en.json");
    const chineseMessages = parseJsonFile<LocaleMessages>("i18n/locales/zh.json");

    expect(englishMessages.Landing).toBeDefined();
    expect(chineseMessages.Landing).toBeDefined();
    expect(englishMessages.Landing?.hero?.title).toBeTruthy();
    expect(chineseMessages.Landing?.hero?.title).toBeTruthy();
    expect(englishMessages.Landing?.product?.title).toBeTruthy();
    expect(englishMessages.Landing?.pricing?.title).toBe("Simple, transparent pricing.");
    expect(chineseMessages.Landing?.pricing?.title).toBeTruthy();
    expect(englishMessages.Landing?.comparison?.feature).toBe("Feature");
    expect(englishMessages.Landing?.integration?.copy).toBe("Copy");
    expect(englishMessages.Landing?.finalCta?.title).toBeTruthy();
    expect(englishMessages.Landing?.skipToContent).toBe("Skip to content");
  });

  it("keeps the drag-to-parse hint in English for every locale", () => {
    const englishMessages = parseJsonFile<LocaleMessages>("i18n/locales/en.json");
    const chineseMessages = parseJsonFile<LocaleMessages>("i18n/locales/zh.json");

    expect(englishMessages.Landing?.playground?.dragToParse).toBe("Drag to parse");
    expect(chineseMessages.Landing?.playground?.dragToParse).toBe("Drag to parse");
  });

  it("uses a natural Chinese label for the playground nav item", () => {
    const chineseMessages = parseJsonFile<LocaleMessages>("i18n/locales/zh.json");

    expect(chineseMessages.SiteChrome?.nav?.playground).toBe("在线体验");
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
