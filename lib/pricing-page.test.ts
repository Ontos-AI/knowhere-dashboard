import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  BILLABLE_PACK_PAGES,
  BILLABLE_PAGE_RATE_USD,
  costForPages,
  formatUsd,
  PRICING_DOCS_HREF,
  PRICING_LOGIN_HREF,
  STANDARD_FILE_LIMITS,
} from "@app/(landing)/pricing/_components/pricing-data";
import { describe, expect, it } from "vitest";

const readWorkspaceFile = (filePath: string): string =>
  readFileSync(join(process.cwd(), filePath), "utf8");

describe("wave 3 pricing page", () => {
  it("adds /pricing in the landing route group with SiteChrome", () => {
    const pageSource = readWorkspaceFile("app/(landing)/pricing/page.tsx");

    expect(pageSource).toContain('import { SiteChrome } from "@components/site-chrome"');
    expect(pageSource).toContain('<SiteChrome page="pricing">');
    expect(pageSource).toContain("metadataBase: new URL(CANONICAL_ORIGIN)");
    expect(pageSource).toContain('const CANONICAL_ORIGIN = "https://knowhereto.ai"');
    expect(pageSource).toContain('const CANONICAL_PATH = "/pricing"');
    expect(pageSource).toContain("openGraph:");
    expect(pageSource).toContain("twitter:");
    expect(pageSource).toContain("alternates:");
    expect(pageSource).toContain("canonical:");
    expect(pageSource).not.toContain("knowhere-login.knowhere-landing.workers.dev");
  });

  it("uses live login, docs, and pay-as-you-go rates instead of prototype placeholders", () => {
    expect(PRICING_LOGIN_HREF).toBe("/login");
    expect(PRICING_DOCS_HREF).toBe("https://docs.knowhereto.ai/");
    expect(BILLABLE_PAGE_RATE_USD).toBe(0.015);
    expect(BILLABLE_PACK_PAGES).toBe(100);
    expect(formatUsd(BILLABLE_PAGE_RATE_USD * BILLABLE_PACK_PAGES)).toBe("$1.50");
    expect(costForPages(100)).toBe("$1.50");
    expect(costForPages(500)).toBe("$7.50");
    expect(costForPages(10_000)).toBe("$150.00");
    expect(STANDARD_FILE_LIMITS.map((limit) => [limit.extension, limit.size])).toEqual([
      [".pdf", "100M"],
      [".docx", "50M"],
      [".xlsx", "50M"],
      [".pptx", "100M"],
    ]);
  });

  it("keeps pricing copy under Pricing.* without rewriting dashboard billing keys", () => {
    const en = JSON.parse(readWorkspaceFile("i18n/locales/en.json")) as {
      Pricing: Record<string, unknown>;
      Landing: Record<string, unknown>;
    };
    const zh = JSON.parse(readWorkspaceFile("i18n/locales/zh.json")) as {
      Pricing: Record<string, unknown>;
    };
    const page = en.Pricing.page as { title: string };

    expect(page.title).toBe("Billing & Top-up Center");
    expect(en.Pricing.seo).toMatchObject({ title: "Pricing — Knowhere" });
    expect(zh.Pricing.seo).toMatchObject({ title: "定价 — Knowhere" });
    expect(en.Landing).toBeDefined();

    const homeSource = readWorkspaceFile("app/(landing)/pricing/_components/pricing-home.tsx");
    expect(homeSource).toContain('useTranslations("Pricing")');
    expect(homeSource).toContain('ctaId="start_free_trial"');
    expect(homeSource).toContain('ctaId="view_docs"');
    expect(homeSource).toContain('ctaId="contact_sales"');
    expect(homeSource).toContain("LandingTrackedLink");
  });

  it("leaves the Landing Pricing Block in place", () => {
    const landingHome = readWorkspaceFile("app/(landing)/_components/landing-home.tsx");
    expect(landingHome).toContain('id="pricing"');
    expect(landingHome).toContain("pricing-card");
    expect(landingHome).toContain('sourceSection="pricing"');
  });
});
