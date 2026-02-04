"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";

type LenisProviderProps = {
  children: React.ReactNode;
};

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with autoRaf option
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      autoRaf: true, // Automatically handles requestAnimationFrame
    });

    // Cleanup on unmount
    return () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []); // Empty dependency array - only initialize once

  return <>{children}</>;
}
