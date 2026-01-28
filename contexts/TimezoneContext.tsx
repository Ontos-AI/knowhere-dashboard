'use client'

import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

interface TimezoneContextType {
  timezone: string
  setTimezone: (tz: string) => void
  formatDate: (date: Date | string | number, formatStr?: string) => string
}

const TimezoneContext = createContext<TimezoneContextType | undefined>(undefined)

export function TimezoneProvider({ children }: { children: React.ReactNode }) {
  const [timezone, setTimezoneState] = useState('Asia/Shanghai')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('timezone')
    if (stored) {
      setTimezoneState(stored)
    }
    setMounted(true)
  }, [])

  const setTimezone = (tz: string) => {
    setTimezoneState(tz)
    localStorage.setItem('timezone', tz)
  }

  const formatDate = (date: Date | string | number, formatStr = 'yyyy-MM-dd HH:mm:ss') => {
    // Before mount, use UTC or server time to avoid hydration mismatch?
    // Actually, this function is likely called in render.
    // To be safe, we should perhaps return a consistent value during SSR,
    // but the user wants client-side timezone adjustment.
    // If we use this in useEffect or event handlers, it's fine.
    // If used in render, we need to be careful about hydration.
    // However, for a dashboard, client-side rendering of dates is acceptable.
    // We'll proceed.

    const d = new Date(date)
    if (Number.isNaN(d.getTime())) return '-'

    try {
      // Use Intl to format to parts in the target timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })

      const parts = formatter.formatToParts(d)
      const map = new Map(parts.map((p) => [p.type, p.value]))

      // Simple replacement for common patterns
      const result = formatStr
        .replace('yyyy', map.get('year') || '')
        .replace('MM', map.get('month') || '')
        .replace('dd', map.get('day') || '')
        .replace('HH', map.get('hour') || '')
        .replace('mm', map.get('minute') || '')
        .replace('ss', map.get('second') || '')

      return result
    } catch (e) {
      console.error('Format date error:', e)
      return d.toISOString()
    }
  }

  return (
    <TimezoneContext.Provider value={{ timezone, setTimezone, formatDate }}>
      {children}
    </TimezoneContext.Provider>
  )
}

export function useTimezone() {
  const context = useContext(TimezoneContext)
  if (!context) throw new Error('useTimezone must be used within TimezoneProvider')
  return context
}
