import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("comparison showcase design", () => {
  it("keeps the raw docs hatch pattern when its bars are active", () => {
    const source: string = readFileSync(
      join(process.cwd(), "app/(landing)/_components/comparison-showcase.tsx"),
      "utf8"
    );

    expect(source).toContain('const RAW_PATTERN_BASE_COLOR = "#e4e4e7"');
    expect(source).toMatch(
      /activeBar=\{\s*series\.pattern\s*\?\s*(?:\(\s*)?<BenchmarkRawBarShape \/>/
    );
    expect(source).toContain('cursor={{ fill: "rgba(161, 161, 170, 0.12)" }}');
    expect(source).not.toContain("cursor={{ fill: BENCHMARK_HOVER_CURSOR_FILL }}");
  });
});
