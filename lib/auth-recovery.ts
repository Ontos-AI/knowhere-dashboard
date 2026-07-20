import { authRedirect } from "@/lib/auth-redirect";

const AUTH_QUERY_RETRY_LIMIT = 1;

type ObjectRecord = Record<PropertyKey, unknown>;

type AuthRouter = {
  readonly replace: (href: string) => void;
  readonly refresh: () => void;
};

type QueryCacheController = {
  readonly clear: () => void;
};

type LogoutDependencies = {
  readonly router: AuthRouter;
  readonly signOut: () => Promise<unknown>;
  readonly resetUser: () => void;
  readonly queryClient?: QueryCacheController;
  readonly getCurrentPath?: () => string;
};

type LogoutOptions = {
  readonly includeCallbackURL?: boolean;
};

type ActiveLogoutState = {
  promise: Promise<void>;
  loginPath: string;
};

let activeLogoutState: ActiveLogoutState | null = null;

function isObjectRecord(value: unknown): value is ObjectRecord {
  return typeof value === "object" && value !== null;
}

function hasUnauthorizedCode(error: unknown): boolean {
  return isObjectRecord(error) && error.code === "UNAUTHORIZED";
}

function hasUnauthorizedStatus(error: unknown): boolean {
  if (!isObjectRecord(error)) {
    return false;
  }

  if (error.status === 401) {
    return true;
  }

  const response = error.response;
  return isObjectRecord(response) && response.status === 401;
}

function isUnauthorizedError(error: unknown): boolean {
  return hasUnauthorizedCode(error) || hasUnauthorizedStatus(error);
}

function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (isUnauthorizedError(error)) {
    return false;
  }

  return failureCount < AUTH_QUERY_RETRY_LIMIT;
}

function shouldRetryMutation(_failureCount: number, _error: unknown): boolean {
  return false;
}

function getCurrentPath(dependencies: LogoutDependencies): string | null {
  return dependencies.getCurrentPath?.() ?? null;
}

function buildLoginPath(dependencies: LogoutDependencies, options?: LogoutOptions): string {
  if (!options?.includeCallbackURL) {
    return "/login";
  }

  return authRedirect.buildAuthPagePath("/login", {
    callbackURL: getCurrentPath(dependencies),
  });
}

function chooseLoginPath(currentLoginPath: string, nextLoginPath: string): string {
  if (currentLoginPath === "/login" && nextLoginPath !== "/login") {
    return nextLoginPath;
  }

  return currentLoginPath;
}

async function executeLogout(
  dependencies: LogoutDependencies,
  activeLogout: ActiveLogoutState
): Promise<void> {
  dependencies.queryClient?.clear();

  try {
    await dependencies.signOut();
  } catch (error) {
    console.error("[authRecovery] Sign-out failed:", error);
  }

  dependencies.resetUser();
  dependencies.router.replace(activeLogout.loginPath);
  dependencies.router.refresh();
}

async function forceLogout(
  dependencies: LogoutDependencies,
  options?: LogoutOptions
): Promise<void> {
  const loginPath = buildLoginPath(dependencies, options);

  if (activeLogoutState) {
    activeLogoutState.loginPath = chooseLoginPath(activeLogoutState.loginPath, loginPath);
    return activeLogoutState.promise;
  }

  const activeLogout: ActiveLogoutState = {
    loginPath,
    promise: Promise.resolve(),
  };

  activeLogout.promise = executeLogout(dependencies, activeLogout).finally(() => {
    if (activeLogoutState === activeLogout) {
      activeLogoutState = null;
    }
  });
  activeLogoutState = activeLogout;

  return activeLogout.promise;
}

async function handleUnauthorizedError(
  error: unknown,
  dependencies: LogoutDependencies
): Promise<boolean> {
  if (!isUnauthorizedError(error)) {
    return false;
  }

  await forceLogout(dependencies, { includeCallbackURL: true });
  return true;
}

export const authRecovery = {
  forceLogout,
  handleUnauthorizedError,
  isUnauthorizedError,
  shouldRetryMutation,
  shouldRetryQuery,
} as const;
