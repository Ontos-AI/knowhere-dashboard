'use client'

import { useEffect } from 'react'
import { useTimezoneStore } from '@store/timezone-store'

/**
 * TimezoneSync component handles client-side timezone initialization
 * This component should be rendered once at the root level
 */
export function TimezoneSync() {
  const setMounted = useTimezoneStore((state) => state.setMounted)

  useEffect(() => {
    setMounted(true)
  }, [setMounted])

  // This component doesn't render anything
  return null
}
