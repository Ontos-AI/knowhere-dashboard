import { describe, expect, it } from "vitest";

import {
  DASHBOARD_DOCUMENT_METADATA_DEFAULTS,
  mergeDocumentMetadataDefaults,
} from "@/lib/document-metadata";

describe("mergeDocumentMetadataDefaults", () => {
  it("fills dashboard defaults when metadata is omitted", () => {
    expect(mergeDocumentMetadataDefaults(DASHBOARD_DOCUMENT_METADATA_DEFAULTS)).toEqual({
      created_by_client: "dashboard",
      client_version: "0.0.1",
    });
  });

  it("fills only missing keys when caller provides partial metadata", () => {
    expect(
      mergeDocumentMetadataDefaults(DASHBOARD_DOCUMENT_METADATA_DEFAULTS, {
        title: "Report.pdf",
      })
    ).toEqual({
      created_by_client: "dashboard",
      client_version: "0.0.1",
      title: "Report.pdf",
    });
  });

  it("lets caller overrides win", () => {
    expect(
      mergeDocumentMetadataDefaults(DASHBOARD_DOCUMENT_METADATA_DEFAULTS, {
        created_by_client: "api",
        client_version: "9.9.9",
      })
    ).toEqual({
      created_by_client: "api",
      client_version: "9.9.9",
    });
  });
});
