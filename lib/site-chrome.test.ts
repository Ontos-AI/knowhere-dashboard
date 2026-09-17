import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  siteChromeLinks,
  siteChromeNavCtaIds,
  siteChromeNavigation,
} from "@components/site-chrome/links";
import { describe, expect, it } from "vitest";

const readWorkspaceFile = (filePath: string): string =>
  readFileSync(join(process.cwd(), filePath), "utf8");

describe("wave 1 site chrome", () => {
  it("uses live destinations and ctaIds instead of prototype worker URLs", () => {
    const landingNav = siteChromeNavigation("landing");
    const pricingNav = siteChromeNavigation("pricing");

    expect(landingNav).toEqual([
      { key: "comparison", href: "#comparison", ctaId: "comparison" },
      { key: "pricing", href: "/pricing", ctaId: "pricing" },
      {
        key: "docs",
        href: "https://docs.knowhereto.ai/",
        ctaId: "docs",
        external: true,
      },
      {
        key: "playground",
        href: "https://notebook.knowhereto.ai",
        ctaId: "playground_external",
        external: true,
      },
      { key: "blog", href: "/blog", ctaId: "blog" },
    ]);

    expect(pricingNav.find((item) => item.key === "comparison")?.href).toBe("/#comparison");
    expect(siteChromeLinks.github).toBe("/github");
    expect(siteChromeLinks.login).toBe("/login");
    expect(siteChromeNavCtaIds.blog).toBe("blog");
    expect(siteChromeNavCtaIds.github).toBe("github");
    expect(siteChromeNavCtaIds.getApiKey).toBe("get_api_key");
  });

  it("wraps Landing with shared SiteChrome so Pricing and Blog can import the same shell", () => {
    const landingPageSource = readWorkspaceFile("app/(landing)/page.tsx");
    const landingHomeSource = readWorkspaceFile("app/(landing)/_components/landing-home.tsx");
    const headerSource = readWorkspaceFile("components/site-chrome/site-header.tsx");

    expect(landingPageSource).toContain('import { SiteChrome } from "@components/site-chrome"');
    expect(landingPageSource).toContain('<SiteChrome page="landing">');
    expect(landingHomeSource).not.toContain("LandingHeader");
    expect(headerSource).toContain("LanguageSwitcher");
    expect(headerSource).toContain("ThemeSwitcher");
    expect(headerSource).toContain("LandingTrackedLink");
    expect(headerSource).toContain("kh-site-chrome-menu");
    expect(headerSource).not.toContain("knowhere-language");

    const chromeSource = readWorkspaceFile("components/site-chrome/site-chrome.tsx");
    expect(chromeSource).toContain('page === "landing" ? null : <SiteFooter page={page} />');
  });

  it("ports the prototype language and theme option-list chrome", () => {
    const chromeCss = readWorkspaceFile("components/site-chrome/site-chrome.css");

    expect(chromeCss).toContain(".kh-site-chrome-menu");
    expect(chromeCss).toContain("width: 148px");
    expect(chromeCss).toContain("min-height: 44px");
    expect(chromeCss).toContain("font-family: var(--mono)");
    expect(chromeCss).toContain(".skip-link");
    expect(chromeCss).toContain("clip-path: inset(50%)");
    expect(chromeCss).toContain("filter: invert(1) !important");
    expect(chromeCss).toContain(".kh-site:has(.kh-pricing) .kh-site-main");
    expect(chromeCss).toContain(".kh-site:has(.kb) .kh-site-main");
    expect(chromeCss).toContain(".kh-site:has(.landing-page) .kh-site-main");

    const pricingCss = readWorkspaceFile("app/(landing)/pricing/_components/pricing-page.css");
    expect(pricingCss).toContain("padding-block: 110px 60px");
    expect(pricingCss).not.toContain("110px - var(--header-height");
    expect(pricingCss).toContain(".kh-pricing #faq");
    expect(pricingCss).toMatch(/\.kh-pricing #faq\s*\{[^}]*display:\s*block/);
    expect(pricingCss).toMatch(
      /\.kh-pricing #faq\s*\{[^}]*width:\s*min\(var\(--content-max\),\s*calc\(100% - var\(--layout-grid-edge\) \* 2\)\)/
    );
    expect(pricingCss).not.toMatch(/\.kh-pricing #faq\s*\{[^}]*max-width:\s*none/);
  });
});
