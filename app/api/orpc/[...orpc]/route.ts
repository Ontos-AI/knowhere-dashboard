import { env } from "@lib/env";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { createContext } from "@server/context";
import { appRouter } from "@server/routers";
import { authCookies } from "@/lib/auth-cookie-config";

// Export router type for client-side type inference
export type { AppRouter } from "@server/routers";

// Export router for OpenAPI documentation generation
export { appRouter as router };

// Create handlers for both RPC and OpenAPI protocols
const rpcHandler = new RPCHandler(appRouter);

// Only enable Scalar UI documentation in non-production environments
// This prevents exposing API documentation in production for security reasons
const isProduction = env.NODE_ENV === "production";
const sessionCookieName = authCookies.getSessionCookieNames()[0];
const openAPIPlugins = isProduction
  ? [] // No documentation in production
  : [
      new OpenAPIReferencePlugin({
        docsProvider: "scalar", // Use Scalar UI (default)
        docsPath: "/docs", // Scalar UI will be at /api/orpc/docs
        specPath: "/docs/spec.json", // OpenAPI spec will be at /api/orpc/docs/spec.json
        schemaConverters: [new ZodToJsonSchemaConverter()],
        specGenerateOptions: {
          info: {
            title: "Knowhere API - oRPC Endpoints",
            version: "1.0.0",
            description:
              "Auto-generated API documentation for oRPC procedures. This documentation is automatically generated from the code and stays in sync with the implementation.\n\n" +
              "## ⚠️ Authentication Notice\n\n" +
              "**You CANNOT login directly in this API documentation.** Most endpoints require authentication via session cookie.\n\n" +
              "**To test protected endpoints (marked with 🔒):**\n" +
              "1. Open the main application at `/` in the **same browser**\n" +
              "2. Login using GitHub OAuth, Google OAuth, or Email Magic Link\n" +
              "3. After successful login, return to this API documentation\n" +
              "4. Your session cookie will be automatically included in all requests\n" +
              "5. Protected endpoints will now work without any additional configuration\n\n" +
              "**Note:** The session cookie is shared across the same domain, so logging in to the main application automatically authenticates API requests in this documentation.",
          },
          servers: [
            {
              url: `${env.NEXT_PUBLIC_APP_URL}/api/orpc`,
              description:
                env.NODE_ENV === "development"
                  ? "Development server"
                  : env.NODE_ENV === "production"
                    ? "Production server"
                    : "Staging server",
            },
          ],
          // Security schemes configuration for cookie-based authentication
          components: {
            securitySchemes: {
              cookieAuth: {
                type: "apiKey",
                in: "cookie",
                name: sessionCookieName,
                description:
                  "🔐 **Session-based Authentication (Cookie)**\n\n" +
                  "This API uses session cookies for authentication. **You cannot login here directly.**\n\n" +
                  "**Authentication Flow:**\n" +
                  "1. **Login in Main Application**: Navigate to `/` and login using:\n" +
                  "   - GitHub OAuth\n" +
                  "   - Google OAuth  \n" +
                  "   - Email Magic Link (passwordless)\n" +
                  `2. **Session Cookie is Set**: After successful login, your browser receives a session cookie (\`${sessionCookieName}\`)\n` +
                  "3. **Cookie Auto-Included**: When you make API requests from this documentation, the browser automatically includes the cookie\n" +
                  "4. **No Manual Configuration**: You don't need to copy/paste any tokens or configure authentication in Scalar UI\n\n" +
                  "**Troubleshooting:**\n" +
                  "- If you get 401 errors, make sure you're logged in to the main application at `/`\n" +
                  "- The session cookie is domain-specific and works across all pages on the same domain\n" +
                  "- Session expires after 30 days of inactivity",
              },
            },
          },
          // Note: Security is applied at the procedure level via middleware
          // Public procedures have no security requirements
          // Protected procedures automatically include cookieAuth requirement
        },
      }),
    ];

const openAPIHandler = new OpenAPIHandler(appRouter, {
  plugins: openAPIPlugins,
});

async function handleRequest(request: Request) {
  // Create context from request headers (includes authentication session)
  const context = await createContext(request.headers);

  // Determine which handler to use based on request body format
  // RPC client sends {"json": {...}} or {} (for no-param methods), REST API sends {...} directly
  let useRPCHandler = false;

  if (request.method !== "GET") {
    try {
      // Check Content-Type header
      const contentType = request.headers.get("content-type");
      const isJsonContent = contentType?.includes("application/json");

      // Only parse JSON if Content-Type indicates JSON
      if (!isJsonContent) {
        useRPCHandler = false;
      } else {
        const clonedRequest = request.clone();
        const body = await clonedRequest.json();

        // Ensure body is a plain object (not array, Date, etc.)
        const isPlainObject =
          body !== null &&
          typeof body === "object" &&
          !Array.isArray(body) &&
          Object.prototype.toString.call(body) === "[object Object]";

        if (isPlainObject) {
          // Check if it's an empty object {} (no-param RPC call)
          const keys = Object.keys(body);
          const isEmptyObject = keys.length === 0;

          // Check if it has "json" key (standard RPC call with params)
          // Use hasOwnProperty to avoid prototype chain pollution
          const hasJsonKey = Object.hasOwn(body, "json");

          if (hasJsonKey) {
            // Verify that json value is an object (not null, array, or primitive)
            const jsonValue = body.json;
            const isJsonValueValid =
              jsonValue !== null &&
              typeof jsonValue === "object" &&
              !Array.isArray(jsonValue) &&
              Object.prototype.toString.call(jsonValue) === "[object Object]";

            // Only treat as RPC if json value is valid
            useRPCHandler = isJsonValueValid;

            // Optionally: warn about extra keys (but still allow)
            if (useRPCHandler && keys.length > 1) {
              console.warn("[oRPC] Request contains extra keys besides 'json':", keys);
            }
          } else {
            // Empty object without json key - valid no-param RPC call
            useRPCHandler = isEmptyObject;
          }
        }
      }
    } catch (_e) {
      // If we can't parse JSON, let handlers decide
      useRPCHandler = false;
    }
  }

  if (useRPCHandler) {
    // Use RPC handler for oRPC TypeScript client
    // RPC handler uses proprietary protocol with {"json": {...}} wrapper
    const rpcResult = await rpcHandler.handle(request, {
      prefix: "/api/orpc",
      context,
    });

    if (rpcResult.response) {
      return rpcResult.response;
    }
  }

  // Use OpenAPI handler for REST/OpenAPI clients and documentation like Scalar UI
  // OpenAPI handler expects direct data format without "json" wrapper
  const openAPIResult = await openAPIHandler.handle(request, {
    prefix: "/api/orpc",
    context,
  });

  if (openAPIResult.matched) {
    return openAPIResult.response;
  }

  // If OpenAPI didn't match and we didn't try RPC yet, try RPC as fallback
  if (!useRPCHandler) {
    const rpcResult = await rpcHandler.handle(request, {
      prefix: "/api/orpc",
      context,
    });

    if (rpcResult.response) {
      return rpcResult.response;
    }
  }

  return new Response("Not found", { status: 404 });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
