export const ERROR_DIFFUSION_PATTERNS = ["floyd-steinberg"] as const;

export type ErrorDiffusionPattern = (typeof ERROR_DIFFUSION_PATTERNS)[number];

type DiffusionTap = Readonly<{
  dx: number;
  dy: number;
  weight: number;
}>;

const kernels: Readonly<Record<ErrorDiffusionPattern, readonly DiffusionTap[]>> = {
  "floyd-steinberg": [
    { dx: 1, dy: 0, weight: 7 / 16 },
    { dx: -1, dy: 1, weight: 3 / 16 },
    { dx: 0, dy: 1, weight: 5 / 16 },
    { dx: 1, dy: 1, weight: 1 / 16 },
  ],
};

function clampByte(value: number): number {
  return Math.min(255, Math.max(0, value));
}

function fract(value: number): number {
  return value - Math.floor(value);
}

function blueNoiseThreshold(x: number, y: number): number {
  return fract(52.9829189 * fract(x * 0.06711056 + y * 0.00583715));
}

function edgeJitterSignal(x: number, y: number, phase: number): number {
  const phaseRadians = phase * Math.PI * 2;
  const firstPhase = blueNoiseThreshold(x, y) * Math.PI * 2;
  const secondPhase = blueNoiseThreshold(y + 19.37, x + 19.37) * Math.PI * 2;
  return (Math.sin(phaseRadians + firstPhase) + Math.cos(phaseRadians + secondPhase)) * 0.5;
}

export function isErrorDiffusionPattern(value: string): value is ErrorDiffusionPattern {
  return ERROR_DIFFUSION_PATTERNS.includes(value as ErrorDiffusionPattern);
}

export function applyErrorDiffusion(
  source: Uint8Array,
  width: number,
  height: number,
  pattern: ErrorDiffusionPattern,
  spread: number,
  destination = new Uint8Array(source.length),
  working = new Float32Array(source.length),
  edgeJitter = 0,
  phase = 0
): Uint8Array {
  if (destination.length !== source.length || working.length !== source.length) {
    throw new Error("Error diffusion buffers must match the source length.");
  }

  working.set(source);
  destination.set(source);
  const safeSpread = Math.min(2, Math.max(0, spread));
  const safeEdgeJitter = Math.min(1, Math.max(0, edgeJitter));
  const kernel = kernels[pattern];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixelIndex = (y * width + x) * 4;
      const threshold = Math.min(
        0.98,
        Math.max(0.02, 0.5 + edgeJitterSignal(x, y, phase) * safeEdgeJitter * 0.45)
      );
      const alphaIndex = pixelIndex + 3;
      const oldAlpha = clampByte(working[alphaIndex] ?? 0);
      const quantizedAlpha = oldAlpha / 255 >= threshold ? 255 : 0;
      destination[alphaIndex] = quantizedAlpha;
      const error = (oldAlpha - quantizedAlpha) * safeSpread;

      for (const tap of kernel) {
        const targetX = x + tap.dx;
        const targetY = y + tap.dy;
        if (targetX < 0 || targetX >= width || targetY < 0 || targetY >= height) {
          continue;
        }
        const targetIndex = (targetY * width + targetX) * 4 + 3;
        working[targetIndex] = (working[targetIndex] ?? 0) + error * tap.weight;
      }
    }
  }

  return destination;
}
