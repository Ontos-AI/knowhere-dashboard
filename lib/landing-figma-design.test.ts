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

  it("ports prototype landing sections and mounts the newsletter prompt as an Addition", () => {
    const landingHomeSource: string = readFileSync(
      join(process.cwd(), "app/(landing)/_components/landing-home.tsx"),
      "utf8"
    );

    expect(landingHomeSource).toContain("ProductStage");
    expect(landingHomeSource).toContain('id="pricing"');
    expect(landingHomeSource).toContain('id="comparison"');
    expect(landingHomeSource).toContain("LandingTrackedLink");
    expect(landingHomeSource).not.toContain('className="footer"');
    expect(landingHomeSource).not.toContain("footer-wordmark");
    expect(landingHomeSource).toContain(
      'import { NewsletterSubscribePrompt } from "@app/(landing)/_components/newsletter-subscribe-prompt"'
    );
    expect(landingHomeSource).toContain("<NewsletterSubscribePrompt />");
    expect(landingHomeSource).not.toContain("SiteHeader");
    expect(landingHomeSource).not.toMatch(/['"]knowhere-language['"]/);
    expect(existsSync(join(process.cwd(), "public/assets/section-one-grid.svg"))).toBe(true);
    expect(existsSync(join(process.cwd(), "public/assets/knowhere-footer-wordmark.svg"))).toBe(
      true
    );

    const landingCss = readFileSync(
      join(process.cwd(), "app/(landing)/_components/landing.css"),
      "utf8"
    );
    expect(landingCss).toContain(".landing-page .skip-link");
    expect(landingCss).toContain("transform: translateY(-150%)");
    expect(landingCss).toContain("clip-path: inset(50%)");
    expect(landingCss).toMatch(/\.landing-page \.hero\s*\{[^}]*display:\s*grid/);
    expect(landingCss).toMatch(/\.landing-page #top\.hero-b-layout\s*\{[^}]*display:\s*grid/);
    expect(landingCss).toContain("display: inline-flex !important");
    expect(landingCss).toMatch(
      /\.landing-page #main #final-cta #final-cta-actions\s*\{[^}]*display:\s*grid\s*!important/
    );
    expect(landingCss).toMatch(/\.landing-page #faq\s*\{[^}]*display:\s*grid/);
    expect(landingCss).not.toMatch(/(?:^|[,{}])\s*#faq(?:\s|,|\{|\.)/);
    expect(landingCss).toContain("html:has(.landing-page)");
    expect(landingCss).not.toMatch(/(?:^|[,{}])\s*\.hero-copy\s*[,{]/);
    expect(landingCss).not.toMatch(/(?:^|[,{}])\s*\.github-link\s*[,{]/);
    expect(landingCss).not.toMatch(/(?:^|[,{}])\s*\.section\s*\{/);
    expect(landingCss).not.toMatch(/(?:^|[,{}])\s*#top\.hero-b-layout\s*\{/);
  });

  it("keeps the mounted newsletter prompt on the Landing surface tokens", () => {
    const promptSource: string = readFileSync(
      join(process.cwd(), "app/(landing)/_components/newsletter-subscribe-prompt.tsx"),
      "utf8"
    );
    const promptCss: string = readFileSync(
      join(process.cwd(), "app/(landing)/_components/newsletter-subscribe-prompt.css"),
      "utf8"
    );

    expect(promptSource).toContain(
      'import "@app/(landing)/_components/newsletter-subscribe-prompt.css"'
    );
    expect(promptSource).toContain("NEWSLETTER_DISMISS_STORAGE_KEY");
    expect(promptSource).toContain('aria-live="polite"');

    // The prompt floats over Landing, so it reads the tokens `.landing-page` declares instead of
    // carrying its own palette. A literal colour here would escape the brand ramp and the dark
    // theme in landing.css, which is exactly what the old violet prompt did.
    expect(promptCss).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(promptCss).toContain("var(--control-surface)");
    expect(promptCss).toContain("var(--control-border)");
    expect(promptCss).toContain("var(--control-black-surface)");
    expect(promptCss).toContain("var(--control-focus)");
    expect(promptCss).toContain("var(--radius-card)");
    expect(promptCss).toContain("var(--page-primary)");
    expect(promptCss).toContain("var(--ink)");
    expect(promptCss).toContain("var(--muted)");
    expect(promptCss).toMatch(/\.newsletter-prompt-input:focus-visible\s*\{[^}]*outline:/);
  });

  it("renders the Landing footer from the shared site chrome", () => {
    const siteChromeSource: string = readFileSync(
      join(process.cwd(), "components/site-chrome/site-chrome.tsx"),
      "utf8"
    );

    expect(siteChromeSource).toContain("<SiteFooter page={page} />");
    expect(siteChromeSource).not.toContain('page === "landing"');
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
