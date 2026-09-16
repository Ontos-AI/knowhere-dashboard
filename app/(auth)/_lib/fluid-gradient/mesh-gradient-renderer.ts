import {
  Color,
  DataTexture,
  Mesh,
  NearestFilter,
  NoBlending,
  NormalBlending,
  OrthographicCamera,
  PlaneGeometry,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  UnsignedByteType,
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";

import {
  applyErrorDiffusion,
  type ErrorDiffusionPattern,
  isErrorDiffusionPattern,
} from "@/app/(auth)/_lib/fluid-gradient/error-diffusion";

export const DEFAULT_GRADIENT_COLORS = ["#19A88B", "#19A88B", "#19A88B"] as const;

export const MAX_GRADIENT_COLORS = 6;
export const FLUID_COLOR_FIELD_COUNT = 3;

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform vec3 uColors[6];
  uniform int uColorCount;
  uniform float uAspect;
  uniform float uGradientMode;
  uniform float uFluidDetail;
  uniform float uFluidDistortion;
  uniform float uFluidFlow;
  uniform float uFluidSoftness;
  uniform float uImageFlipHorizontal;
  uniform float uImageFlipVertical;
  uniform float uImageHighlights;
  uniform float uImagePixelDensity;
  uniform float uImageReady;
  uniform float uImageRotation;
  uniform float uImageScale;
  uniform float uImageShadows;
  uniform float uImageSourceAspect;
  uniform float uImageX;
  uniform float uImageY;
  uniform sampler2D uImageTexture;
  uniform float uLiquidMarbleDetail;
  uniform float uLiquidMarbleScale;
  uniform float uLiquidMarbleSwirl;
  uniform float uParticleDensity;
  uniform float uParticleDotSize;
  uniform float uParticleFlow;
  uniform float uParticleScatterDensity;
  uniform float uPhase;
  uniform float uPixelCoverageEnabled;
  uniform float uPixelEnabled;
  uniform float uPixelEdgeJitter;
  uniform float uPixelPattern;
  uniform float uPixelSize;
  uniform vec2 uResolution;
  uniform float uStripesAngle;
  uniform float uStripesCount;
  uniform float uStripesFade;
  uniform float uStripesOffset;
  uniform float uStripesWaveAmplitude;
  uniform float uStripesWaveDirection;
  uniform float uStripesWaveEnabled;
  uniform float uStripesWaveFrequency;
  uniform float uStripesWaveRotation;

  float periodicField(vec2 point, float phase) {
    float first = sin(point.x + phase) * cos(point.y - phase);
    float second = sin(point.x * 1.73 - phase) * sin(point.y * 1.31 + phase);
    return first * 0.68 + second * 0.32;
  }

  float layeredField(vec2 point, float phase) {
    float result = 0.0;
    float amplitude = 0.56;
    float normalization = 0.0;
    for (int octave = 0; octave < 5; octave += 1) {
      if (float(octave) >= uFluidDetail) continue;
      float octaveScale = pow(1.92, float(octave));
      float octavePhase = phase * (float(octave) + 1.0);
      result += periodicField(point * octaveScale, octavePhase) * amplitude;
      normalization += amplitude;
      amplitude *= 0.52;
    }
    return result / max(normalization, 0.0001);
  }

  float liquidMarbleField(vec2 point, float phase) {
    float result = 0.0;
    float amplitude = 0.58;
    float normalization = 0.0;
    for (int octave = 0; octave < 5; octave += 1) {
      if (float(octave) >= uLiquidMarbleDetail) continue;
      float octaveScale = pow(1.86, float(octave));
      float octavePhase = phase * (1.0 + float(octave) * 0.37);
      vec2 offset = vec2(float(octave) * 1.71, float(octave) * -1.23);
      result += periodicField(point * octaveScale + offset, octavePhase) * amplitude;
      normalization += amplitude;
      amplitude *= 0.54;
    }
    return result / max(normalization, 0.0001);
  }

  vec3 sampleGradient(float position) {
    if (uColorCount <= 1) return uColors[0];
    float segmentCount = float(uColorCount - 1);
    vec3 result = vec3(0.0);
    float weightSum = 0.0;
    for (int index = 0; index < 6; index += 1) {
      if (index >= uColorCount) continue;
      float stop = float(index) / segmentCount;
      float weight = max(0.0, 1.0 - abs(position - stop) * segmentCount);
      weight = smoothstep(0.0, 1.0, weight);
      result += uColors[index] * weight;
      weightSum += weight;
    }
    return result / max(weightSum, 0.0001);
  }

  vec2 orbit(float phase, float offset, vec2 radius) {
    return vec2(
      cos(phase + offset) * radius.x,
      sin(phase + offset * 1.17) * radius.y
    );
  }

  mat2 rotate2d(float angle) {
    float cosine = cos(angle);
    float sine = sin(angle);
    return mat2(cosine, -sine, sine, cosine);
  }

  float hash21(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
  }

  vec2 hash22(vec2 point) {
    return fract(sin(vec2(
      dot(point, vec2(127.1, 311.7)),
      dot(point, vec2(269.5, 183.3))
    )) * 43758.5453123);
  }

  float ellipseCircumference(vec2 radii) {
    float sum = radii.x + radii.y;
    float difference = radii.x - radii.y;
    float h = difference * difference / max(sum * sum, 0.0001);
    return 3.14159265359 * sum * (
      1.0 + 3.0 * h / (10.0 + sqrt(4.0 - 3.0 * h))
    );
  }

  float ellipsePhaseAt(float angle, vec2 radii) {
    float phaseScale = sqrt(radii.y / max(radii.x, 0.0001));
    return mod(
      atan(phaseScale * sin(angle), cos(angle)) + 6.28318530718,
      6.28318530718
    );
  }

  float ellipseAngleAtPhase(float phase, vec2 radii) {
    float phaseScale = sqrt(radii.y / max(radii.x, 0.0001));
    return atan(
      sin(phase) / max(phaseScale, 0.0001),
      cos(phase)
    );
  }

  float dottedEllipseDistance(
    vec2 point,
    vec2 center,
    vec2 radii,
    float rotation,
    float phaseOffset,
    float spacing
  ) {
    vec2 local = rotate2d(rotation) * (point - center);
    vec2 normalized = local / radii;
    float angle = atan(normalized.y, normalized.x);
    float circumference = ellipseCircumference(radii);
    float dotCount = max(12.0, floor(circumference / spacing + 0.5));
    float phaseSpacing = 6.28318530718 / dotCount;
    float motionOffset = (uPhase / 6.28318530718 * 10.0 + phaseOffset)
      * phaseSpacing;
    float pointPhase = ellipsePhaseAt(angle, radii);
    float dotPhase = floor(
      (pointPhase + motionOffset + phaseSpacing * 0.5) / phaseSpacing
    ) * phaseSpacing - motionOffset;
    float dotAngle = ellipseAngleAtPhase(dotPhase, radii);
    vec2 localDotCenter = vec2(
      cos(dotAngle) * radii.x,
      sin(dotAngle) * radii.y
    );
    vec2 dotCenter = center + rotate2d(-rotation) * localDotCenter;
    return length(point - dotCenter);
  }

  float particleCloudDistance(vec2 point, float dotDiameter) {
    float cellSize = mix(
      0.065,
      max(dotDiameter * 1.35, 0.006),
      pow(uParticleScatterDensity, 1.2)
    );
    vec2 baseCell = floor(point / cellSize);
    float closest = 10.0;
    float spreadRadius = 0.22;
    vec2 cloudA = vec2(-0.30 * uAspect, 0.08) + orbit(uPhase, 0.4, vec2(0.10, 0.07));
    vec2 cloudB = vec2(0.27 * uAspect, -0.22) + orbit(uPhase, 2.6, vec2(0.13, 0.09));
    vec2 cloudC = vec2(0.08 * uAspect, 0.31) + orbit(uPhase, 4.8, vec2(0.08, 0.11));

    for (int offsetY = -1; offsetY <= 1; offsetY += 1) {
      for (int offsetX = -1; offsetX <= 1; offsetX += 1) {
        vec2 cell = baseCell + vec2(float(offsetX), float(offsetY));
        vec2 randomValue = hash22(cell);
        vec2 particle = (cell + randomValue) * cellSize;
        float randomPhase = hash21(cell + 17.3) * 6.28318530718;
        particle += vec2(cos(uPhase + randomPhase), sin(uPhase + randomPhase))
          * cellSize * uParticleFlow * 0.42;
        float cloudEnvelope = max(
          exp(-dot(particle - cloudA, particle - cloudA) / (spreadRadius * spreadRadius)),
          max(
            exp(-dot(particle - cloudB, particle - cloudB) / (spreadRadius * spreadRadius * 0.82)),
            exp(-dot(particle - cloudC, particle - cloudC) / (spreadRadius * spreadRadius * 0.68))
          )
        );
        if (hash21(cell + 41.7) < uParticleScatterDensity * cloudEnvelope) {
          closest = min(closest, length(point - particle));
        }
      }
    }
    return closest;
  }

  vec4 renderParticleFlow(vec2 point) {
    float dotRadius = mix(1.0, 7.0, uParticleDotSize) / 1080.0;
    float antialiasWidth = max(1.0 / uResolution.y, dotRadius * 0.32);
    float dotDiameter = dotRadius * 2.0;
    float spacing = mix(
      0.055,
      dotDiameter * 1.02,
      pow(uParticleDensity, 1.35)
    );
    float flow = uParticleFlow;
    float closest = 10.0;

    closest = min(closest, dottedEllipseDistance(
      point,
      vec2(-0.42 * uAspect, 0.16) + orbit(uPhase, 0.2, vec2(0.08, 0.05)) * flow,
      vec2(0.78, 0.50),
      -0.38 + sin(uPhase) * 0.08 * flow,
      0.0,
      spacing
    ));
    closest = min(closest, dottedEllipseDistance(
      point,
      vec2(0.46 * uAspect, -0.38) + orbit(uPhase, 2.4, vec2(0.10, 0.06)) * flow,
      vec2(0.72, 0.24),
      0.16 + sin(uPhase + 2.0) * 0.10 * flow,
      1.7,
      spacing * 1.06
    ));
    closest = min(closest, dottedEllipseDistance(
      point,
      vec2(0.10 * uAspect, 0.50) + orbit(uPhase, 4.5, vec2(0.07, 0.08)) * flow,
      vec2(0.58, 0.42),
      0.78 + sin(uPhase + 4.0) * 0.06 * flow,
      3.5,
      spacing * 0.94
    ));
    closest = min(closest, dottedEllipseDistance(
      point,
      vec2(-0.08 * uAspect, -0.56) + orbit(uPhase, 5.7, vec2(0.09, 0.05)) * flow,
      vec2(0.94, 0.30),
      -0.14 + sin(uPhase + 5.2) * 0.07 * flow,
      5.1,
      spacing * 1.02
    ));
    closest = min(closest, particleCloudDistance(point, dotDiameter));

    float alpha = 1.0 - smoothstep(dotRadius, dotRadius + antialiasWidth, closest);
    float palettePosition = clamp(
      0.5 + point.x / max(uAspect, 0.0001) * 0.42 + sin(point.y * 3.2 + uPhase) * 0.08,
      0.0,
      1.0
    );
    return vec4(sampleGradient(palettePosition), alpha);
  }

  float blueNoiseThreshold(vec2 cell) {
    return fract(52.9829189 * fract(dot(cell, vec2(0.06711056, 0.00583715))));
  }

  float orderedThreshold(vec2 cell) {
    vec2 tile = mod(cell, 4.0);
    return fract((tile.x * 0.5 + tile.y * 0.75 + mod(tile.x + tile.y, 2.0) * 0.25) / 4.0);
  }

  float pixelThreshold(vec2 cell) {
    if (uPixelPattern < 0.5) return blueNoiseThreshold(cell);
    return orderedThreshold(cell);
  }

  float edgeJitterSignal(vec2 cell) {
    float firstPhase = blueNoiseThreshold(cell) * 6.28318530718;
    float secondPhase = blueNoiseThreshold(cell.yx + 19.37) * 6.28318530718;
    return (
      sin(uPhase + firstPhase) +
      cos(uPhase + secondPhase)
    ) * 0.5;
  }

  vec4 applyPixelEffect(vec3 color, float alpha, float coverage, vec2 cell) {
    if (uPixelEnabled < 0.5) {
      float outputAlpha = uPixelCoverageEnabled > 0.5 ? coverage : alpha;
      return vec4(color, outputAlpha);
    }
    float threshold = clamp(
      pixelThreshold(cell) + edgeJitterSignal(cell) * uPixelEdgeJitter * 0.45,
      0.02,
      0.98
    );
    float quantizedAlpha = step(threshold, clamp(coverage, 0.0, 1.0));
    return vec4(clamp(color, 0.0, 1.0), quantizedAlpha);
  }

  vec3 adjustTone(vec3 color, float amount, float weight) {
    float strength = abs(amount) * weight;
    return amount >= 0.0
      ? mix(color, vec3(1.0), strength)
      : mix(color, vec3(0.0), strength);
  }

  vec2 imageSourceUv(vec2 rotatedUv) {
    if (uImageRotation < 0.5) return rotatedUv;
    if (uImageRotation < 1.5) return vec2(rotatedUv.y, 1.0 - rotatedUv.x);
    if (uImageRotation < 2.5) return vec2(1.0) - rotatedUv;
    return vec2(1.0 - rotatedUv.y, rotatedUv.x);
  }

  vec4 renderProcessedImage(vec2 outputUv, vec2 pixelCell) {
    if (uImageReady < 0.5) return vec4(0.0);

    bool quarterTurn = uImageRotation > 0.5 && uImageRotation < 1.5 ||
      uImageRotation > 2.5;
    float effectiveAspect = quarterTurn
      ? 1.0 / max(uImageSourceAspect, 0.0001)
      : uImageSourceAspect;
    vec2 span = effectiveAspect > uAspect
      ? vec2(uAspect / effectiveAspect, 1.0)
      : vec2(1.0, effectiveAspect / uAspect);
    span /= max(uImageScale, 1.0);
    vec2 centerRange = (vec2(1.0) - span) * 0.5;
    vec2 center = vec2(0.5) - centerRange * vec2(uImageX, -uImageY);
    vec2 rotatedUv = center + (outputUv - 0.5) * span;
    if (uImageFlipHorizontal > 0.5) rotatedUv.x = 1.0 - rotatedUv.x;
    if (uImageFlipVertical > 0.5) rotatedUv.y = 1.0 - rotatedUv.y;
    vec4 source = texture2D(uImageTexture, imageSourceUv(rotatedUv));

    float adjustedLuminance = dot(source.rgb, vec3(0.2126, 0.7152, 0.0722));
    float shadowWeight = 1.0 - smoothstep(0.18, 0.62, adjustedLuminance);
    float highlightWeight = smoothstep(0.38, 0.82, adjustedLuminance);
    vec3 adjusted = adjustTone(source.rgb, uImageShadows, shadowWeight);
    adjusted = adjustTone(adjusted, uImageHighlights, highlightWeight);
    float toneLuminance = dot(adjusted, vec3(0.2126, 0.7152, 0.0722));
    float densityBias = (uImagePixelDensity - 0.5) * 1.6;
    float coverage = clamp(1.0 - toneLuminance + densityBias, 0.0, 1.0) * source.a;
    vec3 tinted = mix(uColors[0], vec3(1.0), toneLuminance);
    return applyPixelEffect(
      uPixelCoverageEnabled > 0.5 ? uColors[0] : clamp(tinted, 0.0, 1.0),
      source.a,
      coverage,
      pixelCell
    );
  }

  void main() {
    float outputScale = max(uResolution.y / 1080.0, 0.0001);
    float cellSize = max(1.0, uPixelSize * outputScale);
    vec2 pixelCell = floor(gl_FragCoord.xy / cellSize);
    bool supportsPixelEffect = uGradientMode < 1.5 || uGradientMode > 2.5;
    vec2 sampledUv = supportsPixelEffect && uPixelEnabled > 0.5
      ? (pixelCell + 0.5) * cellSize / uResolution
      : vUv;
    vec2 point = (sampledUv - 0.5) * vec2(uAspect, 1.0);
    vec3 color = vec3(0.0);
    float alpha = 1.0;
    float pixelCoverage = 1.0;

    if (uGradientMode > 3.5) {
      gl_FragColor = renderProcessedImage(sampledUv, pixelCell);
      #include <colorspace_fragment>
      return;
    } else if (uGradientMode > 2.5) {
      float stripeAngle = radians(uStripesAngle);
      vec2 stripeAxis = vec2(cos(stripeAngle), sin(stripeAngle));
      vec2 waveAxis = uStripesWaveDirection < 0.5
        ? vec2(1.0, 0.0)
        : uStripesWaveDirection < 1.5
          ? vec2(0.0, 1.0)
          : normalize(vec2(1.0, 1.0));
      float waveRotation = radians(uStripesWaveRotation);
      waveAxis = mat2(
        cos(waveRotation), -sin(waveRotation),
        sin(waveRotation), cos(waveRotation)
      ) * waveAxis;
      float wave = sin(
        dot(point, waveAxis) * uStripesWaveFrequency * 6.28318530718 +
        uPhase
      );
      float waveDisplacement = uStripesWaveEnabled > 0.5
        ? wave * uStripesWaveAmplitude * 0.28
        : 0.0;
      float stripePosition = (
        dot(point, stripeAxis) + waveDisplacement
      ) * uStripesCount + uStripesOffset;
      float stripeIndex = floor(stripePosition);
      float stripeProgress = fract(stripePosition);
      float colorCount = float(uColorCount);
      float colorDenominator = max(colorCount - 1.0, 1.0);
      float currentColorPosition = mod(stripeIndex, colorCount) / colorDenominator;
      float nextColorPosition = mod(stripeIndex + 1.0, colorCount) / colorDenominator;
      float transitionWidth = max(0.001, uStripesFade * 0.5);
      float transition = smoothstep(
        1.0 - transitionWidth,
        1.0,
        stripeProgress
      );
      color = mix(
        sampleGradient(currentColorPosition),
        sampleGradient(nextColorPosition),
        transition
      );
      pixelCoverage = mix(1.0, 0.05, transition);
    } else if (uGradientMode > 1.5) {
      gl_FragColor = renderParticleFlow(point);
      #include <colorspace_fragment>
      return;
    } else if (uGradientMode > 0.5) {
      float scale = mix(1.15, 4.6, uLiquidMarbleScale);
      float swirl = uLiquidMarbleSwirl;
      vec2 marblePoint = point * scale;
      float primaryWarp = liquidMarbleField(marblePoint * 0.72, uPhase);
      float secondaryWarp = liquidMarbleField(
        marblePoint.yx * 0.58 + vec2(2.4, -1.7),
        -uPhase
      );
      vec2 warped = marblePoint + vec2(primaryWarp, secondaryWarp) * mix(0.08, 1.05, swirl);
      float twist = swirl * (primaryWarp * 1.4 + length(warped) * 0.8);
      float twistCos = cos(twist);
      float twistSin = sin(twist);
      warped = mat2(twistCos, -twistSin, twistSin, twistCos) * warped;
      float ribbon = sin(
        warped.x * 2.15 +
        warped.y * 0.72 +
        primaryWarp * mix(1.2, 8.2, swirl) +
        uPhase * 0.32
      );
      float crossRibbon = sin(
        warped.y * 1.45 -
        warped.x * 0.38 +
        secondaryWarp * mix(0.8, 5.2, swirl) -
        uPhase * 0.21
      );
      float palettePosition = clamp(
        0.5 + ribbon * 0.34 + crossRibbon * 0.16,
        0.0,
        1.0
      );
      color = sampleGradient(palettePosition);
      pixelCoverage = clamp(
        0.58 + ribbon * 0.32 + crossRibbon * 0.10,
        0.08,
        1.0
      );
    } else {
      vec2 fieldPoint = point * 0.5;
      float primaryField = layeredField(fieldPoint, uPhase);
      float secondaryField = layeredField(fieldPoint.yx + 2.7, -uPhase);
      vec2 flowVector = vec2(primaryField, secondaryField);
      vec2 curlVector = vec2(-flowVector.y, flowVector.x);
      vec2 warped = point
        + flowVector * uFluidDistortion * 0.24
        + curlVector * primaryField * uFluidFlow * 0.16;
      vec2 centers[${FLUID_COLOR_FIELD_COUNT}];
      centers[0] = vec2(-0.45 * uAspect, 0.34) + orbit(uPhase, 0.0, vec2(0.20, 0.16));
      centers[1] = vec2(0.34 * uAspect, 0.24) + orbit(uPhase, 1.7, vec2(0.28, 0.20));
      centers[2] = vec2(-0.30 * uAspect, -0.34) + orbit(uPhase, 3.1, vec2(0.24, 0.18));

      float weightSum = 0.0;
      for (int index = 0; index < ${FLUID_COLOR_FIELD_COUNT}; index += 1) {
        vec2 delta = warped - centers[index];
        float falloff = mix(7.5, 2.1, uFluidSoftness) + float(index) * 0.08;
        float rawWeight = exp(-dot(delta, delta) * falloff);
        float weight = pow(rawWeight, mix(1.8, 0.78, uFluidSoftness));
        color += uColors[0] * weight;
        weightSum += weight;
      }

      if (weightSum > 0.000001) {
        color /= weightSum;
      } else {
        color = uColors[0];
      }
      float opacityScale = mix(0.7, 1.12, uFluidSoftness)
        + min(uFluidDistortion, 1.0) * 0.06;
      alpha = clamp(
        weightSum * opacityScale,
        0.0,
        1.0
      );
      pixelCoverage = alpha;
    }

    gl_FragColor = applyPixelEffect(
      clamp(color, 0.0, 1.0),
      alpha,
      pixelCoverage,
      pixelCell
    );
    #include <colorspace_fragment>
  }
`;

const textureFragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform sampler2D uTexture;

  void main() {
    gl_FragColor = texture2D(uTexture, vUv);
    #include <colorspace_fragment>
  }
`;

export type PixelPattern = "blue-noise" | "ordered" | ErrorDiffusionPattern;

export type GradientMode =
  | "fluid"
  | "image-processing"
  | "liquid-marble"
  | "particle-flow"
  | "stripes";

export type ImageProcessingSource = Readonly<{
  flipHorizontal: boolean;
  flipVertical: boolean;
  image: HTMLImageElement;
  rotationDeg: number;
}>;

export type MeshGradientRenderValues = Readonly<{
  colors: readonly string[];
  fluidDetail: number;
  fluidDistortion: number;
  fluidFlow: number;
  fluidSoftness: number;
  gradientMode: GradientMode;
  imageHighlights: number;
  imageScale: number;
  imageShadows: number;
  imageX: number;
  imageY: number;
  liquidMarbleDetail: number;
  liquidMarbleScale: number;
  liquidMarbleSwirl: number;
  particleDensity: number;
  particleDotSize: number;
  particleFlow: number;
  particleScatterDensity: number;
  pixelDensity: number;
  pixelEnabled: boolean;
  pixelEdgeJitter: number;
  pixelPattern: PixelPattern;
  pixelSize: number;
  pixelSpread: number;
  stripesAngle: number;
  stripesCount: number;
  stripesFade: number;
  stripesOffset: number;
  stripesWaveAmplitude: number;
  stripesWaveDirection: "horizontal" | "vertical" | "diagonal";
  stripesWaveEnabled: boolean;
  stripesWaveFrequency: number;
  stripesWaveRotation: number;
}>;

export type MeshGradientSurface = Readonly<{
  dispose: () => void;
  render: (
    values: MeshGradientRenderValues,
    phase: number,
    imageSource?: ImageProcessingSource | null
  ) => void;
  resize: (width: number, height: number, pixelRatio: number) => void;
}>;

let currentGradientPhase = 0;

export function getCurrentGradientPhase(): number {
  return currentGradientPhase;
}

export function setCurrentGradientPhase(phase: number): void {
  currentGradientPhase = ((phase % 1) + 1) % 1;
}

export function advanceGradientPhase(phase: number, elapsedSeconds: number, speed: number): number {
  if (speed <= 0 || elapsedSeconds <= 0) return ((phase % 1) + 1) % 1;
  return (((phase + elapsedSeconds * speed) % 1) + 1) % 1;
}

export function resolvePreviewAnimationSpeed(
  gradientMode: GradientMode,
  fluidSpeed: number
): number {
  return gradientMode === "image-processing" ? 0 : fluidSpeed;
}

type MeshGradientSurfaceOptions = {
  maxDiffusionPixels?: number;
};

export function resolveMeshGradientPalette(
  colors: readonly string[],
  gradientMode: GradientMode
): readonly string[] {
  const palette =
    colors.length > 0 ? colors.slice(0, MAX_GRADIENT_COLORS) : [...DEFAULT_GRADIENT_COLORS];

  return gradientMode === "fluid" || gradientMode === "image-processing"
    ? palette.slice(0, 1)
    : palette;
}

export function createMeshGradientSurface(
  canvas: HTMLCanvasElement,
  options: MeshGradientSurfaceOptions = {}
): MeshGradientSurface {
  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas,
    preserveDrawingBuffer: true,
  });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new PlaneGeometry(2, 2, 48, 32);
  const material = new ShaderMaterial({
    depthTest: false,
    depthWrite: false,
    fragmentShader,
    transparent: true,
    uniforms: {
      uAspect: { value: 16 / 9 },
      uColorCount: { value: DEFAULT_GRADIENT_COLORS.length },
      uColors: { value: Array.from({ length: MAX_GRADIENT_COLORS }, () => new Color("#96A2CB")) },
      uGradientMode: { value: 0 },
      uFluidDetail: { value: 3 },
      uFluidDistortion: { value: 0 },
      uFluidFlow: { value: 0.47 },
      uFluidSoftness: { value: 0.39 },
      uImageFlipHorizontal: { value: 0 },
      uImageFlipVertical: { value: 0 },
      uImageHighlights: { value: 0 },
      uImagePixelDensity: { value: 0.5 },
      uImageReady: { value: 0 },
      uImageRotation: { value: 0 },
      uImageScale: { value: 1 },
      uImageShadows: { value: 0 },
      uImageSourceAspect: { value: 1 },
      uImageTexture: { value: new Texture() },
      uImageX: { value: 0 },
      uImageY: { value: 0 },
      uLiquidMarbleDetail: { value: 1 },
      uLiquidMarbleScale: { value: 0 },
      uLiquidMarbleSwirl: { value: 0.38 },
      uParticleDensity: { value: 0.6 },
      uParticleDotSize: { value: 3 / 7 },
      uParticleFlow: { value: 0.58 },
      uParticleScatterDensity: { value: 0.45 },
      uPhase: { value: 0 },
      uPixelCoverageEnabled: { value: 0 },
      uPixelEnabled: { value: 0 },
      uPixelEdgeJitter: { value: 0 },
      uPixelPattern: { value: 0 },
      uPixelSize: { value: 6 },
      uResolution: { value: new Vector2(1920, 1080) },
      uStripesAngle: { value: 104 },
      uStripesCount: { value: 3 },
      uStripesFade: { value: 0.81 },
      uStripesOffset: { value: 0.32 },
      uStripesWaveAmplitude: { value: 0.61 },
      uStripesWaveDirection: { value: 0 },
      uStripesWaveEnabled: { value: 1 },
      uStripesWaveFrequency: { value: 3 },
      uStripesWaveRotation: { value: 0 },
    },
    vertexShader,
  });
  const mesh = new Mesh(geometry, material);
  scene.add(mesh);

  const outputScene = new Scene();
  const outputMaterial = new ShaderMaterial({
    blending: NormalBlending,
    depthTest: false,
    depthWrite: false,
    fragmentShader: textureFragmentShader,
    transparent: true,
    uniforms: { uTexture: { value: null as DataTexture | null } },
    vertexShader,
  });
  outputScene.add(new Mesh(geometry, outputMaterial));

  let diffusionTarget: WebGLRenderTarget | null = null;
  let diffusionTexture: DataTexture | null = null;
  let sourcePixels = new Uint8Array(0);
  let diffusedPixels = new Uint8Array(0);
  let diffusionWorking = new Float32Array(0);
  let diffusionWidth = 0;
  let diffusionHeight = 0;
  let currentImageSource: HTMLImageElement | null = null;

  function replaceImageTexture(image: HTMLImageElement | null): void {
    const previousTexture = material.uniforms.uImageTexture.value as Texture;
    const nextTexture = image ? new Texture(image) : new Texture();
    nextTexture.colorSpace = SRGBColorSpace;
    if (image) nextTexture.needsUpdate = true;
    material.uniforms.uImageTexture.value = nextTexture;
    currentImageSource = image;
    previousTexture.dispose();
  }

  function ensureDiffusionBuffers(width: number, height: number): void {
    if (width === diffusionWidth && height === diffusionHeight) return;

    diffusionTarget?.dispose();
    diffusionTexture?.dispose();
    diffusionWidth = width;
    diffusionHeight = height;
    const byteLength = width * height * 4;
    sourcePixels = new Uint8Array(byteLength);
    diffusedPixels = new Uint8Array(byteLength);
    diffusionWorking = new Float32Array(byteLength);
    diffusionTarget = new WebGLRenderTarget(width, height, {
      depthBuffer: false,
      stencilBuffer: false,
    });
    diffusionTexture = new DataTexture(diffusedPixels, width, height, RGBAFormat, UnsignedByteType);
    diffusionTexture.generateMipmaps = false;
    diffusionTexture.magFilter = NearestFilter;
    diffusionTexture.minFilter = NearestFilter;
    diffusionTexture.needsUpdate = true;
    outputMaterial.uniforms.uTexture.value = diffusionTexture;
  }

  function resize(width: number, height: number, pixelRatio: number): void {
    const safeWidth = Math.max(1, Math.round(width));
    const safeHeight = Math.max(1, Math.round(height));
    renderer.setPixelRatio(Math.max(1, pixelRatio));
    renderer.setSize(safeWidth, safeHeight, false);
    material.uniforms.uAspect.value = safeWidth / safeHeight;
    renderer.getDrawingBufferSize(material.uniforms.uResolution.value);
  }

  function render(
    values: MeshGradientRenderValues,
    phase: number,
    imageSource: ImageProcessingSource | null = null
  ): void {
    const palette = resolveMeshGradientPalette(values.colors, values.gradientMode);
    material.uniforms.uColorCount.value = palette.length;
    for (let index = 0; index < MAX_GRADIENT_COLORS; index += 1) {
      material.uniforms.uColors.value[index].set(
        palette[index] ?? palette[palette.length - 1] ?? "#96A2CB"
      );
    }
    material.uniforms.uFluidDetail.value = values.fluidDetail;
    material.uniforms.uFluidDistortion.value = values.fluidDistortion;
    material.uniforms.uFluidFlow.value = values.fluidFlow;
    material.uniforms.uFluidSoftness.value = values.fluidSoftness;
    material.uniforms.uGradientMode.value =
      values.gradientMode === "particle-flow"
        ? 2
        : values.gradientMode === "stripes"
          ? 3
          : values.gradientMode === "image-processing"
            ? 4
            : values.gradientMode === "liquid-marble"
              ? 1
              : 0;
    material.uniforms.uLiquidMarbleDetail.value = values.liquidMarbleDetail;
    material.uniforms.uLiquidMarbleScale.value = values.liquidMarbleScale / 100;
    material.uniforms.uLiquidMarbleSwirl.value = values.liquidMarbleSwirl / 100;
    material.uniforms.uImageHighlights.value = values.imageHighlights / 100;
    material.uniforms.uImagePixelDensity.value = values.pixelDensity / 100;
    material.uniforms.uImageScale.value = values.imageScale / 100;
    material.uniforms.uImageShadows.value = values.imageShadows / 100;
    material.uniforms.uImageX.value = values.imageX / 100;
    material.uniforms.uImageY.value = values.imageY / 100;
    material.uniforms.uImageReady.value = imageSource ? 1 : 0;
    if (imageSource) {
      if (currentImageSource !== imageSource.image) {
        replaceImageTexture(imageSource.image);
      }
      material.uniforms.uImageSourceAspect.value =
        imageSource.image.naturalWidth / Math.max(1, imageSource.image.naturalHeight);
      material.uniforms.uImageRotation.value =
        ((Math.round(imageSource.rotationDeg / 90) % 4) + 4) % 4;
      material.uniforms.uImageFlipHorizontal.value = imageSource.flipHorizontal ? 1 : 0;
      material.uniforms.uImageFlipVertical.value = imageSource.flipVertical ? 1 : 0;
    } else if (currentImageSource) {
      replaceImageTexture(null);
    }
    material.uniforms.uParticleDensity.value = values.particleDensity / 100;
    material.uniforms.uParticleDotSize.value = (values.particleDotSize - 1) / 7;
    material.uniforms.uParticleFlow.value = values.particleFlow / 100;
    material.uniforms.uParticleScatterDensity.value = values.particleScatterDensity / 100;
    material.uniforms.uPhase.value = phase * Math.PI * 2;
    const pixelEffectEnabled = values.pixelEnabled && values.gradientMode !== "particle-flow";
    const errorDiffusionEnabled =
      pixelEffectEnabled && isErrorDiffusionPattern(values.pixelPattern);
    material.uniforms.uPixelEdgeJitter.value = pixelEffectEnabled ? values.pixelEdgeJitter : 0;
    material.uniforms.uPixelCoverageEnabled.value = pixelEffectEnabled ? 1 : 0;
    material.uniforms.uPixelEnabled.value = pixelEffectEnabled && !errorDiffusionEnabled ? 1 : 0;
    material.uniforms.uPixelPattern.value = values.pixelPattern === "ordered" ? 1 : 0;
    material.uniforms.uPixelSize.value = values.pixelSize;
    material.uniforms.uStripesAngle.value = values.stripesAngle;
    material.uniforms.uStripesCount.value = values.stripesCount;
    material.uniforms.uStripesFade.value = values.stripesFade / 100;
    material.uniforms.uStripesOffset.value = values.stripesOffset / 100;
    material.uniforms.uStripesWaveAmplitude.value = values.stripesWaveAmplitude / 100;
    material.uniforms.uStripesWaveDirection.value =
      values.stripesWaveDirection === "diagonal"
        ? 2
        : values.stripesWaveDirection === "vertical"
          ? 1
          : 0;
    material.uniforms.uStripesWaveEnabled.value = values.stripesWaveEnabled ? 1 : 0;
    material.uniforms.uStripesWaveFrequency.value = values.stripesWaveFrequency;
    material.uniforms.uStripesWaveRotation.value = values.stripesWaveRotation;

    if (!errorDiffusionEnabled) {
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
      return;
    }

    const outputResolution = material.uniforms.uResolution.value as Vector2;
    const outputWidth = outputResolution.x;
    const outputHeight = outputResolution.y;
    const cellSize = Math.max(1, (values.pixelSize * outputHeight) / 1080);
    let gridWidth = Math.max(1, Math.ceil(outputWidth / cellSize));
    let gridHeight = Math.max(1, Math.ceil(outputHeight / cellSize));
    const maxDiffusionPixels = options.maxDiffusionPixels ?? Number.POSITIVE_INFINITY;
    if (gridWidth * gridHeight > maxDiffusionPixels) {
      const scale = Math.sqrt(maxDiffusionPixels / (gridWidth * gridHeight));
      gridWidth = Math.max(1, Math.floor(gridWidth * scale));
      gridHeight = Math.max(1, Math.floor(gridHeight * scale));
    }
    ensureDiffusionBuffers(gridWidth, gridHeight);
    const target = diffusionTarget;
    if (!target) return;

    material.uniforms.uResolution.value.set(gridWidth, gridHeight);
    material.blending = NoBlending;
    renderer.setRenderTarget(target);
    renderer.clear();
    renderer.render(scene, camera);
    renderer.readRenderTargetPixels(target, 0, 0, gridWidth, gridHeight, sourcePixels);
    material.blending = NormalBlending;
    material.uniforms.uResolution.value.set(outputWidth, outputHeight);

    applyErrorDiffusion(
      sourcePixels,
      gridWidth,
      gridHeight,
      values.pixelPattern,
      values.pixelSpread,
      diffusedPixels,
      diffusionWorking,
      values.pixelEdgeJitter,
      phase
    );
    if (diffusionTexture) diffusionTexture.needsUpdate = true;
    renderer.setRenderTarget(null);
    renderer.clear();
    renderer.render(outputScene, camera);
  }

  return {
    dispose: () => {
      geometry.dispose();
      material.dispose();
      (material.uniforms.uImageTexture.value as Texture).dispose();
      outputMaterial.dispose();
      diffusionTarget?.dispose();
      diffusionTexture?.dispose();
      renderer.dispose();
    },
    render,
    resize,
  };
}

export function renderMeshGradientImage(
  values: MeshGradientRenderValues,
  phase: number,
  width: number,
  height: number,
  imageSource: ImageProcessingSource | null = null
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const surface = createMeshGradientSurface(canvas);
  surface.resize(width, height, 1);
  surface.render(values, phase, imageSource);
  surface.dispose();
  return canvas;
}
