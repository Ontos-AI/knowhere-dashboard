'use client'

import { type User, api } from '@/lib/api'
import { authClient } from '@/lib/betterAuthClient'
import { useRouter } from '@/navigation'
import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string) => Promise<void>
  logout: () => Promise<void>
  oauthLogin: (provider: 'google' | 'apple' | 'github', token: string) => Promise<void>
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // Better Auth uses cookies, so token might be null or we can try to get it from session if available
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Use Better Auth session
  const { data: session, isPending } = authClient.useSession()

  // Sync Better Auth session to User state
  useEffect(() => {
    // console.log('[AuthContext] Session update:', { isPending, hasSession: !!session, userEmail: session?.user?.email })

    if (isPending) return

    if (session?.user) {
      // console.log('[AuthContext] Session detected, starting backend sync...')

      // Map Better Auth session user to our User type
      const mappedUser: User = {
        id: session.user.id,
        email: session.user.email || '',
        username: session.user.name || session.user.email?.split('@')[0] || 'User',
        user_type: 'user',
        is_active: true,
        is_verified: session.user.emailVerified,
        credits_balance: 0,
        avatar_url: session.user.image || undefined,
        create_time: session.user.createdAt
          ? new Date(session.user.createdAt).toISOString()
          : new Date().toISOString(),
      }

      // Sync with backend API
      const syncWithBackend = async () => {
        // console.log('[AuthContext] syncWithBackend triggered. Session User:', session.user)

        if (!session.user.email) {
          console.error('[AuthContext] No email in session user, cannot sync.')
          return
        }

        // 使用环境变量中的默认密码，如果没有则使用硬编码的后备密码
        const hardcodedPassword =
          process.env.NEXT_PUBLIC_DEFAULT_API_PASSWORD || 'DefaultPass123!@#'

        try {
          // 1. Try to login first
          try {
            const loginRes = await api.login({
              email: session.user.email,
              password: hardcodedPassword,
            })
            // 用户要求仔细检查 login 返回
            // console.log('Login response:', loginRes)

            const newToken = loginRes.access_token
            if (!newToken) {
              console.error('[AuthContext] No access_token in login response:', loginRes)
              throw new Error('No access_token returned')
            }
            setToken(newToken)
            api.updateToken(newToken)

            // Fetch full profile
            const profile = await api.getUserProfile()
            setUser(profile)
            return
          } catch (loginError) {
            // If login fails, try to register
            // console.log("[AuthContext] Login failed, attempting registration...", loginError)

            try {
              await api.register({
                email: session.user.email,
                password: hardcodedPassword,
                username: session.user.name || session.user.email.split('@')[0] || 'User',
              })

              // After register, login again
              const loginRes = await api.login({
                email: session.user.email,
                password: hardcodedPassword,
              })

              const newToken = loginRes.access_token
              setToken(newToken)
              api.updateToken(newToken)

              const profile = await api.getUserProfile()
              setUser(profile)
            } catch (regError) {
              console.error('[AuthContext] Registration failed:', regError)
              await authClient.signOut()
              setUser(null)
              setToken(null)
              api.updateToken(null)
              router.push('/login?error=sync_failed')
            }
          }
        } catch (error) {
          console.error('[AuthContext] Auth sync error:', error)
          await authClient.signOut()
          setUser(null)
          setToken(null)
          api.updateToken(null)
          router.push('/login?error=sync_error')
        }
      }

      // Execute sync in background
      syncWithBackend().finally(() => {
        setIsLoading(false)
      })
    } else {
      setUser(null)
      api.updateToken(null)
      setIsLoading(false)
    }
  }, [session, isPending])

  const refreshUser = async () => {
    // 1. Force a session refresh (updates Better Auth session if possible)
    await authClient.getSession({
      fetchOptions: {
        headers: {
          'Cache-Control': 'no-cache',
        },
      },
    })

    // 2. Manually re-fetch backend profile to ensure we have the latest data
    // regardless of Better Auth session state
    if (token) {
      try {
        const profile = await api.getUserProfile()
        setUser(profile)
      } catch (e) {
        console.error('Failed to refresh backend user profile:', e)
      }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/usage',
      })

      if (error) {
        throw new Error(error.message || '登录失败')
      }

      // Session update will trigger useEffect
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name: username,
        callbackURL: '/dashboard',
      })

      if (error) {
        throw new Error(error.message || '注册失败')
      }

      // Session update will trigger useEffect
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  const oauthLogin = async (provider: 'google' | 'apple' | 'github', token: string) => {
    // Deprecated in favor of authClient.signIn.social direct call in components
    // But keeping for compatibility if needed
    console.warn('oauthLogin is deprecated, use authClient.signIn.social directly')
  }

  const logout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setUser(null)
            setToken(null)
            api.updateToken(null)
            router.push('/login')
          },
        },
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token, // Token might be null with Better Auth
        isLoading,
        login,
        register,
        logout,
        oauthLogin,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
