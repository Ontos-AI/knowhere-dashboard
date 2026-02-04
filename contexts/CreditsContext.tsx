"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

interface CreditsContextType {
  credits: number
  isLoading: boolean
  error: Error | null
  refreshCredits: () => Promise<void>
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined)

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [credits, setCredits] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCredits = useCallback(async () => {
    if (!user) {
      setCredits(0)
      setIsLoading(false)
      return
    }

    try {
      // Don't set loading to true on refresh to avoid UI flickering
      // Only initial load needs loading state if desired, or we can just update silently
      // But for initial load, isLoading is true by default.
      
      const data = await api.getCreditsBalance()
      setCredits(data.credits_balance)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch credits balance:', err)
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchCredits()
  }, [fetchCredits])

  return (
    <CreditsContext.Provider value={{ credits, isLoading, error, refreshCredits: fetchCredits }}>
      {children}
    </CreditsContext.Provider>
  )
}

export function useCredits() {
  const context = useContext(CreditsContext)
  if (!context) {
    throw new Error('useCredits must be used within a CreditsProvider')
  }
  return context
}
