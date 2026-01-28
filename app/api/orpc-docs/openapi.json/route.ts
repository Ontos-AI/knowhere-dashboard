import { router } from '@/app/api/orpc/[...orpc]/route';
import { env } from '@/lib/env';
import { OpenAPIGenerator } from '@orpc/openapi';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';

/**
 * OpenAPI Specification Generator Route
 *
 * This route dynamically generates OpenAPI 3.0 specification from the oRPC router.
 * It's only accessible in development environment for security reasons.
 *
 * @route GET /api/orpc-docs/openapi.json
 * @returns OpenAPI 3.0 JSON specification
 */
export async function GET() {
  // Check if running in development environment
  const isDevelopment = env.ENVIRONMENT === 'development' || env.NODE_ENV === 'development';

  if (!isDevelopment) {
    return new Response('API documentation is only available in development environment', {
      status: 403,
    });
  }

  try {
    // Create OpenAPI generator with Zod schema converter
    const generator = new OpenAPIGenerator({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    });

    // Generate OpenAPI specification from router
    const openAPISpec = await generator.generate(router, {
      info: {
        title: 'Knowhere API - oRPC Endpoints',
        version: '1.0.0',
        description:
          'Auto-generated API documentation for oRPC procedures. This documentation is automatically generated from the code and stays in sync with the implementation.',
      },
      servers: [
        {
          url: `${env.NEXT_PUBLIC_APP_URL}/api/orpc`,
          description: isDevelopment ? 'Development server' : 'Production server',
        },
      ],
    });

    // Return JSON response
    return Response.json(openAPISpec);
  } catch (error) {
    console.error('Failed to generate OpenAPI specification:', error);
    return new Response('Failed to generate API documentation', {
      status: 500,
    });
  }
}
