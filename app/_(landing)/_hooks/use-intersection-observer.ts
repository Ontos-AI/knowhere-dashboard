"use client";

import { useEffect, useRef, useState } from "react";

type IntersectionOptions = {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
};

/**
 * Hook to detect when element enters viewport
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  options: IntersectionOptions = {}
) {
  const { threshold = 0.1, root = null, rootMargin = "0px", triggerOnce = false } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If triggerOnce and has already intersected, don't observe
    if (triggerOnce && hasIntersected) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);

        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }

        // If triggerOnce and element is intersecting, unobserve
        if (triggerOnce && isElementIntersecting) {
          observer.unobserve(element);
        }
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, root, rootMargin, triggerOnce, hasIntersected]);

  return { ref, isIntersecting, hasIntersected };
}
