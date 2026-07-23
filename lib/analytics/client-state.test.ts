import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { peekPendingCheckout, storePendingCheckout } from "@/lib/analytics/client-state";

const PENDING_CHECKOUT_KEY = "ph_pending_checkout";

vi.mock("@/lib/auth-redirect", () => ({
  authRedirect: {
    defaultPath: "/login",
    getSafeCallbackURL: (): string | null => null,
  },
}));

function createStorageMock(): Storage {
  const storage = new Map<string, string>();

  return {
    get length(): number {
      return storage.size;
    },
    clear: (): void => {
      storage.clear();
    },
    getItem: (key: string): string | null => storage.get(key) ?? null,
    key: (index: number): string | null => Array.from(storage.keys())[index] ?? null,
    removeItem: (key: string): void => {
      storage.delete(key);
    },
    setItem: (key: string, value: string): void => {
      storage.set(key, value);
    },
  };
}

describe("analytics client state", () => {
  beforeEach(() => {
    const localStorageMock = createStorageMock();
    const sessionStorageMock = createStorageMock();

    vi.stubGlobal("localStorage", localStorageMock);
    vi.stubGlobal("sessionStorage", sessionStorageMock);
    vi.stubGlobal("window", {
      localStorage: localStorageMock,
      sessionStorage: sessionStorageMock,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns pending checkout data only when the stored payload matches the expected shape", () => {
    storePendingCheckout({
      amount: 20,
      checkout_type: "credits_package",
      plan_id: "starter",
      price_id: "price_123",
      session_id: "cs_123",
    });

    expect(peekPendingCheckout()).toEqual({
      amount: 20,
      checkout_type: "credits_package",
      plan_id: "starter",
      price_id: "price_123",
      session_id: "cs_123",
    });

    localStorage.setItem(
      PENDING_CHECKOUT_KEY,
      JSON.stringify({
        checkout_type: "credits_package",
        session_id: 123,
      })
    );

    expect(peekPendingCheckout()).toBeNull();
  });
});
