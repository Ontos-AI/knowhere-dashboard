import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import test from "node:test";

const TEXT_FILE_REGEX = /\.(cjs|css|js|json|jsx|md|mjs|mts|sql|ts|tsx|txt|yml|yaml)$/;
const SELF_PATH = "scripts/publication-guardrails.test.mjs";
const ROOT_PATH = ".";

const EXCLUDED_DIRECTORIES = new Set([
  ".agent",
  ".agent-hooks",
  ".codex",
  ".cursor",
  ".git",
  ".next",
  ".pnpm-store",
  "build",
  "coverage",
  "node_modules",
  "out",
]);

const forbiddenPatterns = [
  {
    name: "raw private backend IP",
    regex: /218\.17\.187\.47/,
  },
  {
    name: "private AWS account id",
    regex: /107424103509/,
  },
  {
    name: "private ECR registry",
    regex:
      /\bECR_(REGISTRY|REPOSITORY)\b|Amazon ECR|amazon-ecr-login|\.dkr\.ecr\.[a-z0-9-]+\.amazonaws\.com/,
  },
  {
    name: "private EKS deployment flow",
    regex: /\bEKS\b|aws eks update-kubeconfig|kubectl (set image|rollout|get|describe)/i,
  },
  {
    name: "public default API password",
    regex: /NEXT_PUBLIC_DEFAULT_API_PASSWORD|DefaultPass123/,
  },
  {
    name: "baked placeholder runtime environment",
    regex:
      /public-ci-placeholder|public-build-placeholder|BETTER_AUTH_SECRET:\s+public-|DATABASE_URL:\s+postgres:\/\/postgres/,
  },
];

const getTrackedTextFiles = () => {
  const filePaths = [];
  const pendingDirectories = [ROOT_PATH];

  while (pendingDirectories.length > 0) {
    const directoryPath = pendingDirectories.pop();
    const entries = readdirSync(directoryPath, { withFileTypes: true });

    for (const entry of entries) {
      const filePath = directoryPath === ROOT_PATH ? entry.name : `${directoryPath}/${entry.name}`;

      if (entry.isDirectory()) {
        if (!EXCLUDED_DIRECTORIES.has(entry.name)) {
          pendingDirectories.push(filePath);
        }
        continue;
      }

      if (
        entry.isFile() &&
        filePath !== SELF_PATH &&
        !entry.name.startsWith(".env") &&
        TEXT_FILE_REGEX.test(filePath) &&
        statSync(filePath).size < 1_000_000
      ) {
        filePaths.push(filePath);
      }
    }
  }

  return filePaths;
};

test("publication tree does not contain private deployment or credential defaults", () => {
  const violations = [];

  for (const filePath of getTrackedTextFiles()) {
    const content = readFileSync(filePath, "utf8");

    for (const pattern of forbiddenPatterns) {
      if (pattern.regex.test(content)) {
        violations.push(`${filePath}: ${pattern.name}`);
      }
    }
  }

  assert.deepEqual(violations, []);
});

test("container startup runs migrations before starting the app server", () => {
  const dockerfile = readFileSync("Dockerfile", "utf8");

  assert.match(dockerfile, /CMD \["node", "scripts\/start-with-migrations\.js"\]/);

  const startupScript = readFileSync("scripts/start-with-migrations.js", "utf8");
  const migrationIndex = startupScript.indexOf("scripts/migrate.js");
  const serverIndex = startupScript.indexOf("server.js");

  assert.notEqual(migrationIndex, -1);
  assert.notEqual(serverIndex, -1);
  assert.ok(migrationIndex < serverIndex);
});
