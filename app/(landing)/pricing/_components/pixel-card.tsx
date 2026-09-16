"use client";

import { type ReactNode, useEffect, useRef } from "react";

class Pixel {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  color: string;
  speed: number;
  size: number;
  sizeStep: number;
  minSize: number;
  maxSizeInteger: number;
  maxSize: number;
  delay: number;
  counter: number;
  counterStep: number;
  isIdle: boolean;
  isReverse: boolean;
  isShimmer: boolean;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    speed: number,
    delay: number
  ) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = this.getRandomValue(0.1, 0.9) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.4;
    this.minSize = 0.5;
    this.maxSizeInteger = 2;
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  getRandomValue(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size);
  }

  appear() {
    this.isIdle = false;
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }
    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }
    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }
    if (this.isReverse) {
      this.size -= this.speed;
    } else {
      this.size += this.speed;
    }
  }
}

const getEffectiveSpeed = (value: number, reducedMotion: boolean) => {
  const min = 0;
  const max = 100;
  const throttle = 0.001;

  if (value <= min || reducedMotion) {
    return min;
  }
  if (value >= max) {
    return max * throttle;
  }
  return value * throttle;
};

const VARIANTS = {
  default: {
    gap: 5,
    speed: 35,
    colors: "#f8fafc,#f1f5f9,#cbd5e1",
    noFocus: false,
  },
  blue: {
    gap: 10,
    speed: 25,
    colors: "#e0f2fe,#7dd3fc,#0ea5e9",
    noFocus: false,
  },
  yellow: {
    gap: 3,
    speed: 20,
    colors: "#fef08a,#fde047,#eab308",
    noFocus: false,
  },
  pink: {
    gap: 6,
    speed: 80,
    colors: "#fecdd3,#fda4af,#e11d48",
    noFocus: true,
  },
} as const;

type PixelCardVariant = keyof typeof VARIANTS;

type PixelCardProps = {
  variant?: PixelCardVariant;
  gap?: number;
  speed?: number;
  colors?: string;
  noFocus?: boolean;
  className?: string;
  children: ReactNode;
};

// Adapted from React Bits PixelCard. MIT + Commons Clause. See react-bits-LICENSE.md.
export const PixelCard = ({
  variant = "default",
  gap,
  speed,
  colors,
  className = "",
  children,
}: PixelCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<number | null>(null);
  const timePreviousRef = useRef(0);
  const reducedMotionRef = useRef(false);

  const variantCfg = VARIANTS[variant];
  const finalGap = gap ?? variantCfg.gap;
  const finalSpeed = speed ?? variantCfg.speed;
  const finalColors = colors ?? variantCfg.colors;

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timePreviousRef.current = performance.now();

    const initPixels = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const colorsArray = finalColors.split(",");
      const pxs: Pixel[] = [];
      const gapSize = Number.parseInt(String(finalGap), 10);
      for (let x = 0; x < width; x += gapSize) {
        for (let y = 0; y < height; y += gapSize) {
          const color = colorsArray[Math.floor(Math.random() * colorsArray.length)] ?? "#fecdd3";
          const dx = x - width / 2;
          const dy = y - height / 2;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const delay = reducedMotionRef.current ? 0 : distance;
          pxs.push(
            new Pixel(
              canvas,
              ctx,
              x,
              y,
              color,
              getEffectiveSpeed(finalSpeed, reducedMotionRef.current),
              delay
            )
          );
        }
      }
      pixelsRef.current = pxs;
    };

    const doAnimate = (fnName: "appear") => {
      animationRef.current = requestAnimationFrame(() => doAnimate(fnName));
      const timeNow = performance.now();
      const timePassed = timeNow - timePreviousRef.current;
      const timeInterval = 1000 / 60;
      if (timePassed < timeInterval) return;
      timePreviousRef.current = timeNow - (timePassed % timeInterval);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let allIdle = true;
      for (const pixel of pixelsRef.current) {
        pixel[fnName]();
        if (!pixel.isIdle) allIdle = false;
      }
      if (allIdle && animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const handleAnimation = (name: "appear") => {
      if (reducedMotionRef.current) return;
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(() => doAnimate(name));
    };

    initPixels();
    handleAnimation("appear");
    const observer = new ResizeObserver(() => {
      initPixels();
    });
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [finalGap, finalSpeed, finalColors]);

  return (
    <div ref={containerRef} className={`pixel-card ${className}`.trim()}>
      <canvas className="pixel-canvas" ref={canvasRef} />
      {children}
    </div>
  );
};
