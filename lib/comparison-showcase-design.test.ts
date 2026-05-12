import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("comparison showcase design", () => {
  it("uses a darker hover cursor than the raw docs bar fill", () => {
    const source: string = readFileSync(
      join(process.cwd(), "app/(landing)/_components/comparison-showcase.tsx"),
      "utf8"
    );

    expect(source).toContain('const RAW_PATTERN_BASE_COLOR = "#e4e4e7"');
    expect(source).toContain('const BENCHMARK_HOVER_CURSOR_FILL = "rgba(63, 63, 70, 0.22)"');
    expect(source).toContain("cursor={{ fill: BENCHMARK_HOVER_CURSOR_FILL }}");
    expect(source).not.toContain('cursor={{ fill: "rgba(161, 161, 170, 0.12)" }}');
  });
});
