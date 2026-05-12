import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const readWorkspaceFile = (path: string): string => readFileSync(join(process.cwd(), path), "utf8");

describe("Knowhere SDK code examples", () => {
  it("uses the official Python and Node SDKs in visible examples", () => {
    const files: readonly string[] = [
      "app/(dashboard)/usage/_components/usage-welcome-modal.tsx",
      "app/(landing)/_components/integrate-code-panel.tsx",
      "app/_(landing)/_components/code-demo.tsx",
      "app/design-system/_components/generic-components-showcase.tsx",
    ];

    const source: string = files.map(readWorkspaceFile).join("\n");

    expect(source).toContain("knowhere-python-sdk");
    expect(source).toContain("@ontos-ai/knowhere-sdk");
    expect(source).toContain("import knowhere");
    expect(source).toContain('import Knowhere from "@ontos-ai/knowhere-sdk"');
    expect(source).toContain("client.parse");
    expect(source).toContain("result = client.parse(url=");
    expect(source).toContain("const result = await client.parse({");
    expect(source).not.toMatch(/client\.parse\([\s\S]{0,260}parsing_params/);
    expect(source).not.toMatch(/client\.parse\([\s\S]{0,260}ocr_enabled/);
    expect(source).not.toMatch(/client\.parse\(\{[\s\S]{0,180}model:/);
    expect(source).not.toMatch(/client\.parse\(\{[\s\S]{0,180}ocr:/);
    expect(source).not.toContain("import requests");
    expect(source).not.toContain("requests.post");
    expect(source).not.toContain("const response = await fetch");
  });
});
