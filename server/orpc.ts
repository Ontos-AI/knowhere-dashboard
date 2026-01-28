import { ORPCError } from '@orpc/server';
import { base } from './context';

// Public procedure - anyone can access
// No authentication required
export const publicProcedure = base;

// Authentication middleware
// Validates that user and session exist in context (already populated by createContext)
const authMiddleware = base.middleware(async ({ context, next }) => {
  if (!context.user || !context.session) {
    throw new ORPCError('UNAUTHORIZED', {
      status: 401,
      message: 'Authentication required',
    });
  }

  return next({
    context: {
      user: context.user,
      session: context.session,
    },
  });
});

// Protected procedure - requires authentication
// User and session are guaranteed to exist in handlers
export const protectedProcedure = base.use(authMiddleware);
