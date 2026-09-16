"use client";

import { useEffect, useRef } from "react";
import {
  DEFAULT_STREAM_SETTINGS,
  type StreamSettings,
} from "@/app/(auth)/_components/data-stream-settings";

const random = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 17) * 43758.5453;
  return value - Math.floor(value);
};
const noiseValues = Float32Array.from({ length: 4096 }, (_, index) => random(index));
const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const smoothstep = (start: number, end: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
};
const noise = (x: number, y: number) => {
  const column = Math.floor(x);
  const row = Math.floor(y);
  const u = smoothstep(0, 1, x - column);
  const v = smoothstep(0, 1, y - row);
  const at = (dx: number, dy: number) => noiseValues[((row + dy) & 63) * 64 + ((column + dx) & 63)];
  const top = at(0, 0) * (1 - u) + at(1, 0) * u;
  const bottom = at(0, 1) * (1 - u) + at(1, 1) * u;
  return top * (1 - v) + bottom * v;
};

export function DataStream() {
  const ref = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef<StreamSettings>({ ...DEFAULT_STREAM_SETTINGS });

  useEffect(() => {
    const canvasEl = ref.current;
    const context2d = canvasEl?.getContext("2d");
    if (!canvasEl || !context2d) return;
    const surface: HTMLCanvasElement = canvasEl;
    const gfx: CanvasRenderingContext2D = context2d;
    let width = 0;
    let height = 0;
    let color = "";
    let phase = settingsRef.current.phase * 0.22;
    let frame = 0;
    let previousTime = 0;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let points: { x: number; y: number; threshold: number; fade: number }[] = [];

    function draw() {
      gfx.clearRect(0, 0, width, height);
      gfx.fillStyle = color;
      const current = settingsRef.current;
      for (const point of points) {
        const u = (point.x - width / 2 - current.offsetX) / (96 * current.spacingX);
        const v = point.y / 96;
        const warpX = noise(u * 0.45 + phase * 0.25, v * 0.55 - phase * 0.3) * 2 - 1;
        const warpY = noise(u * 0.4 - phase * 0.15 + 19, v * 0.6 + phase * 0.35) * 2 - 1;
        const x = u - phase * 1.4 + warpX * 0.85 * current.warp;
        const y = v + warpY * 1.2 * current.warp;
        const field =
          noise(x, y) * 0.65 +
          noise(x * 2.8 + phase * 0.4, y * 2.8 - phase * 0.7) * 0.25 +
          noise(x * 7 - phase * 0.8, y * 7 + phase) * 0.1;
        const density = Math.min(1, smoothstep(0.18, 0.8, field) * current.density);
        const active = smoothstep(point.threshold - 0.12, point.threshold + 0.12, density);
        const size = (current.cellSize - 2) * active;
        gfx.globalAlpha = point.fade * active * (0.08 + density * 0.34) * current.opacity;
        gfx.fillRect(point.x + (current.cellSize - 2 - size) / 2, point.y, size, size);
      }
      gfx.globalAlpha = 1;
    }

    function animate(time: number) {
      phase += Math.min((time - previousTime) / 1000, 0.05) * 0.12 * settingsRef.current.speed;
      previousTime = time;
      draw();
      frame = requestAnimationFrame(animate);
    }

    function syncAnimation() {
      cancelAnimationFrame(frame);
      if (document.hidden || width <= 0 || height <= 0) return;
      draw();
      previousTime = performance.now();
      if (!reducedMotion.matches && !settingsRef.current.paused && settingsRef.current.speed > 0) {
        frame = requestAnimationFrame(animate);
      }
    }

    function resize() {
      const host = surface.parentElement ?? surface;
      const bounds = host.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      surface.width = Math.round(width * ratio);
      surface.height = Math.round(height * ratio);
      gfx.setTransform(ratio, 0, 0, ratio, 0, 0);
      color = getComputedStyle(host).color;
      points = [];
      const cell = settingsRef.current.cellSize;
      for (let row = 0; row <= Math.ceil(height / cell); row += 1) {
        const y = height - (cell - 2) - row * cell;
        for (let column = -1; column <= Math.ceil(width / cell); column += 1) {
          points.push({
            x: column * cell + 1,
            y,
            threshold: (bayer[(row & 3) * 4 + (column & 3)] + 0.5) / 16,
            fade: smoothstep(0, height * 0.85, y),
          });
        }
      }
      syncAnimation();
    }

    const observer = new ResizeObserver(resize);
    observer.observe(surface.parentElement ?? surface);
    document.addEventListener("visibilitychange", syncAnimation);
    reducedMotion.addEventListener("change", syncAnimation);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncAnimation);
      reducedMotion.removeEventListener("change", syncAnimation);
    };
  }, []);

  return (
    <div
      className="login-data-stream"
      aria-hidden="true"
      style={{
        height: `clamp(${96 * DEFAULT_STREAM_SETTINGS.height}px, ${18 * DEFAULT_STREAM_SETTINGS.height}svh, ${216 * DEFAULT_STREAM_SETTINGS.height}px)`,
      }}
    >
      <canvas ref={ref} />
    </div>
  );
}
