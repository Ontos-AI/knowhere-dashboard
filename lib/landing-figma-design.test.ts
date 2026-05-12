import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Tag } from "@components/ui/tag";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { clawHeaderDesign } from "@/app/(landing)/claw/_components/claw-header-design";
import { clawHeroDesign } from "@/app/(landing)/claw/_components/claw-hero-design";

describe("landing Figma design contracts", () => {
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

  it("keeps the block tag dimensions aligned with the Figma block tag unit", () => {
    const markup: string = renderToStaticMarkup(
      createElement(Tag, { value: "UNSTRUCTURED", variant: "block" })
    );

    expect(markup).toContain("gap-2");
    expect(markup).toContain("px-5");
    expect(markup).toContain("py-2");
    expect(markup).toContain("text-base");
    expect(markup).toContain("leading-6");
    expect(markup).toContain("size-4");
    expect(markup).not.toContain("border-r-4");
    expect(markup).not.toContain("px-8");
    expect(markup).not.toContain("text-lg");
  });

  it("keeps the mobile navigation menu aligned with the Figma nav menu unit", () => {
    expect(clawHeaderDesign.mobileMenu).toContain("border-[#e4e4e7]");
    expect(clawHeaderDesign.mobileMenu).toContain(
      "shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-1px_rgba(0,0,0,0.06)]"
    );
    expect(clawHeaderDesign.mobileMenuItem).toContain("h-12");
    expect(clawHeaderDesign.mobileMenuItem).toContain("border-b");
    expect(clawHeaderDesign.mobileMenuItem).toContain("border-[#f4f4f5]");
    expect(clawHeaderDesign.mobileMenuItem).toContain("px-5");
    expect(clawHeaderDesign.desktopCtaButton).toContain("bg-[#e7000b]");
    expect(clawHeaderDesign.desktopCtaButton).toContain("border-b-[6px]");
  });

  it("uses a stable icon asset for the hero context marker", () => {
    const heroSource: string = readFileSync(
      join(process.cwd(), "app/(landing)/claw/_components/claw-hero-section.tsx"),
      "utf8"
    );

    expect(clawHeroDesign.contextMarker.iconSrc).toBe("/icons/knowhere/context-memo.svg");
    expect(clawHeroDesign.contextMarker.iconClassName).toContain("h-7");
    expect(clawHeroDesign.contextMarker.iconClassName).toContain("w-7");
    expect(heroSource).not.toContain("📝");
    expect(existsSync(join(process.cwd(), "public/icons/knowhere/context-memo.svg"))).toBe(true);
  });
});
