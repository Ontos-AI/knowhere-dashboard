'use client'

import { useEffect, useState } from 'react'
import { authClient } from '@lib/betterAuthClient'
import { api, type User } from '@server/external-api/client'
import { env } from '@lib/env'
import { useRouter } from '@/navigation'

type BackendSyncState = {
  token: string | null
  backendUser: User | null
  isBackendReady: boolean
  isSyncing: boolean
  syncError: Error | null
}

/**
 * Hook to sync Better Auth session with external backend API
 * This hook manages the token and user data for the external API
 *
 * @returns Backend sync state including token, user, and sync status
 */
export function useBackendSync() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const [state, setState] = useState<BackendSyncState>({
    token: null,
    backendUser: null,
    isBackendReady: false,
    isSyncing: false,
    syncError: null,
  })

  useEffect(() => {
    // Skip if session is still loading
    if (isPending) return

    // If no session, clear backend data
    if (!session?.user) {
      setState({
        token: null,
        backendUser: null,
        isBackendReady: false,
        isSyncing: false,
        syncError: null,
      })
      api.updateToken(null)
      return
    }

    // If session exists but backend not synced, sync now
    if (session.user && !state.isBackendReady && !state.isSyncing) {
      syncWithBackend(session.user.email!, session.user.name)
    }
  }, [session, isPending, state.isBackendReady, state.isSyncing])

  /**
   * Sync Better Auth user with external backend API
   * Attempts login first, then registration if login fails
   */
  const syncWithBackend = async (email: string, name?: string | null) => {
    if (!email) {
      console.error('[useBackendSync] No email provided, cannot sync')
      return
    }

    setState((prev) => ({ ...prev, isSyncing: true, syncError: null }))

    const hardcodedPassword = env.NEXT_PUBLIC_DEFAULT_API_PASSWORD

    try {
      // Try to login first
      try {
        const loginRes = await api.login({
          email,
          password: hardcodedPassword,
        })

        const newToken = loginRes.access_token
        if (!newToken) {
          throw new Error('No access_token returned from login')
        }

        // Update token in API client
        api.updateToken(newToken)

        // Fetch full user profile from backend
        const profile = await api.getUserProfile()

        setState({
          token: newToken,
          backendUser: profile,
          isBackendReady: true,
          isSyncing: false,
          syncError: null,
        })

        console.log('[useBackendSync] Successfully logged in to backend API')
        return
      } catch (loginError) {
        // If login fails, try to register
        console.log('[useBackendSync] Login failed, attempting registration')

        try {
          await api.register({
            email,
            password: hardcodedPassword,
            username: name || email.split('@')[0] || 'User',
          })

          // After registration, login again
          const loginRes = await api.login({
            email,
            password: hardcodedPassword,
          })

          const newToken = loginRes.access_token
          api.updateToken(newToken)

          const profile = await api.getUserProfile()

          setState({
            token: newToken,
            backendUser: profile,
            isBackendReady: true,
            isSyncing: false,
            syncError: null,
          })

          console.log('[useBackendSync] Successfully registered and logged in to backend API')
        } catch (regError) {
          console.error('[useBackendSync] Registration failed:', regError)

          // Clear Better Auth session on sync failure
          await authClient.signOut()

          setState((prev) => ({
            ...prev,
            isSyncing: false,
            syncError: regError instanceof Error ? regError : new Error('Registration failed'),
          }))

          router.push('/login?error=sync_failed')
          throw new Error('sync_failed')
        }
      }
    } catch (error) {
      console.error('[useBackendSync] Sync error:', error)

      // Clear Better Auth session on sync failure
      await authClient.signOut()

      setState((prev) => ({
        ...prev,
        isSyncing: false,
        syncError: error instanceof Error ? error : new Error('Sync failed'),
      }))

      api.updateToken(null)
      router.push('/login?error=sync_error')
    }
  }

  /**
   * Refresh backend user profile data
   * Used after updating user information
   */
  const refreshBackendUser = async () => {
    if (!state.token) {
      console.warn('[useBackendSync] No token available, cannot refresh user')
      return
    }

    try {
      const profile = await api.getUserProfile()
      setState((prev) => ({ ...prev, backendUser: profile }))
      console.log('[useBackendSync] Successfully refreshed backend user profile')
    } catch (error) {
      console.error('[useBackendSync] Failed to refresh user profile:', error)
      throw error
    }
  }

  return { ...state, refreshBackendUser }
}
