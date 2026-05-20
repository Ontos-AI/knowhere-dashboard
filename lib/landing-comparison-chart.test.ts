import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

type PackageJson = {
  readonly dependencies?: {
    readonly recharts?: string;
  };
};

const readProjectFile = (filePath: string): string =>
  readFileSync(join(process.cwd(), filePath), "utf8");

const getDependencyVersionParts = (versionRange: string): readonly [number, number] => {
  const versionMatch: RegExpMatchArray | null = versionRange.match(/(\d+)\.(\d+)\.\d+/);

  if (!versionMatch) {
    return [0, 0];
  }

  return [Number(versionMatch[1]), Number(versionMatch[2])];
};

describe("landing comparison chart contracts", () => {
  it("uses the documented Recharts label layer API instead of manual SVG mutation", () => {
    const packageJson: PackageJson = JSON.parse(readProjectFile("package.json"));
    const rechartsVersionRange: string = packageJson.dependencies?.recharts ?? "";
    const [rechartsMajorVersion, rechartsMinorVersion] =
      getDependencyVersionParts(rechartsVersionRange);
    const supportsLabelZIndex: boolean =
      rechartsMajorVersion > 3 || (rechartsMajorVersion === 3 && rechartsMinorVersion >= 4);
    const comparisonChartSource: string = readProjectFile(
      "app/(landing)/_components/comparison-showcase.tsx"
    );

    expect(supportsLabelZIndex).toBe(true);
    expect(comparisonChartSource).toContain("LabelList");
    expect(comparisonChartSource).toContain("zIndex={");
    expect(comparisonChartSource).not.toContain(".recharts-label-list");
    expect(comparisonChartSource).not.toContain("appendChild");
  });

  it("keeps secondary benchmark axes bound so Recharts renders their ticks", () => {
    const comparisonChartSource: string = readProjectFile(
      "app/(landing)/_components/comparison-showcase.tsx"
    );

    expect(comparisonChartSource).toMatch(/VALUE_AXIS_ID = "value"/);
    expect(comparisonChartSource).toMatch(/TIME_AXIS_ID = "secondary-time"/);
    expect(comparisonChartSource).toMatch(/LOOP_AXIS_ID = "tertiary-loops"/);
    expect(comparisonChartSource).toMatch(/dataKey="raw"[\s\S]*yAxisId={TIME_AXIS_ID}/);
    expect(comparisonChartSource).toMatch(/dataKey="knowhere"[\s\S]*yAxisId={LOOP_AXIS_ID}/);
  });

  it("keeps the benchmark grid bound to the primary value axis", () => {
    const comparisonChartSource: string = readProjectFile(
      "app/(landing)/_components/comparison-showcase.tsx"
    );

    expect(comparisonChartSource).toMatch(/<CartesianGrid[\s\S]*yAxisId={VALUE_AXIS_ID}/);
  });
});
