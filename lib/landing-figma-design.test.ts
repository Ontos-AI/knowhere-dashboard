import { existsSync, readFileSync } from "node:fs";
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

  it("keeps the site chrome connected to live destinations", () => {
    const siteChromeLinksSource: string = readFileSync(
      join(process.cwd(), "components/site-chrome/links.ts"),
      "utf8"
    );

    expect(siteChromeLinksSource).toContain('playground: "https://notebook.knowhereto.ai"');
    expect(siteChromeLinksSource).toContain('github: "/github"');
    expect(siteChromeLinksSource).toContain('blog: "/blog"');
    expect(siteChromeLinksSource).toContain('pricing: "/pricing"');
    expect(siteChromeLinksSource).toContain("ctaId: siteChromeNavCtaIds.playground");
    expect(siteChromeLinksSource).toContain('blog: "blog"');
    expect(siteChromeLinksSource).not.toContain("blog.knowhereto.ai");
    expect(siteChromeLinksSource).not.toContain("github.com");
    expect(siteChromeLinksSource).not.toContain("/#pricing");
  });

  it("ports prototype landing sections without the newsletter prompt", () => {
    const landingHomeSource: string = readFileSync(
      join(process.cwd(), "app/(landing)/_components/landing-home.tsx"),
      "utf8"
    );

    expect(landingHomeSource).toContain("ProductStage");
    expect(landingHomeSource).toContain('id="pricing"');
    expect(landingHomeSource).toContain('id="comparison"');
    expect(landingHomeSource).toContain("LandingTrackedLink");
    expect(landingHomeSource).not.toContain("NewsletterSubscribePrompt");
    expect(landingHomeSource).not.toContain("SiteHeader");
    expect(landingHomeSource).not.toMatch(/['"]knowhere-language['"]/);
    expect(existsSync(join(process.cwd(), "public/assets/section-one-grid.svg"))).toBe(true);

    const landingCss = readFileSync(
      join(process.cwd(), "app/(landing)/_components/landing.css"),
      "utf8"
    );
    expect(landingCss).toContain(".landing-page .skip-link");
    expect(landingCss).toContain("transform: translateY(-150%)");
    expect(landingCss).toContain("clip-path: inset(50%)");
  });

  it("keeps the shared language switcher from shifting the page when opened", () => {
    const languageSwitcherSource: string = readFileSync(
      join(process.cwd(), "components/language-switcher.tsx"),
      "utf8"
    );

    expect(languageSwitcherSource).toContain("<DropdownMenu modal={false}>");
  });

  it("keeps blog on /blog date permalinks and captures pricing plus blog acquisition paths", () => {
    const blogPageSource: string = readFileSync(join(process.cwd(), "app/blog/page.tsx"), "utf8");
    const articlePageSource: string = readFileSync(
      join(process.cwd(), "app/blog/[year]/[month]/[day]/[slug]/page.tsx"),
      "utf8"
    );
    const blogLayoutSource: string = readFileSync(
      join(process.cwd(), "app/blog/layout.tsx"),
      "utf8"
    );
    const acquisitionSource: string = readFileSync(
      join(process.cwd(), "lib/acquisition-attribution/client.ts"),
      "utf8"
    );
    const nextConfigSource: string = readFileSync(join(process.cwd(), "next.config.js"), "utf8");

    expect(blogLayoutSource).toContain('page="blog"');
    expect(blogPageSource).toContain("getWordpressBlogIndex");
    expect(articlePageSource).toContain("getWordpressPostByPermalink");
    expect(articlePageSource).not.toContain("blog.knowhereto.ai");
    expect(acquisitionSource).toContain('"/blog"');
    expect(acquisitionSource).toContain('"/pricing"');
    expect(nextConfigSource).toContain("knowheretoai.wordpress.com");
    expect(nextConfigSource).toContain("*.wp.com");
  });
});
