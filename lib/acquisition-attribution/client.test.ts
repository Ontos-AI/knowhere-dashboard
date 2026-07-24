import { describe, expect, it } from "vitest";
import {
  hasCampaignQueryParams,
  shouldCaptureAcquisitionPath,
} from "@/lib/acquisition-attribution/client";

describe("acquisition attribution client", () => {
  it("captures public landing routes", () => {
    expect(shouldCaptureAcquisitionPath("/")).toBe(true);
    expect(shouldCaptureAcquisitionPath("/claw")).toBe(true);
    expect(shouldCaptureAcquisitionPath("/comparison/openai")).toBe(true);
    expect(shouldCaptureAcquisitionPath("/versus/chatgpt")).toBe(true);
    expect(shouldCaptureAcquisitionPath("/github")).toBe(true);
  });

  it("captures unknown public paths when campaign query params are present", () => {
    expect(shouldCaptureAcquisitionPath("/reddit", "utm_source=reddit")).toBe(true);
    expect(shouldCaptureAcquisitionPath("/campaign", "utm_medium=cpc")).toBe(true);
    expect(shouldCaptureAcquisitionPath("/ads", "oppref=click_1")).toBe(true);
    expect(hasCampaignQueryParams("?utm_campaign=launch")).toBe(true);
  });

  it("does not count auth or dashboard routes as landing sessions without campaign params", () => {
    expect(shouldCaptureAcquisitionPath("/register")).toBe(false);
    expect(shouldCaptureAcquisitionPath("/login")).toBe(false);
    expect(shouldCaptureAcquisitionPath("/forgot-password")).toBe(false);
    expect(shouldCaptureAcquisitionPath("/usage")).toBe(false);
    expect(shouldCaptureAcquisitionPath("/reddit")).toBe(false);
  });
});
