'use client'

import { authClient } from '@lib/betterAuthClient'
import { useBackendSync } from './use-backend-sync'
import type { User } from '@server/external-api/client'

/**
 * Main authentication hook that combines Better Auth session with backend API sync
 *
 * @returns Authentication state and actions
 */
export function useAuth() {
  // Get Better Auth session
  const { data: session, isPending: isSessionPending } = authClient.useSession()

  // Sync with backend API
  const { backendUser, isBackendReady, isSyncing, refreshBackendUser } = useBackendSync()

  // Determine loading state: loading if either Better Auth or backend sync is in progress
  const isLoading = isSessionPending || isSyncing

  // User is authenticated if Better Auth session exists AND backend is synced
  const isAuthenticated = !!session?.user && isBackendReady

  // Map Better Auth user to our User type, prioritizing backend user data
  const user: User | null = backendUser || null

  /**
   * Logout from both Better Auth and backend API
   */
  const logout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            // Backend token cleanup is handled by useBackendSync hook
            console.log('[useAuth] Successfully logged out')
          },
        },
      })
    } catch (error) {
      console.error('[useAuth] Logout error:', error)
    }
  }

  // Re-export authClient methods for direct access if needed
  const refreshSession = async () => {
    await authClient.getSession({
      fetchOptions: {
        headers: {
          'Cache-Control': 'no-cache',
        },
      },
    })
  }

  /**
   * Refresh both Better Auth session and backend user data
   * Useful after updating user profile
   */
  const refreshUser = async () => {
    try {
      // Refresh Better Auth session
      await refreshSession()

      // Refresh backend user profile
      await refreshBackendUser()

      console.log('[useAuth] Successfully refreshed user data')
    } catch (error) {
      console.error('[useAuth] Failed to refresh user:', error)
      throw error
    }
  }

  return {
    // User data
    user,

    // Auth state
    isAuthenticated,
    isLoading,

    // Better Auth session (for direct access if needed)
    session: session?.user || null,

    // Actions
    logout,
    refreshSession,
    refreshUser,
  }
}
