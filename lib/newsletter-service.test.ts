import crypto from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => {
  const findFirst = vi.fn();
  const updateWhere = vi.fn(async () => undefined);
  const updateSet = vi.fn(() => ({ where: updateWhere }));
  const update = vi.fn(() => ({ set: updateSet }));
  const insertValues = vi.fn(async () => undefined);
  const insert = vi.fn(() => ({ values: insertValues }));
  const touchSharedDashboardDb = vi.fn(() => {
    throw new Error("Newsletter storage must not use the shared dashboard database");
  });

  return {
    newsletterDb: {
      query: {
        newsletterSubscription: {
          findFirst,
        },
      },
      update,
      insert,
    },
    sharedDashboardDb: {
      query: {
        newsletterSubscription: {
          findFirst: touchSharedDashboardDb,
        },
      },
      update: touchSharedDashboardDb,
      insert: touchSharedDashboardDb,
    },
    findFirst,
    updateWhere,
    updateSet,
    update,
    insertValues,
    insert,
    touchSharedDashboardDb,
  };
});

vi.mock("@lib/db/newsletter", () => ({
  newsletterDb: dbMocks.newsletterDb,
}));

vi.mock("@lib/db", () => ({
  db: dbMocks.sharedDashboardDb,
}));

vi.mock("@lib/env", () => ({
  env: {
    DATABASE_URL: "postgres://dashboard.example/dashboard",
    NEWSLETTER_DATABASE_URL: "postgres://newsletter.example/newsletter",
    UNSAFE_DB_SSL_ENABLED: "false",
    NEXT_PUBLIC_APP_URL: "https://knowhereto.ai",
    RESEND_API_KEY: undefined,
    RESEND_FROM: "Knowhere <team@knowhereto.ai>",
    NODE_ENV: "development",
  },
}));

import {
  confirmNewsletterSubscription,
  requestNewsletterSubscription,
  unsubscribeNewsletterSubscription,
} from "@server/newsletter-service";

function hashConfirmationToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function expectSharedDashboardDbUntouched(): void {
  expect(dbMocks.touchSharedDashboardDb).not.toHaveBeenCalled();
}

beforeEach(() => {
  vi.clearAllMocks();
  dbMocks.findFirst.mockResolvedValue(null);
  dbMocks.updateWhere.mockResolvedValue(undefined);
  dbMocks.insertValues.mockResolvedValue(undefined);
  vi.spyOn(console, "log").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("newsletter service database routing", () => {
  it("creates new subscription requests in the newsletter database", async () => {
    await expect(requestNewsletterSubscription(" User@Example.COM ")).resolves.toEqual({
      success: true,
      status: "confirmation_sent",
    });

    expect(dbMocks.findFirst).toHaveBeenCalledTimes(1);
    expect(dbMocks.insert).toHaveBeenCalledTimes(1);
    expect(dbMocks.insertValues).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "user@example.com",
        status: "pending",
      })
    );
    expectSharedDashboardDbUntouched();
  });

  it("confirms subscription tokens in the newsletter database", async () => {
    const token = "newsletter-confirm-token";
    const now = Date.now();

    dbMocks.findFirst.mockResolvedValue({
      id: "newsletter-subscription-id",
      email: "user@example.com",
      status: "pending",
      confirmationTokenHash: hashConfirmationToken(token),
      confirmationTokenExpiresAt: new Date(now + 60_000),
      confirmationSentAt: new Date(now),
      confirmedAt: null,
      unsubscribedAt: null,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    });

    await expect(confirmNewsletterSubscription(token)).resolves.toEqual({
      status: "confirmed",
    });

    expect(dbMocks.findFirst).toHaveBeenCalledTimes(1);
    expect(dbMocks.update).toHaveBeenCalledTimes(1);
    expect(dbMocks.updateSet).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "confirmed",
        confirmationTokenHash: null,
        confirmationTokenExpiresAt: null,
        unsubscribedAt: null,
      })
    );
    expectSharedDashboardDbUntouched();
  });

  it("unsubscribes emails in the newsletter database", async () => {
    await expect(unsubscribeNewsletterSubscription(" User@Example.COM ")).resolves.toEqual({
      success: true,
    });

    expect(dbMocks.update).toHaveBeenCalledTimes(1);
    expect(dbMocks.updateSet).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "unsubscribed",
        confirmationTokenHash: null,
        confirmationTokenExpiresAt: null,
        confirmationSentAt: null,
      })
    );
    expectSharedDashboardDbUntouched();
  });
});
