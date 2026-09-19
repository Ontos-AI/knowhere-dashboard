import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const readDeployWorkflow = (): string =>
  readFileSync(join(process.cwd(), ".github/workflows/deploy.yml"), "utf8");

const EXPRESSION_START: string = "$";

/*
  A job block starts at a two-space indent and runs to the next job at the same
  indent. Reading the workflow this way keeps each assertion scoped to the job it
  is about, so a `needs: migrate` on some unrelated job cannot satisfy it.
*/
const readDeployJob = (jobName: string): string => {
  const jobBlocks: readonly string[] = readDeployWorkflow().split(/\n {2}(?=[a-z0-9-]+:\n)/);

  return jobBlocks.find((block) => block.startsWith(`${jobName}:`)) ?? "";
};

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

    /*
      The EKS path that used to carry `build-and-publish` is gone, so the release
      gate now lives on the Vercel production job: it may not start until the
      migration job has succeeded, and the release assets follow the deployment.
    */
    const productionDeployJob: string = readDeployJob("deploy-vercel-production");

    expect(productionDeployJob, "deploy-vercel-production should exist").not.toBe("");
    expect(productionDeployJob).toContain("needs: migrate");
    expect(productionDeployJob).toContain(
      `if: ${EXPRESSION_START}{{ github.event_name == 'release' }}`
    );
    expect(readDeployJob("attach-release-assets")).toContain("needs: deploy-vercel-production");
  });
});
