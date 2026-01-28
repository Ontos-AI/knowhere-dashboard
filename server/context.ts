import { os } from '@orpc/server'
import { auth } from '@lib/auth'
import type { Session, User } from 'better-auth/types'
import { KnowhereAPI } from '@server/external-api/client'

// Context type that will be available in all oRPC procedures
export type Context = {
  headers: Headers
  user: User | null
  session: Session | null
  api: KnowhereAPI
}

// Base oRPC instance with context type
export const base = os.$context<Context>()

// Helper function to create context from request headers
export async function createContext(headers: Headers): Promise<Context> {
  const sessionData = await auth.api.getSession({ headers })

  // Extract token from Authorization header for external API calls
  const authHeader = headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '') ?? null

  // Create API instance with token for server-side usage
  const api = new KnowhereAPI(token)

  return {
    headers,
    user: sessionData?.user ?? null,
    session: sessionData?.session ?? null,
    api,
  }
}
