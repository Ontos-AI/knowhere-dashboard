"use client";

import { authQueryClient } from "@lib/auth-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const router = useRouter();
  const [queryClient] = useState(() => authQueryClient.create(router));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
