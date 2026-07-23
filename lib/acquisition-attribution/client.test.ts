import { describe, expect, it } from "vitest";
import { shouldCaptureAcquisitionPath } from "@/lib/acquisition-attribution/client";

describe("acquisition attribution client", () => {
  it("captures public landing routes", () => {
    expect(shouldCaptureAcquisitionPath("/")).toBe(true);
    expect(shouldCaptureAcquisitionPath("/claw")).toBe(true);
    expect(shouldCaptureAcquisitionPath("/comparison/openai")).toBe(true);
    expect(shouldCaptureAcquisitionPath("/versus/chatgpt")).toBe(true);
  });

  it("does not count auth or dashboard routes as landing sessions", () => {
    expect(shouldCaptureAcquisitionPath("/register")).toBe(false);
    expect(shouldCaptureAcquisitionPath("/login")).toBe(false);
    expect(shouldCaptureAcquisitionPath("/forgot-password")).toBe(false);
    expect(shouldCaptureAcquisitionPath("/usage")).toBe(false);
  });
});
