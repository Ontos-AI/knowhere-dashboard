import crypto from "node:crypto";
import { auth } from "@lib/auth";
import { db } from "@lib/db";
import { emailVerificationToken, user as userTable } from "@lib/db/auth-schema";
import { env } from "@lib/env";
import { ORPCError } from "@orpc/server";
import { createApiKey, listApiKeys } from "@server/external-api/api-keys";
import { protectedProcedure, publicProcedure } from "@server/orpc";
import type { User } from "better-auth/types";
import { and, eq, gt } from "drizzle-orm";
import { Resend } from "resend";
import { z } from "zod";

// Extended User type that includes the custom role field added via Better Auth additionalFields
type UserWithRole = User & { role: "user" | "premium" | "admin" };
type UsageWelcomeStatus = "hidden" | "pending" | "provisioning" | "ready" | "completed" | "failed";

const USAGE_WELCOME_API_KEY_NAME = "Welcome API Key";
const NEVER_EXPIRES_AT = "9999-12-31T23:59:59";

const buildUsageWelcomeResponse = ({
  apiKey,
  status,
}: {
  apiKey: string | null;
  status: string;
}) => {
  const normalizedStatus = status as UsageWelcomeStatus;

  switch (normalizedStatus) {
    case "completed":
    case "hidden":
      return {
        apiKey: null,
        hasProvisionError: false,
        isProvisioning: false,
        shouldShow: false,
      };
    case "failed":
      return {
        apiKey: null,
        hasProvisionError: true,
        isProvisioning: false,
        shouldShow: true,
      };
    case "provisioning":
      return {
        apiKey: null,
        hasProvisionError: false,
        isProvisioning: true,
        shouldShow: true,
      };
    case "ready":
      if (!apiKey) {
        return {
          apiKey: null,
          hasProvisionError: true,
          isProvisioning: false,
          shouldShow: true,
        };
      }

      return {
        apiKey,
        hasProvisionError: false,
        isProvisioning: false,
        shouldShow: true,
      };
    default:
      return {
        apiKey: null,
        hasProvisionError: false,
        isProvisioning: false,
        shouldShow: true,
      };
  }
};

/**
 * Helper function to send email verification
 * Reusable for both manual resend and automatic send after email update
 */
