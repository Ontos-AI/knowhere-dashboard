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

  it("keeps the landing header connected to the documentation and repository", () => {
    const landingHeaderSource: string = readFileSync(
      join(process.cwd(), "app/(landing)/_components/landing-header.tsx"),
      "utf8"
    );

    expect(landingHeaderSource).toContain(
      '{ href: "https://docs.knowhereto.ai/", labelKey: "docs", external: true }'
    );
    expect(landingHeaderSource).toContain('{ href: "/github", labelKey: "github" }');
    expect(landingHeaderSource).not.toContain('labelKey: "playground"');
    expect(landingHeaderSource).not.toContain('labelKey: "pricing"');
    expect(landingHeaderSource).not.toContain('labelKey: "blog"');
  });

  it("keeps the playground sample area annotated with the drag-to-parse cue", () => {
    const heroPlaygroundSource: string = readFileSync(
      join(process.cwd(), "app/(landing)/_components/hero-playground.tsx"),
      "utf8"
    );

    expect(heroPlaygroundSource).toContain('useTranslations("Landing.playground")');
    expect(heroPlaygroundSource).toContain('t("dragToParse")');
    expect(heroPlaygroundSource).not.toContain(">拖到右边解析<");
  });

  it("keeps the shared language switcher from shifting the page when opened", () => {
    const languageSwitcherSource: string = readFileSync(
      join(process.cwd(), "components/language-switcher.tsx"),
      "utf8"
    );

    expect(languageSwitcherSource).toContain("<DropdownMenu modal={false}>");
  });
});
