import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { appMetadata } from "@lib/app-metadata";
import { describe, expect, test } from "vitest";

const dashboardIconPath = "/images/knowhere/app-icon.png" as const;
const prototypeFaviconPath = "/assets/knowhere-favicon.svg" as const;
const rootDirectory: string = process.cwd();

async function hasFile(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

describe("dashboard page icon", () => {
  test("configures the Knowhere mark as an HTML icon", (): void => {
    const serializedIcons: string = JSON.stringify(appMetadata.icons);

    expect(serializedIcons).toContain("/favicon.ico");
    expect(serializedIcons).toContain(prototypeFaviconPath);
    expect(serializedIcons).toContain(dashboardIconPath);
    expect(serializedIcons).toContain("image/svg+xml");
    expect(serializedIcons).toContain("image/png");
    expect(serializedIcons).toContain("1024x1024");
  });

  test("keeps the configured icon asset available from public", async (): Promise<void> => {
    const iconFilePath: string = path.join(
      rootDirectory,
      "public",
      "images",
      "knowhere",
      "app-icon.png"
    );
    const prototypeFaviconFilePath: string = path.join(
      rootDirectory,
      "public",
      "assets",
      "knowhere-favicon.svg"
    );
    const faviconIcoPath: string = path.join(rootDirectory, "public", "favicon.ico");

    await expect(hasFile(iconFilePath)).resolves.toBe(true);
    await expect(hasFile(prototypeFaviconFilePath)).resolves.toBe(true);
    await expect(hasFile(faviconIcoPath)).resolves.toBe(true);
  });

  test("declares the prototype mark on landing routes without a favicon.ico entry", async (): Promise<void> => {
    const landingLayoutSource: string = await readFile(
      path.join(rootDirectory, "app", "(landing)", "layout.tsx"),
      "utf8"
    );

    expect(landingLayoutSource).toContain(prototypeFaviconPath);
    expect(landingLayoutSource).not.toContain("/favicon.ico");
  });
});
