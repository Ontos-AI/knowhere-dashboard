"use client";

import { useTimezoneStore } from "@store/timezone-store";
import { useEffect, useState } from "react";

/**
 * Hook to safely use timezone store after hydration
 * This prevents hydration mismatch errors in Next.js SSR
 */
export function useTimezone() {
  const timezone = useTimezoneStore((state) => state.timezone);
  const setTimezone = useTimezoneStore((state) => state.setTimezone);
  const formatDate = useTimezoneStore((state) => state.formatDate);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    timezone: mounted ? timezone : "Asia/Shanghai", // Use default until hydrated
    setTimezone,
    formatDate,
    mounted,
  };
}
