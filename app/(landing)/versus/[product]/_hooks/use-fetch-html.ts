import { useCallback, useEffect, useState } from "react";

type UseFetchHtmlReturn = {
  html: string | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

// Simple in-memory cache for fetched HTML content
const htmlCache = new Map<string, string>();

export function useFetchHtml(url: string | null): UseFetchHtmlReturn {
  const [html, setHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchHtml = useCallback(async () => {
    if (!url) {
      return;
    }

    // Check cache first
    const cachedHtml = htmlCache.get(url);
    if (cachedHtml) {
      setHtml(cachedHtml);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch HTML: ${response.statusText}`);
      }

      const htmlContent = await response.text();

      // Cache the content
      htmlCache.set(url, htmlContent);

      setHtml(htmlContent);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error occurred"));
      setHtml(null);
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  // Fetch on mount or when URL changes
  useEffect(() => {
    if (url) {
      fetchHtml();
    } else {
      // Reset state when URL is null
      setHtml(null);
      setIsLoading(false);
      setError(null);
    }
  }, [url, fetchHtml]);

  return {
    html,
    isLoading,
    error,
    refetch: fetchHtml,
  };
}
