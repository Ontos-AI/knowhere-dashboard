import { afterEach, describe, expect, it, vi } from "vitest";

type AuthQueryClientModule = typeof import("@/lib/auth-query-client");

type LoadedAuthQueryClient = {
  readonly module: AuthQueryClientModule;
  readonly signOutCalls: readonly string[];
  readonly resetUserCalls: readonly string[];
};

async function loadAuthQueryClient(): Promise<LoadedAuthQueryClient> {
  vi.resetModules();
  const signOutCalls: string[] = [];
  const resetUserCalls: string[] = [];

  vi.doMock("@/lib/env", () => ({
    env: {
      NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS: undefined,
    },
  }));
  vi.doMock("@/lib/better-auth-client", () => ({
    authClient: {
      signOut: async (): Promise<void> => {
        signOutCalls.push("signOut");
      },
    },
  }));
  vi.doMock("@/lib/posthog", () => ({
    resetUser: (): void => {
      resetUserCalls.push("resetUser");
    },
  }));
  return {
    module: await import("@/lib/auth-query-client"),
    signOutCalls,
    resetUserCalls,
  };
}

function createError(status: number, code: string): Error {
  const error = new Error(code);
  return Object.assign(error, { code, status });
}

function createRouter(): {
  readonly replace: (href: string) => void;
  readonly refresh: () => void;
  readonly replaceCalls: readonly string[];
  readonly refreshCalls: readonly string[];
} {
  const replaceCalls: string[] = [];
  const refreshCalls: string[] = [];

  return {
    replaceCalls,
    refreshCalls,
    replace: (href: string): void => {
      replaceCalls.push(href);
    },
    refresh: (): void => {
      refreshCalls.push("refresh");
    },
  };
}

async function flushAsyncHandlers(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

afterEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("authQueryClient", () => {
  it("disables query and mutation retries for unauthorized errors", async () => {
    const {
      module: { authQueryClient },
    } = await loadAuthQueryClient();
    const queryClient = authQueryClient.create(createRouter());
    const unauthorizedError = createError(401, "UNAUTHORIZED");

    const queryRetry = queryClient.getDefaultOptions().queries?.retry;
    const mutationRetry = queryClient.getDefaultOptions().mutations?.retry;

    expect(typeof queryRetry).toBe("function");
    expect(typeof mutationRetry).toBe("function");

    if (typeof queryRetry !== "function" || typeof mutationRetry !== "function") {
      throw new Error("Expected auth-aware retry functions");
    }

    expect(queryRetry(0, unauthorizedError)).toBe(false);
    expect(mutationRetry(0, unauthorizedError)).toBe(false);
  });

  it("keeps the existing query retry and mutation no-retry behavior for non-auth errors", async () => {
    const {
      module: { authQueryClient },
    } = await loadAuthQueryClient();
    const queryClient = authQueryClient.create(createRouter());
    const serverError = createError(500, "INTERNAL_SERVER_ERROR");

    const queryRetry = queryClient.getDefaultOptions().queries?.retry;
    const mutationRetry = queryClient.getDefaultOptions().mutations?.retry;

    if (typeof queryRetry !== "function" || typeof mutationRetry !== "function") {
      throw new Error("Expected auth-aware retry functions");
    }

    expect(queryRetry(0, serverError)).toBe(true);
    expect(queryRetry(1, serverError)).toBe(false);
    expect(mutationRetry(0, serverError)).toBe(false);
    expect(mutationRetry(1, serverError)).toBe(false);
  });

  it("runs the forced logout handler for unauthorized query failures", async () => {
    const { module, signOutCalls, resetUserCalls } = await loadAuthQueryClient();
    const router = createRouter();
    const queryClient = module.authQueryClient.create(router);
    const unauthorizedError = createError(401, "UNAUTHORIZED");
    let queryAttempts = 0;

    vi.stubGlobal("window", {
      location: {
        pathname: "/usage",
        search: "?range=30d",
      },
    });

    await expect(
      queryClient.fetchQuery({
        queryKey: ["auth-query-failure"],
        queryFn: async (): Promise<never> => {
          queryAttempts += 1;
          throw unauthorizedError;
        },
      })
    ).rejects.toThrow("UNAUTHORIZED");
    await flushAsyncHandlers();

    expect(queryAttempts).toBe(1);
    expect(signOutCalls).toEqual(["signOut"]);
    expect(resetUserCalls).toEqual(["resetUser"]);
    expect(router.replaceCalls).toEqual(["/login?callbackURL=%2Fusage%3Frange%3D30d"]);
    expect(router.refreshCalls).toEqual(["refresh"]);
  });

  it("runs the forced logout handler for unauthorized mutation failures", async () => {
    const { module, signOutCalls, resetUserCalls } = await loadAuthQueryClient();
    const router = createRouter();
    const queryClient = module.authQueryClient.create(router);
    const unauthorizedError = createError(401, "UNAUTHORIZED");
    let mutationAttempts = 0;

    vi.stubGlobal("window", {
      location: {
        pathname: "/api-keys",
        search: "",
      },
    });

    const mutation = queryClient
      .getMutationCache()
      .build<never, Error, void, unknown>(queryClient, {
        mutationKey: ["auth-mutation-failure"],
        mutationFn: async (): Promise<never> => {
          mutationAttempts += 1;
          throw unauthorizedError;
        },
      });

    await expect(mutation.execute()).rejects.toThrow("UNAUTHORIZED");
    await flushAsyncHandlers();

    expect(mutationAttempts).toBe(1);
    expect(signOutCalls).toEqual(["signOut"]);
    expect(resetUserCalls).toEqual(["resetUser"]);
    expect(router.replaceCalls).toEqual(["/login?callbackURL=%2Fapi-keys"]);
    expect(router.refreshCalls).toEqual(["refresh"]);
  });
});
