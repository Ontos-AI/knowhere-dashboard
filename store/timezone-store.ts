"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TimezoneStore = {
  timezone: string;
  mounted: boolean;

  // Actions
  setTimezone: (timezone: string) => void;
  setMounted: (mounted: boolean) => void;
  formatDate: (params: { date: Date | string | number; formatStr?: string }) => string;
};

export const useTimezoneStore = create<TimezoneStore>()(
  persist(
    (set, get) => ({
      timezone: "Asia/Shanghai",
      mounted: false,

      setTimezone: (timezone) => set({ timezone }),
      setMounted: (mounted) => set({ mounted }),

      formatDate: ({
        date,
        formatStr = "yyyy-MM-dd HH:mm:ss",
      }: {
        date: Date | string | number;
        formatStr?: string;
      }) => {
        const d = new Date(date);
        if (Number.isNaN(d.getTime())) return "-";

        const { timezone } = get();

        try {
          // Use Intl to format to parts in the target timezone
          const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: timezone,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });

          const parts = formatter.formatToParts(d);
          const map = new Map(parts.map((p) => [p.type, p.value]));

          // Simple replacement for common patterns
          const result = formatStr
            .replace("yyyy", map.get("year") || "")
            .replace("MM", map.get("month") || "")
            .replace("dd", map.get("day") || "")
            .replace("HH", map.get("hour") || "")
            .replace("mm", map.get("minute") || "")
            .replace("ss", map.get("second") || "");

          return result;
        } catch (e) {
          console.error("Format date error:", e);
          return d.toISOString();
        }
      },
    }),
    {
      name: "timezone-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
