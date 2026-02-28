import { oo } from "@orpc/openapi";
import { ORPCError } from "@orpc/server";
import { base } from "@server/context";
import { ApiError } from "@server/external-api/request";

const apiErrorMiddleware = base.middleware(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof ORPCError) {
      throw error;
    }

    if (error instanceof ApiError) {
      throw new ORPCError(error.orpcCode, {
        status: error.status,
        message: error.message,
      });
    }

    throw error;
  }
});

// Public procedure - anyone can access
// No authentication required
export const publicProcedure = base.use(apiErrorMiddleware);

// Authentication middleware with OpenAPI security spec
// Validates that user and session exist in context (already populated by createContext)
const authMiddleware = oo.spec(
  base.middleware(async ({ context, next }) => {
    if (!context.user || !context.session) {
      throw new ORPCError("UNAUTHORIZED", {
        status: 401,
        message: "Authentication required. Please login first at /login to access this endpoint.",
      });
    }

    return next({
      context: {
        user: context.user,
        session: context.session,
      },
    });
  }),
  {
    // Apply cookie-based authentication to all procedures using this middleware
    security: [{ cookieAuth: [] }],
    // Add 401 response documentation
    responses: {
      401: {
        description:
          "🔒 **Authentication Required** - You must be logged in to access this endpoint. Please login at `/login` first.",
      },
    },
  }
);

// Protected procedure - requires authentication
// User and session are guaranteed to exist in handlers
// Automatically includes cookieAuth security requirement in OpenAPI spec
export const protectedProcedure = publicProcedure.use(authMiddleware);
