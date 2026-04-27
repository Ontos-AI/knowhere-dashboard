import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
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
    name: "hard-coded private AWS registry",
    regex: /\d{12}\.dkr\.ecr\.[a-z0-9-]+\.amazonaws\.com/,
  },
  {
    name: "hard-coded private deployment target",
    regex:
      /knowhere-prod-cluster|knowhere-(prod|staging)\b|PROJECT_NAME:\s*knowhere-web|knowhere\/knowhere-frontend/i,
  },
  {
    name: "public default API password",
    regex: /NEXT_PUBLIC_DEFAULT_API_PASSWORD|DefaultPass123/,
  },
  {
    name: "baked placeholder runtime environment",
    regex:
      /public-ci-placeholder|public-build-placeholder|BUILD_VALIDATION_AUTH_SECRET|DEFAULT_LOCAL_APP_URL|BETTER_AUTH_SECRET:\s+public-|DATABASE_URL:\s+postgres:\/\/postgres/,
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

test("container startup uses Drizzle generate and migrate before starting the Next server", () => {
  const dockerfile = readFileSync("Dockerfile", "utf8");
  const generateIndex = dockerfile.indexOf("pnpm db:generate");
  const migrateIndex = dockerfile.indexOf("pnpm db:migrate");
  const startIndex = dockerfile.indexOf("pnpm start");

  assert.match(
    dockerfile,
    /CMD \["sh", "-c", "pnpm db:generate && pnpm db:migrate && exec pnpm start"\]/
  );
  assert.notEqual(generateIndex, -1);
  assert.notEqual(migrateIndex, -1);
  assert.notEqual(startIndex, -1);
  assert.ok(generateIndex < migrateIndex);
  assert.ok(migrateIndex < startIndex);
  assert.doesNotMatch(dockerfile, /scripts\/migrate\.js|start-with-migrations\.js|server\.js/);
  assert.equal(existsSync("scripts/migrate.js"), false);
  assert.equal(existsSync("scripts/start-with-migrations.js"), false);
});

test("Next config uses the standard node server runtime", () => {
  const nextConfig = readFileSync("next.config.js", "utf8");

  assert.doesNotMatch(nextConfig, /output:\s*['"]standalone['"]/);
  assert.doesNotMatch(nextConfig, /outputFileTracingIncludes/);
});

test("build steps provide auth-only placeholder env for build-time auth initialization", () => {
  const dockerfile = readFileSync("Dockerfile", "utf8");
  const ciWorkflow = readFileSync(".github/workflows/ci.yml", "utf8");
  const requiredBuildEnv = [
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "NEXT_PUBLIC_APP_URL",
    "SKIP_ENV_VALIDATION",
  ];

  for (const envName of requiredBuildEnv) {
    assert.match(dockerfile, new RegExp(`${envName}=`));
    assert.match(ciWorkflow, new RegExp(`${envName}:`));
  }
});

test("deploy workflow deploys merged branch pushes without hard-coded private infrastructure", () => {
  const deployWorkflowPath = ".github/workflows/deploy.yml";

  assert.equal(existsSync(deployWorkflowPath), true);

  const deployWorkflow = readFileSync(deployWorkflowPath, "utf8");
  const requiredSecrets = [
    "AWS_EKS_PROD_CLUSTER_NAME",
    "AWS_EKS_PROD_REGION",
    "DASHBOARD_IMAGE_REGISTRY",
    "DASHBOARD_IMAGE_REPOSITORY",
    "DASHBOARD_KUBE_CONTAINER",
    "DASHBOARD_KUBE_DEPLOYMENT",
    "DASHBOARD_KUBE_NAMESPACE_PROD",
    "DASHBOARD_KUBE_NAMESPACE_STAGING",
  ];

  assert.match(deployWorkflow, /push:\s*\n\s+branches:\s*\n\s+- main\s*\n\s+- staging/);
  assert.doesNotMatch(deployWorkflow, /pull_request:/);
  assert.match(deployWorkflow, /docker\/build-push-action@v6/);
  assert.match(deployWorkflow, /aws eks update-kubeconfig/);
  assert.match(deployWorkflow, /kubectl set image/);
  assert.match(deployWorkflow, /kubectl rollout status/);
  assert.doesNotMatch(deployWorkflow, /vars\./);

  for (const secretName of requiredSecrets) {
    assert.match(deployWorkflow, new RegExp(`secrets\\.${secretName}`));
  }
});

test("auth route uses the Better Auth Next handler directly", () => {
  const authRoute = readFileSync("app/api/auth/[...path]/route.ts", "utf8");
  const authModule = readFileSync("lib/auth.ts", "utf8");

  assert.match(authRoute, /import \{ auth \} from "@lib\/auth";/);
  assert.match(authRoute, /export const \{ GET, POST \} = toNextJsHandler\(auth\);/);
  assert.doesNotMatch(authRoute, /getAuth|handleAuthRequest/);
  assert.doesNotMatch(authRoute, /await import\("@lib\/auth"\)/);
  assert.match(authModule, /export const auth = betterAuth\(\{/);
  assert.doesNotMatch(authModule, /createAuth|getAuth/);
});

test("optional auth providers do not get synthetic empty-string defaults", () => {
  const envSchema = readFileSync("lib/env.ts", "utf8");
  const optionalIntegrationNames = [
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "RESEND_API_KEY",
  ];

  for (const envName of optionalIntegrationNames) {
    assert.doesNotMatch(envSchema, new RegExp(`${envName}: z\\.string\\(\\)\\.default\\(""\\)`));
    assert.match(envSchema, new RegExp(`${envName}: z\\.string\\(\\)\\.optional\\(\\)`));
  }
});
