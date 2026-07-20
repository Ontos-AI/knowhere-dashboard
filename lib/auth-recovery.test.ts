import { afterEach, describe, expect, it, vi } from "vitest";
import { authRecovery } from "@/lib/auth-recovery";

vi.mock("@/lib/env", () => ({
  env: {
    NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS: undefined,
  },
}));

type LogoutTestDependencies = Parameters<typeof authRecovery.forceLogout>[0];

function createLogoutDependencies(options?: {
  readonly currentPath?: string;
  readonly signOut?: () => Promise<unknown>;
}): LogoutTestDependencies & {
  readonly events: readonly string[];
  readonly replaceCalls: readonly string[];
} {
  const events: string[] = [];
  const replaceCalls: string[] = [];

  return {
    events,
    replaceCalls,
    queryClient: {
      clear: (): void => {
        events.push("clear");
      },
    },
    router: {
      replace: (href: string): void => {
        events.push(`replace:${href}`);
        replaceCalls.push(href);
      },
      refresh: (): void => {
        events.push("refresh");
      },
    },
    signOut:
      options?.signOut ??
      (async (): Promise<void> => {
        events.push("signOut");
      }),
    resetUser: (): void => {
      events.push("resetUser");
    },
    getCurrentPath: (): string => options?.currentPath ?? "/usage?range=30d",
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("authRecovery.isUnauthorizedError", () => {
  it("treats oRPC UNAUTHORIZED errors as auth failures", () => {
    expect(authRecovery.isUnauthorizedError({ code: "UNAUTHORIZED", status: 401 })).toBe(true);
  });

  it("treats 401 status errors as auth failures", () => {
    expect(authRecovery.isUnauthorizedError({ status: 401 })).toBe(true);
    expect(authRecovery.isUnauthorizedError({ response: { status: 401 } })).toBe(true);
  });

  it("does not treat 403, 500, or validation errors as auth failures", () => {
    expect(authRecovery.isUnauthorizedError({ code: "FORBIDDEN", status: 403 })).toBe(false);
    expect(authRecovery.isUnauthorizedError({ code: "INTERNAL_SERVER_ERROR", status: 500 })).toBe(
      false
    );
    expect(authRecovery.isUnauthorizedError({ code: "BAD_REQUEST", status: 400 })).toBe(false);
  });
});

describe("authRecovery.handleUnauthorizedError", () => {
  it("forces logout for UNAUTHORIZED oRPC errors", async () => {
    const dependencies = createLogoutDependencies();

    await expect(
      authRecovery.handleUnauthorizedError({ code: "UNAUTHORIZED" }, dependencies)
    ).resolves.toBe(true);

    expect(dependencies.events).toEqual([
      "clear",
      "signOut",
      "resetUser",
      "replace:/login?callbackURL=%2Fusage%3Frange%3D30d",
      "refresh",
    ]);
  });

  it("forces logout for 401 status errors", async () => {
    const dependencies = createLogoutDependencies({
      currentPath: "/api-keys",
    });

    await expect(authRecovery.handleUnauthorizedError({ status: 401 }, dependencies)).resolves.toBe(
      true
    );

    expect(dependencies.replaceCalls).toEqual(["/login?callbackURL=%2Fapi-keys"]);
  });

  it("does not force logout for non-auth errors", async () => {
    const dependencies = createLogoutDependencies();

    await expect(
      authRecovery.handleUnauthorizedError({ code: "FORBIDDEN", status: 403 }, dependencies)
    ).resolves.toBe(false);

    expect(dependencies.events).toEqual([]);
  });
});

describe("authRecovery.forceLogout", () => {
  it("navigates to login after a best-effort sign-out failure", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const dependencies = createLogoutDependencies({
      signOut: async (): Promise<void> => {
        throw new Error("sign out failed");
      },
    });

    await authRecovery.forceLogout(dependencies);

    expect(consoleError).toHaveBeenCalledWith("[authRecovery] Sign-out failed:", expect.any(Error));
    expect(dependencies.events).toEqual(["clear", "resetUser", "replace:/login", "refresh"]);
  });

  it("dedupes concurrent logout calls", async () => {
    let resolveSignOut = (): void => {
      throw new Error("Sign-out resolver was not assigned");
    };
    let signOutCount = 0;
    const dependencies = createLogoutDependencies({
      signOut: (): Promise<void> => {
        signOutCount += 1;
        return new Promise<void>((resolve) => {
          resolveSignOut = resolve;
        });
      },
    });

    const firstLogout = authRecovery.forceLogout(dependencies);
    const secondLogout = authRecovery.forceLogout(dependencies);

    resolveSignOut();

    await Promise.all([firstLogout, secondLogout]);

    expect(signOutCount).toBe(1);
    expect(dependencies.replaceCalls).toEqual(["/login"]);
  });

  it("lets forced logout callback routing win over a concurrent manual logout", async () => {
    let resolveSignOut = (): void => {
      throw new Error("Sign-out resolver was not assigned");
    };
    let signOutCount = 0;
    const dependencies = createLogoutDependencies({
      signOut: (): Promise<void> => {
        signOutCount += 1;
        return new Promise<void>((resolve) => {
          resolveSignOut = resolve;
        });
      },
    });

    const manualLogout = authRecovery.forceLogout(dependencies);
    const forcedLogout = authRecovery.handleUnauthorizedError({ status: 401 }, dependencies);

    resolveSignOut();

    await Promise.all([manualLogout, forcedLogout]);

    expect(signOutCount).toBe(1);
    expect(dependencies.replaceCalls).toEqual(["/login?callbackURL=%2Fusage%3Frange%3D30d"]);
  });
});

describe("authRecovery.shouldRetryQuery", () => {
  it("does not retry unauthorized queries or mutations", () => {
    expect(authRecovery.shouldRetryQuery(0, { code: "UNAUTHORIZED" })).toBe(false);
    expect(authRecovery.shouldRetryQuery(0, { status: 401 })).toBe(false);
  });

  it("preserves one query retry for non-auth errors", () => {
    expect(authRecovery.shouldRetryQuery(0, { status: 500 })).toBe(true);
    expect(authRecovery.shouldRetryQuery(1, { status: 500 })).toBe(false);
  });
});

describe("authRecovery.shouldRetryMutation", () => {
  it("preserves no mutation retries for auth and non-auth errors", () => {
    expect(authRecovery.shouldRetryMutation(0, { code: "UNAUTHORIZED" })).toBe(false);
    expect(authRecovery.shouldRetryMutation(0, { status: 500 })).toBe(false);
  });
});
