import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createRemoteJWKSet: vi.fn(() => "jwks-set"),
  jwtVerify: vi.fn(),
}));

vi.mock("jose", () => ({
  createRemoteJWKSet: mocks.createRemoteJWKSet,
  jwtVerify: mocks.jwtVerify,
}));

import {
  readServiceJwtUserId,
  SERVICE_JWT_REFRESH_CLOCK_TOLERANCE_SECONDS,
  verifyServiceJwtForRefresh,
} from "@/lib/knowhere-service-jwt-refresh";

describe("readServiceJwtUserId", () => {
  it("reads the Dashboard service JWT user id claim", () => {
    expect(readServiceJwtUserId({ id: "user_1" })).toBe("user_1");
  });

  it("rejects empty or missing ids", () => {
    expect(readServiceJwtUserId({})).toBeNull();
    expect(readServiceJwtUserId({ id: "" })).toBeNull();
    expect(readServiceJwtUserId({ id: 12 })).toBeNull();
  });
});

describe("verifyServiceJwtForRefresh", () => {
  beforeEach(() => {
    mocks.createRemoteJWKSet.mockClear();
    mocks.jwtVerify.mockReset();
    mocks.createRemoteJWKSet.mockReturnValue("jwks-set");
  });

  it("verifies with a seven-day clock tolerance and returns the user id", async () => {
    mocks.jwtVerify.mockResolvedValue({ payload: { id: "user_1" } });

    await expect(
      verifyServiceJwtForRefresh("expired.jwt", "https://dashboard.example/api/auth/jwks")
    ).resolves.toBe("user_1");

    expect(mocks.createRemoteJWKSet).toHaveBeenCalledWith(
      new URL("https://dashboard.example/api/auth/jwks")
    );
    expect(mocks.jwtVerify).toHaveBeenCalledWith("expired.jwt", "jwks-set", {
      clockTolerance: SERVICE_JWT_REFRESH_CLOCK_TOLERANCE_SECONDS,
    });
    expect(SERVICE_JWT_REFRESH_CLOCK_TOLERANCE_SECONDS).toBe(7 * 24 * 60 * 60);
  });

  it("rejects tokens whose payload has no user id", async () => {
    mocks.jwtVerify.mockResolvedValue({ payload: { sub: "user_1" } });

    await expect(
      verifyServiceJwtForRefresh("expired.jwt", "https://dashboard.example/api/auth/jwks")
    ).rejects.toThrow("Service JWT is missing a user id.");
  });
});
