import { useEffect } from "react";

/**
 * Preload HTML files for iframe to improve performance
 * Uses <link rel="preload"> to fetch HTML files before they are needed
 */
export function usePreloadHtml(files: string[]) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const links: HTMLLinkElement[] = [];

    files.forEach((file) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "fetch";
      link.href = file;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
      links.push(link);
    });

    // Cleanup: remove preload links when component unmounts
    return () => {
      links.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [files]);
}
