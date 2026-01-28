import { os } from '@orpc/server'

// Define context type for oRPC procedures
export type Context = {
  user?: {
    id: string
    email: string
    name?: string
  }
}

// Create oRPC server instance
// Context will be provided through middleware using os.use()
export const orpc = os
