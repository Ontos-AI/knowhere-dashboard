import { readFileSync } from "node:fs";
import { join } from "node:path";

type PackageJson = {
  readonly version?: string;
};

const packageJson = JSON.parse(
  readFileSync(join(process.cwd(), "package.json"), "utf8")
) as PackageJson;

/**
 * Official dashboard client identity for job `document_metadata`.
 *
 * Wire format uses snake_case because the dashboard talks to the Knowhere API
 * directly. Caller-provided keys win; defaults fill missing keys only.
 */
export const DASHBOARD_DOCUMENT_METADATA_DEFAULTS = {
  created_by_client: "dashboard",
  client_version: packageJson.version ?? "0.0.0",
} as const;

export type DocumentMetadata = Record<string, unknown>;

export function mergeDocumentMetadataDefaults(
  defaults: DocumentMetadata,
  provided?: DocumentMetadata | null
): DocumentMetadata {
  if (!provided) {
    return { ...defaults };
  }
  return { ...defaults, ...provided };
}
