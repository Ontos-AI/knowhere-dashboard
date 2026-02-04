"use client";

import { Toaster } from "@components/ui/sonner";
import { QueryProvider } from "@providers/query-provider";
import { TimezoneSync } from "@providers/timezone-sync";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export function Providers({ children }: { children: React.ReactNode }) {
  const content = (
    <NuqsAdapter>
      <QueryProvider>
        <TimezoneSync />
        {children}
        <Toaster />
      </QueryProvider>
    </NuqsAdapter>
  );

  return content;
}
