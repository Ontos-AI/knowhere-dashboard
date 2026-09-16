(() => {
  const SELECTOR = 'canvas[data-animation="converging-helix"]';
  const TAU = Math.PI * 2;
  const LOOP_MS = 8400;
  const SHARED_EPOCH = performance.now();
  const instances = new WeakMap();
  const defaults = {
    accent: "#fff",
    amplitude: 0.52,
    amplitudeSpread: 0.15,
    background: "transparent",
    centerGap: 120,
    compression: 1.22,
    dashGap: 8,
    dashLength: 5,
    decay: 1.05,
    horizontalSpan: 1,
    lineWidth: 1,
    mirror: false,
    opacity: 0.86,
    phaseSpan: 4.8,
    rotation: [0, 0.01, 0],
    scale: 1,
    showDataSquares: true,
    squareAccent: "#fff",
    squareCount: 4,
    squareSize: 12,
    speed: 1,
    strands: 7,
    turnSpread: 0.42,
    turns: 2.25,
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function rotate3D(point, rotation) {
    let [x, y, z] = point;
    const [rx, ry, rz] = rotation;
    let cosine = Math.cos(rx);
    let sine = Math.sin(rx);
    [y, z] = [y * cosine - z * sine, y * sine + z * cosine];
    cosine = Math.cos(ry);
    sine = Math.sin(ry);
    [x, z] = [x * cosine + z * sine, -x * sine + z * cosine];
    cosine = Math.cos(rz);
    sine = Math.sin(rz);
    return [x * cosine - y * sine, x * sine + y * cosine, z];
  }

  class ConvergingHelixAnimation {
    constructor(canvas) {
      this.canvas = canvas;
      this.context = canvas.getContext("2d");
      if (!this.context) return;
      this.options = { ...defaults, rotation: [...defaults.rotation] };
      this.motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      this.reducedMotion = this.motionQuery.matches;
      this.abortController = new AbortController();
      this.frame = 0;
      this.visible = false;
      this.width = 1;
      this.height = 1;
      this.introElapsed = 1000;
      this.lastFrameAt = null;

      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          this.visible = entries[0]?.isIntersecting ?? this.intersectsViewport();
          this.visible ? this.start() : this.stop();
        },
        { rootMargin: "20% 0px" }
      );
      this.motionQuery.addEventListener(
        "change",
        (event) => {
          this.reducedMotion = event.matches;
          this.restart();
        },
        { signal: this.abortController.signal }
      );
      document.addEventListener(
        "visibilitychange",
        () => {
          document.hidden ? this.stop() : this.start();
        },
        { signal: this.abortController.signal }
      );
      window.addEventListener("scroll", () => this.syncVisibility(), {
        signal: this.abortController.signal,
        passive: true,
      });
      window.addEventListener("hashchange", () => this.syncVisibility(), {
        signal: this.abortController.signal,
      });
      this.resizeObserver.observe(canvas);
      this.intersectionObserver.observe(canvas);
      this.resize();
      this.syncVisibility();
      canvas.dataset.animationReady = "true";
      canvas.dataset.animationState = "paused";
    }

    elapsed(now = performance.now()) {
      return Math.max(0, now - SHARED_EPOCH) * this.options.speed;
    }

    point(strand, progress, rotationPhase) {
      const {
        amplitude,
        amplitudeSpread,
        compression,
        decay,
        mirror,
        phaseSpan,
        rotation,
        strands,
        turnSpread,
        turns,
      } = this.options;
      const normalized = strands === 1 ? 0 : (strand / (strands - 1)) * 2 - 1;
      const strandPhase = normalized * phaseSpan * 0.5;
      const strandTurns = turns + normalized * turnSpread;
      const strandAmplitude = amplitude * (1 + Math.abs(normalized) * amplitudeSpread);
      const compressed = 1 - (1 - progress) ** compression;
      const sourceX = -1 + 1.2 * compressed;
      const radius = strandAmplitude * (1 - progress) ** decay;
      const angle = TAU * strandTurns * progress + strandPhase - rotationPhase;
      const [rotatedX, rotatedY, rotatedZ] = rotate3D(
        [sourceX, radius * Math.cos(angle), radius * Math.sin(angle)],
        rotation
      );
      const perspective = 1 + rotatedZ * 0.03;
      return [(mirror ? -rotatedX : rotatedX) * perspective, rotatedY * perspective];
    }

    map([x, y]) {
      const verticalPadding = Math.min(this.width, this.height) * 0.08;
      const availableHeight = this.height - verticalPadding * 2;
      const center = this.width * 0.5;
      const start = center - center * this.options.horizontalSpan;
      const convergence = center - this.options.centerGap * 0.5;
      const sourceX = this.options.mirror ? -x : x;
      const horizontalProgress = (sourceX + 1) / 1.2;
      const mappedX = start + horizontalProgress * (convergence - start);
      return [
        this.options.mirror ? this.width - mappedX : mappedX,
        this.height * 0.5 + ((y * availableHeight) / 1.3) * this.options.scale,
      ];
    }

    drawPath(points, reveal, elapsed) {
      if (reveal <= 0) return;
      const finalIndex = Math.max(1, Math.ceil((points.length - 1) * reveal));
      const context = this.context;
      context.beginPath();
      context.moveTo(...this.map(points[0]));
      for (let index = 1; index <= finalIndex; index += 1)
        context.lineTo(...this.map(points[index]));
      context.lineWidth = this.options.lineWidth;
      context.lineCap = "round";
      context.strokeStyle = this.options.accent;
      context.globalAlpha = this.options.opacity;
      context.setLineDash([this.options.dashLength, this.options.dashGap]);
      context.lineDashOffset = this.reducedMotion
        ? 0
        : (-(elapsed % LOOP_MS) / LOOP_MS) * (this.options.dashLength + this.options.dashGap) * 8;
      context.stroke();
    }

    drawDataSquares(rotationPhase, elapsed) {
      if (!this.options.showDataSquares) return;
      const context = this.context;
      const squareCount = 4;
      const size = this.options.squareSize ?? 12;
      const phases = this.options.mirror
        ? (this.options.squarePhases ?? [0.06, 0.2, 0.34, 0.5])
        : (this.options.squarePhases ?? [0.0, 0.13, 0.27, 0.42]);
      const lastStrand = Math.max(0, this.options.strands - 1);
      const strands =
        this.options.squareStrands ??
        (this.options.mirror
          ? [lastStrand, Math.round((lastStrand * 1) / 3), Math.round((lastStrand * 2) / 3), 0]
          : [0, Math.round((lastStrand * 1) / 3), Math.round((lastStrand * 2) / 3), lastStrand]);
      const loop = this.reducedMotion ? 0 : (elapsed / LOOP_MS) % 1;
      const squares = [];
      for (let index = 0; index < squareCount; index += 1) {
        let progress = (loop + phases[index]) % 1;
        const strand = strands[index];
        let [x, y] = this.map(this.point(strand, progress, rotationPhase));
        for (let attempt = 0; attempt < 3; attempt += 1) {
          const stacked = squares.some((other) => {
            const dx = other.x - x;
            const dy = other.y - y;
            return dx * dx + dy * dy < 28 * 28;
          });
          if (!stacked) break;
          progress = (progress + 0.07) % 1;
          [x, y] = this.map(this.point(strand, progress, rotationPhase));
        }
        squares.push({ progress, strand, x, y });
      }
      context.setLineDash([]);
      context.lineDashOffset = 0;
      context.fillStyle = this.options.squareAccent;
      for (const square of squares) {
        const fade = Math.max(0, 1 - square.progress / 0.66);
        if (fade < 0.08) continue;
        context.globalAlpha = fade;
        context.fillRect(square.x - size / 2, square.y - size / 2, size, size);
      }
    }

    render(now = performance.now()) {
      const context = this.context;
      const elapsed = this.reducedMotion ? 0 : this.elapsed(now);
      context.clearRect(0, 0, this.width, this.height);
      if (this.options.background !== "transparent") {
        context.globalAlpha = 1;
        context.fillStyle = this.options.background;
        context.fillRect(0, 0, this.width, this.height);
      }
      const rotationPhase = this.reducedMotion ? 0 : ((elapsed % LOOP_MS) / LOOP_MS) * TAU;
      for (let strand = 0; strand < this.options.strands; strand += 1) {
        const points = [];
        for (let segment = 0; segment <= 260; segment += 1)
          points.push(this.point(strand, segment / 260, rotationPhase));
        const reveal =
          this.reducedMotion || !this.visible
            ? 1
            : clamp((this.introElapsed - strand * 45) / 760, 0, 1);
        this.drawPath(points, 1 - (1 - reveal) ** 3, elapsed);
      }
      this.drawDataSquares(rotationPhase, elapsed);
      context.globalAlpha = 1;
      context.setLineDash([]);
      context.lineDashOffset = 0;
      this.canvas.dataset.animationPhase = String(Math.round(elapsed % LOOP_MS));
    }

    tick = (now) => {
      this.frame = 0;
      if (!this.visible || document.hidden || this.reducedMotion) return;
      const delta = this.lastFrameAt === null ? 0 : Math.min(64, now - this.lastFrameAt);
      this.lastFrameAt = now;
      this.introElapsed += delta;
      this.render(now);
      this.frame = requestAnimationFrame(this.tick);
    };

    intersectsViewport() {
      const bounds = this.canvas.getBoundingClientRect();
      if (bounds.width < 2 || bounds.height < 2) return false;
      return (
        bounds.bottom > 0 &&
        bounds.top < window.innerHeight &&
        bounds.right > 0 &&
        bounds.left < window.innerWidth
      );
    }

    syncVisibility() {
      const next = this.intersectsViewport();
      if (next === this.visible) {
        if (next) this.start();
        else this.render();
        return;
      }
      this.visible = next;
      next ? this.start() : this.stop();
      if (!next) this.render();
    }

    resize() {
      const bounds = this.canvas.getBoundingClientRect();
      if (bounds.width < 2 || bounds.height < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = bounds.width;
      this.height = bounds.height;
      this.canvas.width = Math.round(this.width * dpr);
      this.canvas.height = Math.round(this.height * dpr);
      this.context.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.syncVisibility();
      this.render();
    }

    setOptions(options = {}) {
      const numeric = {
        amplitude: [0.05, 1.5],
        centerGap: [0, 320],
        compression: [0.2, 4],
        dashGap: [0.5, 40],
        dashLength: [0.5, 40],
        decay: [0.2, 4],
        horizontalSpan: [0.5, 1.3],
        lineWidth: [0.25, 8],
        opacity: [0, 1],
        scale: [0.5, 1.5],
        speed: [0, 4],
        squareCount: [1, 16],
        squareSize: [1, 32],
        strands: [1, 16],
        turns: [0.25, 8],
      };
      Object.entries(numeric).forEach(([key, range]) => {
        const value = Number(options[key]);
        if (Number.isFinite(value))
          this.options[key] =
            key === "strands"
              ? Math.round(clamp(value, range[0], range[1]))
              : clamp(value, range[0], range[1]);
      });
      if (typeof options.accent === "string" && options.accent)
        this.options.accent = options.accent;
      if (typeof options.background === "string" && options.background)
        this.options.background = options.background;
      if (typeof options.squareAccent === "string" && options.squareAccent)
        this.options.squareAccent = options.squareAccent;
      if (typeof options.mirror === "boolean") this.options.mirror = options.mirror;
      if (typeof options.showDataSquares === "boolean")
        this.options.showDataSquares = options.showDataSquares;
      if (
        Array.isArray(options.rotation) &&
        options.rotation.length === 3 &&
        options.rotation.every(Number.isFinite)
      ) {
        this.options.rotation = options.rotation.map(Number);
      }
      this.render();
    }

    restart() {
      this.stop();
      this.introElapsed = 1000;
      this.lastFrameAt = null;
      this.render();
      this.start();
    }

    start() {
      if (!this.context || !this.visible || document.hidden) return;
      if (this.reducedMotion) {
        this.canvas.dataset.animationState = "reduced";
        this.render();
        return;
      }
      this.canvas.dataset.animationState = "running";
      if (!this.frame) this.frame = requestAnimationFrame(this.tick);
    }

    stop() {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.lastFrameAt = null;
      if (this.context) this.canvas.dataset.animationState = "paused";
    }

    destroy() {
      this.stop();
      this.abortController.abort();
      this.resizeObserver.disconnect();
      this.intersectionObserver.disconnect();
      instances.delete(this.canvas);
      delete this.canvas.__convergingHelixAnimation;
      delete this.canvas.dataset.animationReady;
      delete this.canvas.dataset.animationState;
      delete this.canvas.dataset.animationPhase;
    }
  }

  function initialize(canvas) {
    const canvases = canvas ? [canvas] : document.querySelectorAll(SELECTOR);
    canvases.forEach((item) => {
      if (instances.has(item)) return;
      const instance = new ConvergingHelixAnimation(item);
      if (!instance.context) return;
      instances.set(item, instance);
      item.__convergingHelixAnimation = instance;
    });
  }

  function destroy(canvas) {
    instances.get(canvas)?.destroy();
  }

  window.__convergingHelixAnimations = { destroy, initialize };
})();
