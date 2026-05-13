import { access } from "node:fs/promises";
import path from "node:path";
import { appMetadata } from "@lib/app-metadata";
import { describe, expect, test } from "vitest";

const dashboardIconPath = "/images/knowhere/app-icon.png" as const;
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

    expect(serializedIcons).toContain(dashboardIconPath);
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

    await expect(hasFile(iconFilePath)).resolves.toBe(true);
  });
});