async function sendVerificationEmailHelper(userId: string, userEmail: string) {
  // Rate limiting: Check how many verification emails sent in the last hour
  const oneHourAgo = new Date(Date.now() - 3600000);
  const recentTokens = await db.query.emailVerificationToken.findMany({
    where: and(
      eq(emailVerificationToken.userId, userId),
      gt(emailVerificationToken.createdAt, oneHourAgo)
    ),
  });

  if (recentTokens.length >= 6) {
    throw new ORPCError("TOO_MANY_REQUESTS", {
      message: "Too many verification emails sent. Please try again later.",
    });
  }

  // Generate secure token
  const token = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Save token to database
  await db.insert(emailVerificationToken).values({
    userId,
    email: userEmail,
    token,
    expiresAt,
  });

  // Generate verification URL
  const verificationUrl = `${env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  // Send email via Resend
  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: env.RESEND_FROM,
      to: userEmail,
      subject: "Verify your email address",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="color-scheme" content="light dark">
          <meta name="supported-color-schemes" content="light dark">
          <style>
            @media (prefers-color-scheme: dark) {
              .body-bg { background-color: #09090b !important; }
              .content-text { color: #ffffff !important; }
              .secondary-text { color: #a1a1aa !important; }
              .button-primary { background-color: #fafafa !important; color: #09090b !important; }
              .divider { border-color: #27272a !important; }
            }
          </style>
        </head>
        <body class="body-bg" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h2 class="content-text" style="color: #09090b; margin-bottom: 24px;">Verify your email address</h2>
            <p class="content-text" style="color: #09090b; margin-bottom: 24px; line-height: 1.6;">
              Please verify your email address by clicking the button below:
            </p>

            <a href="${verificationUrl}" class="button-primary" style="display: inline-block; padding: 12px 24px; background-color: #09090b; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500;">
              Verify Email
            </a>

            <div class="divider" style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #e5e5e5;">
              <p class="secondary-text" style="font-size: 14px; color: #666666; margin-bottom: 12px;">
                If the button doesn't work, copy and paste this link:
              </p>
              <a href="${verificationUrl}" style="font-size: 13px; color: #666666; word-break: break-all;">
                ${verificationUrl}
              </a>
            </div>

            <p class="secondary-text" style="margin-top: 32px; font-size: 12px; color: #a1a1aa;">
              This link will expire in 24 hours. If you didn't request this email, you can safely ignore it.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to send verification email",
      });
    }

    console.log(`[Email] Verification email sent to ${userEmail}`);
  } catch (error: unknown) {
    console.error("Failed to send verification email:", error);

    // In development, log the verification URL as fallback
    if (env.NODE_ENV === "development") {
      console.log(
        `\n⚠️  [DEV FALLBACK] Email sending failed. Verification URL:\n${verificationUrl}\n`
      );
      // Don't throw error in development, allow user to verify via console URL
      return;
    }

    throw new ORPCError("INTERNAL_SERVER_ERROR", {
      message: "Failed to send verification email",
    });
  }
}

// Users router — handles all user profile operations
// Data is stored directly in the Better Auth user table via Drizzle ORM
export const usersRouter = protectedProcedure.router({
  // Returns the authenticated user from the Better Auth session
  getCurrentUser: publicProcedure.handler(async ({ context }) => {
    return { user: context.user };
  }),

  getUsageWelcomeState: protectedProcedure.handler(async ({ context }) => {
    const existingUser = await db.query.user.findFirst({
      columns: {
        usageWelcomeApiKey: true,
        usageWelcomeStatus: true,
      },
      where: eq(userTable.id, context.user.id),
    });

    if (!existingUser) {
      throw new ORPCError("NOT_FOUND", {
        message: "User not found",
      });
    }

    if (existingUser.usageWelcomeStatus === "hidden") {
      return buildUsageWelcomeResponse({
        apiKey: null,
        status: existingUser.usageWelcomeStatus,
      });
    }

    if (existingUser.usageWelcomeStatus === "ready" && existingUser.usageWelcomeApiKey) {
      return buildUsageWelcomeResponse({
        apiKey: existingUser.usageWelcomeApiKey,
        status: existingUser.usageWelcomeStatus,
      });
    }

    if (
      existingUser.usageWelcomeStatus === "completed" ||
      existingUser.usageWelcomeStatus === "failed" ||
      existingUser.usageWelcomeStatus === "provisioning"
    ) {
      return buildUsageWelcomeResponse({
        apiKey: existingUser.usageWelcomeApiKey ?? null,
        status: existingUser.usageWelcomeStatus,
      });
    }

    const [claimedProvisioning] = await db
      .update(userTable)
      .set({
        updatedAt: new Date(),
        usageWelcomeStatus: "provisioning",
      })
      .where(and(eq(userTable.id, context.user.id), eq(userTable.usageWelcomeStatus, "pending")))
      .returning({
        id: userTable.id,
      });

    if (!claimedProvisioning) {
      const refreshedUser = await db.query.user.findFirst({
        columns: {
          usageWelcomeApiKey: true,
          usageWelcomeStatus: true,
        },
        where: eq(userTable.id, context.user.id),
      });

      if (!refreshedUser) {
        throw new ORPCError("NOT_FOUND", {
          message: "User not found",
        });
      }

      return buildUsageWelcomeResponse({
        apiKey: refreshedUser.usageWelcomeApiKey ?? null,
        status: refreshedUser.usageWelcomeStatus,
      });
    }

    try {
      const createdApiKey = await createApiKey({
        userId: context.user.id,
        data: {
          enabled_modules: [],
          expires_at: NEVER_EXPIRES_AT,
          name: USAGE_WELCOME_API_KEY_NAME,
        },
      });

      if (!createdApiKey.api_key) {
        throw new Error("Missing API key payload");
      }

      const [updatedUser] = await db
        .update(userTable)
        .set({
          updatedAt: new Date(),
          usageWelcomeApiKey: createdApiKey.api_key,
          usageWelcomeStatus: "ready",
        })
        .where(
          and(eq(userTable.id, context.user.id), eq(userTable.usageWelcomeStatus, "provisioning"))
        )
        .returning({
          usageWelcomeApiKey: userTable.usageWelcomeApiKey,
          usageWelcomeStatus: userTable.usageWelcomeStatus,
        });

      if (!updatedUser) {
        return {
          apiKey: null,
          hasProvisionError: false,
          isProvisioning: true,
          shouldShow: true,
        };
      }

      return buildUsageWelcomeResponse({
        apiKey: updatedUser.usageWelcomeApiKey,
        status: updatedUser.usageWelcomeStatus,
      });
    } catch (error) {
      console.error("[getUsageWelcomeState] Failed to provision onboarding API key:", error);

      await db
        .update(userTable)
        .set({
          updatedAt: new Date(),
          usageWelcomeStatus: "failed",
        })
        .where(eq(userTable.id, context.user.id));

      return {
        apiKey: null,
        hasProvisionError: true,
        isProvisioning: false,
        shouldShow: true,
      };
    }
  }),

  dismissUsageWelcome: protectedProcedure.handler(async ({ context }) => {
    await db
      .update(userTable)
      .set({
        updatedAt: new Date(),
        usageWelcomeApiKey: null,
        usageWelcomeStatus: "completed",
      })
      .where(eq(userTable.id, context.user.id));

    return { success: true };
  }),

  // Allows partial updates to user name and avatar image
  updateProfile: protectedProcedure
    .route({
      summary: "🔒 Update user profile",
      description:
        "**Authentication Required** - Updates the authenticated user's profile information including name and avatar image.\n\n" +
        "This endpoint requires you to be logged in. The session cookie is automatically sent by your browser after login.",
    })
    .input(
      z.object({
        name: z.string().min(1).optional(),
        image: z.string().url("Invalid URL format").optional(),
      })
    )
    .handler(async ({ input, context }) => {
      try {
        // Build update body with only defined fields
        const updateBody: { name?: string; image?: string } = {};
        if (input.name !== undefined) updateBody.name = input.name;
        if (input.image !== undefined) updateBody.image = input.image;

        // Check if there are fields to update
        if (Object.keys(updateBody).length === 0) {
          throw new ORPCError("BAD_REQUEST", {
            message: "No fields to update",
          });
        }

        // Use better-auth's updateUser API which updates both database AND session cookie
        // This ensures the cookieCache is refreshed immediately
        const result = await auth.api.updateUser({
          headers: context.headers,
          body: updateBody,
        });

        console.log("[updateProfile] Updated via better-auth:", result);

        // Fetch the updated user from database to return
        const updatedUser = await db.query.user.findFirst({
          where: eq(userTable.id, context.user.id),
        });

        if (!updatedUser) {
          throw new ORPCError("NOT_FOUND", {
            message: "User not found",
          });
        }

        return { user: updatedUser };
      } catch (error) {
        console.error("[updateProfile] Error:", error);
        throw error;
      }
    }),

  // Updates the user's email address; requires re-verification
  updateEmail: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .handler(async ({ input, context }) => {
      // Check if the email is already taken by another user
      const existing = await db.query.user.findFirst({
        where: eq(userTable.email, input.email),
      });

      if (existing && existing.id !== context.user.id) {
        throw new ORPCError("CONFLICT", {
          message: "Email is already in use",
        });
      }

      // Update email and set emailVerified to false
      const [updatedUser] = await db
        .update(userTable)
        .set({ email: input.email, emailVerified: false, updatedAt: new Date() })
        .where(eq(userTable.id, context.user.id))
        .returning();

      // Automatically send verification email to new address
      try {
        await sendVerificationEmailHelper(context.user.id, input.email);
      } catch (error) {
        // Log error but don't fail the email update
        console.error("[updateEmail] Failed to send verification email:", error);
        // User can manually resend later via the "Resend" button
      }

      return { user: updatedUser };
    }),

  // Updates a target user's role — restricted to admin users only
  updateRole: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["user", "premium", "admin"]),
      })
    )
    .handler(async ({ input, context }) => {
      // Cast to UserWithRole since Better Auth runtime includes the additionalFields at execution time
      const currentUser = context.user as UserWithRole;

      if (currentUser.role !== "admin") {
        throw new ORPCError("FORBIDDEN", {
          message: "Only admins can update user roles",
        });
      }

      const updatedUser = await db
        .update(userTable)
        .set({ role: input.role, updatedAt: new Date() })
        .where(eq(userTable.id, input.userId))
        .returning();

      return { user: updatedUser[0] };
    }),

  // Sends email verification link to the authenticated user's email address
  sendVerificationEmail: protectedProcedure.handler(async ({ context }) => {
    const user = context.user;

    // Check if email is already verified
    if (user.emailVerified) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Email already verified",
      });
    }

    // Use the helper function to send verification email
    await sendVerificationEmailHelper(user.id, user.email);

    return { success: true, message: "Verification email sent" };
  }),

  // Verifies email using the token from the verification link
  verifyEmail: publicProcedure.input(z.object({ token: z.string() })).handler(async ({ input }) => {
    // Find token in database
    const tokenRecord = await db.query.emailVerificationToken.findFirst({
      where: eq(emailVerificationToken.token, input.token),
    });

    if (!tokenRecord) {
      throw new ORPCError("NOT_FOUND", {
        message: "Token not found",
      });
    }

    // Check if token has expired
    if (new Date() > tokenRecord.expiresAt) {
      // Delete expired token
      await db.delete(emailVerificationToken).where(eq(emailVerificationToken.id, tokenRecord.id));

      throw new ORPCError("BAD_REQUEST", {
        message: "Invalid or expired token",
      });
    }

    // Update user's emailVerified to true
    await db
      .update(userTable)
      .set({ emailVerified: true, updatedAt: new Date() })
      .where(eq(userTable.id, tokenRecord.userId));

    // Delete used token
    await db.delete(emailVerificationToken).where(eq(emailVerificationToken.id, tokenRecord.id));

    return { success: true, message: "Email verified successfully" };
  }),

  /**
   * Provision a Knowhere API key for use by the Notebook app.
   *
   * Idempotent by name: if a key named "Knowhere Notebook" already
   * exists for this user, it is returned directly. Otherwise a new
   * key is created and returned.
   *
   * The returned key is a Knowhere credential (id + secret), NOT a
   * Dashboard JWT. Notebook stores it in its local `api_keys` table
   * and uses it for Knowhere SDK calls.
   */
  provisionNotebookApiKey: protectedProcedure.handler(async ({ context }) => {
    // Unique name per provision: Knowhere rejects duplicate names and
    // the list endpoint returns masked keys (sk_...••••), so reuse
    // is not possible. Each call creates a fresh key; Notebook's
    // api_keys table handles its own idempotency (unique workspace_id
    // index + onConflictDoNothing).
    const uniqueName = `Knowhere Notebook ${Date.now()}`;

    const created = await createApiKey({
      userId: context.user.id,
      data: {
        name: uniqueName,
        enabled_modules: ["parse", "retrieval"],
        expires_at: NEVER_EXPIRES_AT,
      },
    });

    // `createApiKey` returns the full secret only at creation time.
    if (!created.api_key) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Created Notebook API key but secret was not returned.",
      });
    }

    // create does not return a usable `id`; list to find the
    // server-assigned id by matching the unique name. The plaintext
    // secret from create is the only usable key value.
    const allKeys = await listApiKeys({ userId: context.user.id });
    const listed = allKeys.api_keys.find((k) => k.name === uniqueName);
    if (!listed?.id) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message:
          "Created Notebook API key but could not resolve its server id " +
          "from the list response. The key exists but is untraceable.",
      });
    }

    return {
      id: listed.id,
      key: created.api_key,
      name: created.name,
    };
  }),
});
