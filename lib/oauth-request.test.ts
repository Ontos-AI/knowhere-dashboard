import { describe, expect, it } from "vitest";
import {
  buildPkceChallenge,
  OAuthAuthRequestError,
  parsePermission,
  validateOAuthLoginSearchParams,
  validatePkceVerifier,
} from "@/lib/oauth-request";

describe("validateOAuthLoginSearchParams", () => {
  const validState = "abcdefghijklmnopqrstuvwxyz";
  const validVerifier = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const validChallenge = buildPkceChallenge(validVerifier);

  it("accepts loopback callback requests with S256 PKCE", () => {
    const params = new URLSearchParams({
      redirect_uri: "http://127.0.0.1:54321/callback",
      state: validState,
      code_challenge: validChallenge,
      code_challenge_method: "S256",
      client_name: "Codex",
    });

    expect(validateOAuthLoginSearchParams(params)).toEqual({
      redirectUri: "http://127.0.0.1:54321/callback",
      state: validState,
      codeChallenge: validChallenge,
      clientName: "Codex",
    });
  });

  it("rejects non-loopback redirect hosts", () => {
    const params = new URLSearchParams({
      redirect_uri: "http://example.com:54321/callback",
      state: validState,
      code_challenge: validChallenge,
      code_challenge_method: "S256",
    });

    expect(() => validateOAuthLoginSearchParams(params)).toThrow(OAuthAuthRequestError);
  });

  it("rejects redirect URIs without the callback path", () => {
    const params = new URLSearchParams({
      redirect_uri: "http://localhost:54321/not-callback",
      state: validState,
      code_challenge: validChallenge,
      code_challenge_method: "S256",
    });

    expect(() => validateOAuthLoginSearchParams(params)).toThrow(
      "redirect_uri path must be /callback"
    );
  });

  it("rejects unsupported PKCE methods", () => {
    const params = new URLSearchParams({
      redirect_uri: "http://localhost:54321/callback",
      state: validState,
      code_challenge: validChallenge,
      code_challenge_method: "plain",
    });

    expect(() => validateOAuthLoginSearchParams(params)).toThrow(
      "code_challenge_method must be S256"
    );
  });

  it("rejects invalid state and challenge values", () => {
    const shortStateParams = new URLSearchParams({
      redirect_uri: "http://localhost:54321/callback",
      state: "short",
      code_challenge: validChallenge,
    });
    const invalidChallengeParams = new URLSearchParams({
      redirect_uri: "http://localhost:54321/callback",
      state: validState,
      code_challenge: "not-valid!",
    });

    expect(() => validateOAuthLoginSearchParams(shortStateParams)).toThrow("state is invalid");
    expect(() => validateOAuthLoginSearchParams(invalidChallengeParams)).toThrow(
      "code_challenge is invalid"
    );
  });
});

describe("validatePkceVerifier", () => {
  it("accepts the verifier used to build the challenge", () => {
    const verifier = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    expect(
      validatePkceVerifier({
        codeChallenge: buildPkceChallenge(verifier),
        codeVerifier: verifier,
      })
    ).toBe(true);
  });

  it("rejects a different verifier", () => {
    const verifier = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    expect(
      validatePkceVerifier({
        codeChallenge: buildPkceChallenge(verifier),
        codeVerifier: "different-verifier",
      })
    ).toBe(false);
  });
});

describe("parsePermission", () => {
  it("accepts supported permission values", () => {
    expect(parsePermission("read_only")).toBe("read_only");
    expect(parsePermission("full_access")).toBe("full_access");
  });

  it("rejects unsupported permission values", () => {
    expect(() => parsePermission("admin")).toThrow("permission is invalid");
    expect(() => parsePermission(null)).toThrow(OAuthAuthRequestError);
  });
});
