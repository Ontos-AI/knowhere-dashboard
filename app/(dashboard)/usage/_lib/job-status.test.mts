import assert from "node:assert/strict";
import test from "node:test";
// biome-ignore lint/style/noRestrictedImports: Node's built-in test runner does not resolve the app's TS path aliases.
import { getUsageStatusInfo } from "./job-status.ts";

test("maps waiting-file to a distinct waiting label instead of running", () => {
  assert.deepEqual(getUsageStatusInfo("waiting-file"), {
    kind: "waiting-file",
    label: "Waiting File",
  });
});

test("keeps pending distinct from running", () => {
  assert.deepEqual(getUsageStatusInfo("pending"), {
    kind: "pending",
    label: "Pending",
  });
});
