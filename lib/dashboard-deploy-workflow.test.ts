import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const readDeployWorkflow = (): string =>
  readFileSync(join(process.cwd(), ".github/workflows/deploy.yml"), "utf8");

const EXPRESSION_START: string = "$";

describe("dashboard deploy workflow", (): void => {
  it("runs main migrations with the dedicated direct migration credential", (): void => {
    const deployWorkflow: string = readDeployWorkflow();

    expect(deployWorkflow).toContain(
      `DATABASE_URL: ${EXPRESSION_START}{{ secrets.DATABASE_MIGRATION_URL }}`
    );
    expect(deployWorkflow).toContain("pnpm db:migrate");
    expect(deployWorkflow).not.toContain(
      `knowhere-dashboard-migrate-${EXPRESSION_START}{GITHUB_RUN_ID}`
    );
    expect(deployWorkflow).not.toContain("ttlSecondsAfterFinished");
  });

  it("fails clearly before migration when the dedicated credential is missing", (): void => {
    const deployWorkflow: string = readDeployWorkflow();

    expect(deployWorkflow).toContain(`if [ -z "${EXPRESSION_START}{DATABASE_URL}" ]; then`);
    expect(deployWorkflow).toContain("Missing DATABASE_MIGRATION_URL");
  });

  it("gates both staging pushes and production releases on migration success", (): void => {
    const deployWorkflow: string = readDeployWorkflow();

    expect(deployWorkflow).toContain(
      `if: ${EXPRESSION_START}{{ github.event_name == 'release' || github.ref == 'refs/heads/staging' || github.event_name == 'workflow_dispatch' }}`
    );
    expect(deployWorkflow).toContain("needs: [build-and-publish, migrate]");
  });
});
