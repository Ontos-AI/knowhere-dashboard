export const DEFAULT_STREAM_SETTINGS = {
  speed: 2.9,
  phase: 33.7,
  offsetX: -300,
  spacingX: 4.1,
  cellSize: 5,
  density: 0.9,
  opacity: 1.1,
  warp: 0.65,
  height: 1.2,
  paused: false,
};

export type StreamSettings = typeof DEFAULT_STREAM_SETTINGS;
