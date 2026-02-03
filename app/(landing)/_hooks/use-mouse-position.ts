"use client";

import { throttle } from "@app/(landing)/_lib/utils";
import { useEffect, useState } from "react";

/**
 * Hook to track mouse position
 */
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = throttle((e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    }, 50);

    window.addEventListener("mousemove", updatePosition);

    return () => window.removeEventListener("mousemove", updatePosition);
  }, []);

  return position;
}
