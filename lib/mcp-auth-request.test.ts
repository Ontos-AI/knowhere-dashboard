import { describe, expect, it } from "vitest";
import {
  buildPkceChallenge,
  McpAuthRequestError,
  validateMcpLoginSearchParams,
  validatePkceVerifier,
} from "@/lib/mcp-auth-request";

describe("validateMcpLoginSearchParams", () => {
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

    expect(validateMcpLoginSearchParams(params)).toEqual({
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

    expect(() => validateMcpLoginSearchParams(params)).toThrow(McpAuthRequestError);
  });

  it("rejects redirect URIs without the callback path", () => {
    const params = new URLSearchParams({
      redirect_uri: "http://localhost:54321/not-callback",
      state: validState,
      code_challenge: validChallenge,
      code_challenge_method: "S256",
    });

    expect(() => validateMcpLoginSearchParams(params)).toThrow(
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

    expect(() => validateMcpLoginSearchParams(params)).toThrow(
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

    expect(() => validateMcpLoginSearchParams(shortStateParams)).toThrow("state is invalid");
    expect(() => validateMcpLoginSearchParams(invalidChallengeParams)).toThrow(
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
