"use client";

import { useEffect, useRef } from "react";
import settings from "@/app/(auth)/_lib/fluid-gradient/cover-settings.json";
import type { MeshGradientRenderValues } from "@/app/(auth)/_lib/fluid-gradient/mesh-gradient-renderer";

export function FluidCover() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) {
      return;
    }

    let cancelled = false;
    let dispose = () => {};

    const color = getComputedStyle(canvas).color;
    const channels = color.match(/[\d.]+/g);
    if (!channels) {
      return;
    }

    const pigment = color.startsWith("color(srgb ")
      ? channels.slice(0, 3).map((channel) => Math.round(Number(channel) * 255))
      : channels.slice(0, 3);
    canvas.style.setProperty("--fluid-opacity", channels[3] ?? "1");

    import("@/app/(auth)/_lib/fluid-gradient/mesh-gradient-renderer")
      .then(({ createMeshGradientSurface }) => {
        if (cancelled) return;
        const surface = createMeshGradientSurface(canvas);
        const values = {
          ...settings,
          colors: [`rgb(${pigment.join(", ")})`],
        } as MeshGradientRenderValues;
        const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
        let frame = 0;
        let phase = 0.23;
        let previousTime = 0;
        let sizeKey = "";

        const draw = () => {
          surface.render(values, phase);
          if (canvas.dataset.ready !== "true") canvas.dataset.ready = "true";
        };
        const animate = (time: number) => {
          phase += Math.min((time - previousTime) / 1000, 0.05) * 0.03;
          previousTime = time;
          draw();
          frame = requestAnimationFrame(animate);
        };
        const sync = () => {
          cancelAnimationFrame(frame);
          const { width, height } = canvas.getBoundingClientRect();
          if (width <= 0 || height <= 0 || document.hidden) return;
          const ratio = Math.min(
            devicePixelRatio || 1,
            1.5,
            Math.sqrt(3_000_000 / (width * height))
          );
          const nextSizeKey = `${width}:${height}:${ratio}`;
          if (sizeKey !== nextSizeKey) {
            surface.resize(width, height, ratio);
            sizeKey = nextSizeKey;
          }
          draw();
          previousTime = performance.now();
          if (!reducedMotion.matches) frame = requestAnimationFrame(animate);
        };
        const observer = new ResizeObserver(sync);
        observer.observe(canvas);
        document.addEventListener("visibilitychange", sync);
        reducedMotion.addEventListener("change", sync);
        dispose = () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          document.removeEventListener("visibilitychange", sync);
          reducedMotion.removeEventListener("change", sync);
          surface.dispose();
        };
        sync();
      })
      .catch(() => {
        canvas.dataset.ready = "false";
      });

    return () => {
      cancelled = true;
      dispose();
    };
  }, []);

  return <canvas ref={ref} className="fluid-cover" />;
}
