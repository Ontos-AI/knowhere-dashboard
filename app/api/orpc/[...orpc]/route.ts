import { createContext } from '@server/context'
import { appRouter } from '@server/routers'
import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { RPCHandler } from '@orpc/server/fetch'

// Export router type for client-side type inference
export type { AppRouter } from '@server/routers'

// Export router for OpenAPI documentation generation
export { appRouter as router }

// Create handlers for both RPC and OpenAPI protocols
const rpcHandler = new RPCHandler(appRouter)
const openAPIHandler = new OpenAPIHandler(appRouter)

async function handleRequest(request: Request) {
  // Create context from request headers (includes authentication session)
  const context = await createContext(request.headers);

  // Try RPC handler first (for oRPC client)
  const rpcResult = await rpcHandler.handle(request, {
    prefix: '/api/orpc',
    context,
  });

  if (rpcResult.response) {
    return rpcResult.response;
  }

  // Fallback to OpenAPI handler (for REST/OpenAPI clients and documentation)
  const openAPIResult = await openAPIHandler.handle(request, {
    prefix: '/api/orpc',
    context,
  });

  if (openAPIResult.matched) {
    return openAPIResult.response;
  }

  return new Response('Not found', { status: 404 });
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
