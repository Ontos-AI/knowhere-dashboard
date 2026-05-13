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
});
