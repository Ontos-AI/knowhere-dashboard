(() => {
  const SELECTOR = 'canvas[data-animation="catenoid-field"]';
  const TAU = Math.PI * 2;
  const PATH_REVEAL_MS = 800;
  const PATH_STAGGER_MS = 40;
  const RING_CYCLE_MS = 5600;
  const RING_ORANGE_PROGRESS = 0.2;
  const RING_COLOR_TRANSITION_END_PROGRESS = 0.36;
  const DATA_PULSE_DELAY_MS = 900;
  const POINTER_EASE = 0.055;
  const DEFAULT_COLORS = {
    accent: "#19A88B",
    secondary: "#19A88B",
    background: "#FFFFFF",
  };

  function clamp(value, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value));
  }

  function easeInOut(value) {
    return -(Math.cos(Math.PI * clamp(value)) - 1) / 2;
  }

  function rgba(hex, alpha) {
    const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16));
    return `rgba(${channels[0]}, ${channels[1]}, ${channels[2]}, ${alpha})`;
  }

  function mixHex(from, to, amount) {
    const fromChannels = [1, 3, 5].map((index) => parseInt(from.slice(index, index + 2), 16));
    const toChannels = [1, 3, 5].map((index) => parseInt(to.slice(index, index + 2), 16));
    const progress = clamp(amount);
    const channels = fromChannels.map((channel, index) =>
      Math.round(channel + (toChannels[index] - channel) * progress)
    );
    return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
  }

  function seededRandom(seed) {
    let state = seed >>> 0;
    return () => {
      state += 0x6d2b79f5;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
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
    [x, y] = [x * cosine - y * sine, x * sine + y * cosine];
    return [x, y, z];
  }

  class CatenoidFieldAnimation {
    constructor(canvas) {
      this.canvas = canvas;
      this.context = canvas.getContext("2d");
      if (!this.context) return;

      this.preview = canvas.closest(".preview");
      this.workspace = canvas.closest(".workbench") || this.preview;
      this.motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      this.reduceMotion = this.motionQuery.matches;
      this.finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      this.abortController = new AbortController();
      this.width = 1;
      this.height = 1;
      this.frame = 0;
      this.viewRotation = null;
      this.visible = false;
      this.introStart = null;
      this.lastFrameTime = null;
      this.autoYaw = 0;
      this.cycleElapsed = 0;
      this.rotation = { pitch: 0, yaw: 0, targetPitch: 0, targetYaw: 0 };
      this.settings = {
        autoRotate: true,
        pointerFollow: true,
        rotationSpeed: 1,
        cycleSpeed: 1,
        fieldOffsetX: 0,
        fieldOffsetY: 0,
        fieldScale: 1,
      };
      this.colors = { ...DEFAULT_COLORS };
      this.paths = this.createPaths();
      this.dataPulses = this.createDataPulses();

      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries[0].isIntersecting;
          this.visible = visible;
          if (visible && this.introStart === null) {
            this.introStart = performance.now();
            this.render(this.introStart);
          }
          visible ? this.start() : this.stop();
        },
        { threshold: 0 }
      );

      this.bindEvents();
      this.resizeObserver.observe(this.canvas);
      this.intersectionObserver.observe(this.canvas);
      this.resize();
      this.preview?.classList.add("is-animated");
      this.canvas.dataset.animationReady = "true";
    }

    createPaths() {
      const rings = Array.from({ length: 12 }, (_, index) =>
        index === 0 || index === 11
          ? { type: "ring", fixedV: index === 0 ? -1 : 1, segments: 120 }
          : { type: "ring", phase: (index - 0.5) / 10, segments: 120 }
      );
      const meridians = Array.from({ length: 17 }, (_, index) => ({
        type: "meridian",
        u: (index / 17) * TAU,
        segments: 90,
      }));
      return [...rings, ...meridians];
    }

    createDataPulses() {
      const random = seededRandom(1201);
      return Array.from({ length: 8 }, (_, index) => ({
        index,
        period: 2300 + Math.round(random() * 1200),
        visibleFor: 280 + Math.round(random() * 180),
        offset: Math.round(random() * 1500),
        activation: -1,
        position: null,
      }));
    }

    bindEvents() {
      const { signal } = this.abortController;
      this.workspace?.querySelectorAll("[data-animation-setting]").forEach((input) => {
        const updateSetting = () => {
          const setting = input.dataset.animationSetting;
          this.settings[setting] =
            input.type === "checkbox" ? input.checked : Number(input.value) / 100;
          if (setting === "pointerFollow" && !this.settings.pointerFollow) {
            this.rotation.targetPitch = 0;
            this.rotation.targetYaw = 0;
          }
          const output = input.closest(".animation-setting")?.querySelector("output");
          if (output) output.value = `${this.settings[setting].toFixed(1)}×`;
        };
        if (this.reduceMotion) input.disabled = true;
        input.addEventListener("input", updateSetting, { signal });
        updateSetting();
      });
      this.motionQuery.addEventListener(
        "change",
        (event) => {
          this.reduceMotion = event.matches;
          this.workspace?.querySelectorAll("[data-animation-setting]").forEach((input) => {
            input.disabled = event.matches;
          });
          this.restart();
        },
        { signal }
      );
      if (this.finePointer && !this.reduceMotion) {
        this.canvas.addEventListener(
          "pointermove",
          (event) => {
            const bounds = this.canvas.getBoundingClientRect();
            if (this.settings.pointerFollow) {
              this.rotation.targetYaw = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.55;
              this.rotation.targetPitch =
                ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.3;
            }
          },
          { signal }
        );
        this.canvas.addEventListener(
          "pointerleave",
          () => {
            this.rotation.targetYaw = 0;
            this.rotation.targetPitch = 0;
          },
          { signal }
        );
      }
      document.addEventListener(
        "visibilitychange",
        () => {
          document.hidden ? this.stop() : this.start();
        },
        { signal }
      );
      window.addEventListener("pagehide", () => this.stop(), { once: true, signal });
    }

    profileRadius(v) {
      const magnitude = Math.abs(v);
      const normalized = (Math.cosh(1.9 * magnitude) - 1) / (Math.cosh(1.9) - 1);
      return 0.11 + (0.94 - 0.11) * normalized;
    }

    surfacePoint(u, v) {
      const radius = this.profileRadius(v);
      const point = [radius * Math.cos(u), 1.08 * v, radius * Math.sin(u)];
      const rotation = this.viewRotation ?? [
        0.36 + this.rotation.pitch,
        this.autoYaw + this.rotation.yaw,
        0,
      ];
      const [x, y, z] = rotate3D(point, rotation);
      const perspective = 1 + z * 0.1;
      const scale = Math.min(this.width, this.height) * 0.29 * this.settings.fieldScale;
      return {
        x: this.width * (0.5 + this.settings.fieldOffsetX / 100) + x * perspective * scale,
        y: this.height * (0.5 + this.settings.fieldOffsetY / 100) - 16 + y * perspective * scale,
        z,
      };
    }

    ringProgress(path) {
      return this.reduceMotion ? path.phase : (path.phase + this.cycleElapsed / RING_CYCLE_MS) % 1;
    }

    ringV(path, progress) {
      return path.fixedV ?? -0.9 + progress * 1.8;
    }

    samplePath(path, ringProgress) {
      const points = [];
      for (let index = 0; index <= path.segments; index += 1) {
        const progress = index / path.segments;
        points.push(
          path.type === "ring"
            ? this.surfacePoint(progress * TAU, this.ringV(path, ringProgress))
            : this.surfacePoint(path.u, -1 + progress * 2)
        );
      }
      return points;
    }

    pathReveal(index, now) {
      if (this.reduceMotion || this.introStart === null) return 1;
      return easeInOut((now - this.introStart - index * PATH_STAGGER_MS) / PATH_REVEAL_MS);
    }

    drawPath(points, reveal, opacity, lineWidth, color) {
      if (reveal <= 0) return;
      const context = this.context;
      const finalIndex = Math.max(1, Math.ceil((points.length - 1) * reveal));
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      for (let index = 1; index <= finalIndex; index += 1) {
        context.lineTo(points[index].x, points[index].y);
      }
      context.lineWidth = lineWidth;
      context.strokeStyle = rgba(color, opacity);
      context.stroke();
    }

    samplePulsePosition(pulse, activation) {
      const random = seededRandom(1201 + pulse.index * 4099 + activation * 7919);
      const rings = this.paths.filter((path) => path.type === "ring" && path.fixedV === undefined);
      const ring = rings[Math.floor(random() * rings.length)];
      const meridian = Math.floor(random() * 17);
      const progress = this.ringProgress(ring);
      const v = this.ringV(ring, progress);
      return {
        ...this.surfacePoint((meridian / 17) * TAU, v),
        size: [14, 16, 18][Math.floor(random() * 3)] * this.settings.fieldScale * 0.5,
      };
    }

    drawDataPulses(now) {
      if (
        this.reduceMotion ||
        this.introStart === null ||
        now - this.introStart < DATA_PULSE_DELAY_MS
      )
        return;
      const context = this.context;
      context.save();
      context.fillStyle = this.colors.secondary;
      this.dataPulses.forEach((pulse) => {
        const elapsed = this.cycleElapsed + pulse.offset;
        const activation = Math.floor(elapsed / pulse.period);
        if (elapsed % pulse.period >= pulse.visibleFor) return;
        if (pulse.activation !== activation || !pulse.position) {
          pulse.activation = activation;
          pulse.position = this.samplePulsePosition(pulse, activation);
        }
        const { x, y, size } = pulse.position;
        context.fillRect(x - size / 2, y - size / 2, size, size);
      });
      context.restore();
    }

    render(now = performance.now()) {
      const context = this.context;
      context.clearRect(0, 0, this.width, this.height);
      context.fillStyle = this.colors.background;
      context.fillRect(0, 0, this.width, this.height);

      const sampledPaths = this.paths
        .map((path, index) => {
          const movingRing = path.type === "ring" && path.fixedV === undefined;
          const progress = movingRing ? this.ringProgress(path) : 0;
          const points = this.samplePath(path, progress);
          const averageDepth = points.reduce((sum, point) => sum + point.z, 0) / points.length;
          const edgeFade = Math.min(clamp(progress / 0.08), clamp((1 - progress) / 0.08));
          const edgeOpacity = movingRing ? 0.35 + edgeFade * 0.65 : 1;
          return {
            path,
            points,
            index,
            movingRing,
            progress,
            averageDepth,
            edgeOpacity,
            reveal: this.pathReveal(index, now),
          };
        })
        .sort((a, b) => a.averageDepth - b.averageDepth);

      sampledPaths.forEach((item) => {
        const isRing = item.path.type === "ring";
        const colorTransition = easeInOut(
          (item.progress - RING_ORANGE_PROGRESS) /
            (RING_COLOR_TRANSITION_END_PROGRESS - RING_ORANGE_PROGRESS)
        );
        const color =
          item.movingRing && !this.reduceMotion
            ? mixHex(this.colors.secondary, this.colors.accent, colorTransition)
            : this.colors.accent;
        const depthOpacity = isRing
          ? clamp(0.68 + (item.averageDepth + 1) * 0.14, 0.62, 0.96)
          : clamp(0.2 + (item.averageDepth + 1) * 0.12, 0.18, 0.46);
        this.drawPath(
          item.points,
          item.reveal,
          depthOpacity * item.edgeOpacity,
          isRing ? 1.15 : 0.85,
          color
        );
      });
      this.drawDataPulses(now);
    }

    tick = (now) => {
      this.frame = 0;
      if (!this.visible || document.hidden || this.reduceMotion) return;
      const delta = this.lastFrameTime === null ? 0 : Math.min(now - this.lastFrameTime, 64);
      this.lastFrameTime = now;
      if (this.settings.autoRotate) {
        this.autoYaw += delta * 0.00008 * this.settings.rotationSpeed;
      }
      this.cycleElapsed += delta * this.settings.cycleSpeed;
      this.rotation.pitch += (this.rotation.targetPitch - this.rotation.pitch) * POINTER_EASE;
      this.rotation.yaw += (this.rotation.targetYaw - this.rotation.yaw) * POINTER_EASE;
      this.render(now);
      this.frame = requestAnimationFrame(this.tick);
    };

    resize() {
      const bounds = this.canvas.getBoundingClientRect();
      if (bounds.width < 2 || bounds.height < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = bounds.width;
      this.height = bounds.height;
      this.canvas.width = Math.round(this.width * dpr);
      this.canvas.height = Math.round(this.height * dpr);
      this.context.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.dataPulses.forEach((pulse) => {
        pulse.activation = -1;
        pulse.position = null;
      });
      this.render();
    }

    restart() {
      if (!this.context) return;
      this.stop();
      const now = performance.now();
      this.introStart = this.visible ? now : null;
      this.autoYaw = 0;
      this.cycleElapsed = 0;
      this.rotation = { pitch: 0, yaw: 0, targetPitch: 0, targetYaw: 0 };
      this.dataPulses.forEach((pulse) => {
        pulse.activation = -1;
        pulse.position = null;
      });
      this.resize();
      this.render(now);
      this.start();
    }

    setFrontView(enabled) {
      this.setViewRotation(enabled ? [0, 0, 0] : null);
    }

    setViewRotation(rotation) {
      this.viewRotation = rotation ? rotation.map(Number) : null;
      this.rotation = { pitch: 0, yaw: 0, targetPitch: 0, targetYaw: 0 };
      this.dataPulses.forEach((pulse) => {
        pulse.activation = -1;
        pulse.position = null;
      });
      this.render();
    }

    setOptions(options = {}) {
      ["accent", "secondary", "background"].forEach((key) => {
        if (typeof options[key] === "string" && options[key]) this.colors[key] = options[key];
      });
      ["rotationSpeed", "cycleSpeed"].forEach((key) => {
        const value = Number(options[key]);
        if (Number.isFinite(value)) this.settings[key] = clamp(value, 0, 4);
      });
      ["fieldOffsetX", "fieldOffsetY"].forEach((key) => {
        const value = Number(options[key]);
        if (Number.isFinite(value)) this.settings[key] = clamp(value, -50, 50);
      });
      ["fieldScale"].forEach((key) => {
        const value = Number(options[key]);
        if (Number.isFinite(value)) this.settings[key] = clamp(value, 0.25, 2);
      });
      this.render();
    }

    start() {
      if (!this.context || !this.visible || document.hidden) return;
      if (this.reduceMotion) {
        this.render();
        return;
      }
      if (!this.frame) this.frame = requestAnimationFrame(this.tick);
    }

    stop() {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.lastFrameTime = null;
    }

    destroy() {
      this.stop();
      this.abortController.abort();
      this.resizeObserver.disconnect();
      this.intersectionObserver.disconnect();
    }
  }

  function initialize() {
    document.querySelectorAll(SELECTOR).forEach((canvas) => {
      if (!canvas.__catenoidFieldAnimation) {
        canvas.__catenoidFieldAnimation = new CatenoidFieldAnimation(canvas);
      }
    });
  }

  window.__parametricWireframesAnimations = {
    initialize,
    destroy(canvas) {
      canvas.__catenoidFieldAnimation?.destroy();
      delete canvas.__catenoidFieldAnimation;
      delete canvas.dataset.animationReady;
    },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
