"use client";

import { throttle } from "@app/_(landing)/_lib/utils";
import { useEffect, useState } from "react";

/**
 * Hook to track mouse position
 */
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updatePosition = throttle(handleMouseMove, 50);

    window.addEventListener("mousemove", updatePosition);

    return () => window.removeEventListener("mousemove", updatePosition);
  }, []);

  return position;
}
