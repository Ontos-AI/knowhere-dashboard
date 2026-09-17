import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const readWorkspaceFile = (path: string): string => readFileSync(join(process.cwd(), path), "utf8");

describe("Usage welcome modal contracts", () => {
  const modalSource: string = readWorkspaceFile(
    "app/(dashboard)/usage/_components/usage-welcome-modal.tsx"
  );

  it("caps the dialog to the viewport so neither edge is clipped", () => {
    const dialogContentClass: string =
      /<DialogContent className="([^"]+)"/.exec(modalSource)?.[1] ?? "";

    expect(dialogContentClass).toContain("max-h-[100dvh]");
    expect(dialogContentClass).toContain("sm:max-h-[calc(100dvh-2rem)]");
    expect(dialogContentClass).toContain("overflow-hidden");
  });

  it("scrolls only the body row, not the documentation CTA", () => {
    const dialogContentClass: string =
      /<DialogContent className="([^"]+)"/.exec(modalSource)?.[1] ?? "";

    // `DialogContent` ships `display: grid`, and Tailwind emits `.grid` after
    // `.flex`, so the layout has to be expressed with grid rows rather than flex.
    expect(dialogContentClass).toContain("grid-rows-[minmax(0,1fr)_auto]");

    const scrollContainerClass: string =
      /<div className="([^"]*overflow-y-auto[^"]*)"/.exec(modalSource)?.[1] ?? "";

    expect(scrollContainerClass).toContain("min-h-0");
    expect(modalSource).toContain('<div className="shrink-0 px-4 pb-0 pt-[38px]');
  });
});
