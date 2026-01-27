import { orpc } from '@/lib/orpc/server';
import { OpenAPIHandler } from '@orpc/openapi/fetch';
import { RPCHandler } from '@orpc/server/fetch';
import { z } from 'zod';

// Define example procedures with OpenAPI metadata
const router = orpc.router({
  // Example: Hello procedure
  // Demonstrates a simple GET-like procedure with no input
  hello: orpc
    .route({
      // Use POST method by default
      path: '/hello',
      summary: 'Say hello',
      description:
        'Returns a simple greeting message. This is a basic example of an oRPC procedure without input parameters.',
      tags: ['Examples'],
    })
    .handler(async () => {
      return { message: 'Hello from oRPC!' };
    }),

  // Example: Echo procedure with input validation
  // Demonstrates input validation using Zod schemas
  echo: orpc
    .route({
      path: '/echo',
      summary: 'Echo a message',
      description:
        'Echoes back the provided message. This demonstrates how to use input validation with Zod schemas and how they automatically generate OpenAPI request body schemas.',
      tags: ['Examples'],
    })
    .input(
      z.object({
        message: z.string().describe('The message to echo back'),
      }),
    )
    .handler(async ({ input }) => {
      return { echo: input.message };
    }),
});

export type AppRouter = typeof router;

// Export router for OpenAPI documentation generation
export { router };

// Create handlers for both RPC and OpenAPI protocols
const rpcHandler = new RPCHandler(router);
const openAPIHandler = new OpenAPIHandler(router);

async function handleRequest(request: Request) {
  // Try RPC handler first (for oRPC client)
  const rpcResult = await rpcHandler.handle(request, {
    prefix: '/api/orpc',
    context: {},
  });

  if (rpcResult.response) {
    return rpcResult.response;
  }

  // Fallback to OpenAPI handler (for REST/OpenAPI clients and documentation)
  const openAPIResult = await openAPIHandler.handle(request, {
    prefix: '/api/orpc',
    context: {},
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
