import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("landing contracts", () => {
  it("keeps the root landing route on the main landing page", () => {
    const landingPageSource: string = readFileSync(
      join(process.cwd(), "app/(landing)/page.tsx"),
      "utf8"
    );

    expect(landingPageSource).toContain("LandingHome");
    expect(landingPageSource).not.toContain("ClawPage");
  });

  it("keeps the landing header connected to the product playground and repository", () => {
    const landingHeaderSource: string = readFileSync(
      join(process.cwd(), "app/(landing)/_components/landing-header.tsx"),
      "utf8"
    );

    expect(landingHeaderSource).toContain(
      '{ href: "https://notebook.knowhereto.ai", label: "Playground", external: true }'
    );
    expect(landingHeaderSource).toContain(
      '{ href: "https://github.com/Ontos-AI/knowhere", label: "GitHub", external: true }'
    );
  });

  it("keeps the playground sample area annotated with the drag-to-parse cue", () => {
    const heroPlaygroundSource: string = readFileSync(
      join(process.cwd(), "app/(landing)/_components/hero-playground.tsx"),
      "utf8"
    );
    const englishMessagesSource: string = readFileSync(
      join(process.cwd(), "i18n/locales/en.json"),
      "utf8"
    );
    const chineseMessagesSource: string = readFileSync(
      join(process.cwd(), "i18n/locales/zh.json"),
      "utf8"
    );

    expect(heroPlaygroundSource).toContain('useTranslations("LandingPlayground")');
    expect(heroPlaygroundSource).not.toContain(">Drag to parse<");
    expect(heroPlaygroundSource).not.toContain(">拖到右边解析<");
    expect(englishMessagesSource).toContain('"dragToParse": "Drag to parse"');
    expect(chineseMessagesSource).toContain('"dragToParse": "拖到右边解析"');
  });
});
