import { env } from '@lib/env';

/**
 * Swagger UI Route
 *
 * This route renders Swagger UI interface for exploring and testing oRPC endpoints.
 * It's only accessible in development environment for security reasons.
 *
 * @route GET /api/orpc/docs
 * @returns HTML page with Swagger UI
 */
export async function GET() {
  // Check if running in development environment
  const isDevelopment = env.ENVIRONMENT === 'development' || env.NODE_ENV === 'development';

  if (!isDevelopment) {
    return new Response('API documentation is only available in development environment', {
      status: 403,
    });
  }

  // HTML page with Swagger UI
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Knowhere API - oRPC Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <style>
    body {
      margin: 0;
      padding: 0;
    }
    .swagger-ui .topbar {
      display: none;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        url: '/api/orpc-docs/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        displayRequestDuration: true,
        tryItOutEnabled: true,
        persistAuthorization: true,
      })
    }
  </script>
</body>
</html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
