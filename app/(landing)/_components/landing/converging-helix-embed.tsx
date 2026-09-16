// @ts-nocheck
"use client";

import { useEffect, useMemo, useRef } from "react";
import "@app/(landing)/_components/landing/converging-helix-embed.css";

const animationUrl = "/landing-embeds/converging-helix.js";

const DEFAULT_SETTINGS = {
  accentColor: null,
  amplitude: 0.52,
  backgroundColor: 'transparent',
  centerGap: 120,
  compression: 1.22,
  dashGap: 8,
  dashLength: 5,
  decay: 1.05,
  horizontalSpan: 1,
  lineWidth: 1,
  opacity: 0.86,
  rotation: [0, 0.57, 0],
  scale: 1,
  showDataSquares: true,
  speed: 1,
  strands: 7,
  turns: 2.25,
  yPosition: 0,
}
let animationLoad = null

function getAnimationApi() {
  return window.__convergingHelixAnimations
}

function resolveColor(color) {
  const token = color.match(/^var\((--[^,)]+)(?:,[^)]+)?\)$/)?.[1]
  return token ? getComputedStyle(document.documentElement).getPropertyValue(token).trim() : color
}

function resolveOptions(options) {
  return {
    ...options,
    accent: resolveColor(options.accent),
    background: options.background === 'transparent' ? 'transparent' : resolveColor(options.background),
    squareAccent: resolveColor(options.squareAccent),
  }
}

function loadAnimation() {
  if (getAnimationApi()) return Promise.resolve()
  if (animationLoad) return animationLoad
  animationLoad = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-converging-helix-embed]')
    if (existing && getAnimationApi()) {
      resolve()
      return
    }
    const script = existing ?? document.createElement('script')
    const finish = () => {
      if (getAnimationApi()) resolve()
      else reject(new Error('Unable to load the converging helix animation.'))
    }
    const onError = () => {
      animationLoad = null
      reject(new Error('Unable to load the converging helix animation.'))
    }
    script.addEventListener('load', finish, { once: true })
    script.addEventListener('error', onError, { once: true })
    if (!existing) {
      script.src = animationUrl
      script.async = true
      script.dataset.convergingHelixEmbed = 'true'
      document.head.appendChild(script)
    } else if (existing.src && (existing.readyState === 'complete' || existing.dataset.convergingHelixEmbed)) {
      queueMicrotask(finish)
    }
  })
  return animationLoad
}

export function ConvergingHelixEmbed({
  accentColor = 'var(--main-400)',
  amplitude = DEFAULT_SETTINGS.amplitude,
  backgroundColor = DEFAULT_SETTINGS.backgroundColor,
  centerGap = DEFAULT_SETTINGS.centerGap,
  className,
  compression = DEFAULT_SETTINGS.compression,
  dashGap = DEFAULT_SETTINGS.dashGap,
  dashLength = DEFAULT_SETTINGS.dashLength,
  dataSquareColor = 'var(--coral-signal-500)',
  decay = DEFAULT_SETTINGS.decay,
  horizontalSpan = DEFAULT_SETTINGS.horizontalSpan,
  lineWidth = DEFAULT_SETTINGS.lineWidth,
  mirror = false,
  opacity = DEFAULT_SETTINGS.opacity,
  rotation = DEFAULT_SETTINGS.rotation,
  scale = DEFAULT_SETTINGS.scale,
  showDataSquares = DEFAULT_SETTINGS.showDataSquares,
  speed = DEFAULT_SETTINGS.speed,
  squareCount = 4,
  squareSize = 12,
  strands = DEFAULT_SETTINGS.strands,
  turns = DEFAULT_SETTINGS.turns,
}) {
  const canvasRef = useRef(null)
  const options = useMemo(() => ({
    accent: accentColor,
    amplitude,
    background: backgroundColor,
    centerGap,
    compression,
    dashGap,
    dashLength,
    decay,
    horizontalSpan,
    lineWidth,
    mirror,
    opacity,
    rotation: rotation.map(value => value * Math.PI / 180),
    scale,
    showDataSquares,
    squareAccent: dataSquareColor,
    squareCount,
    squareSize,
    speed,
    strands,
    turns,
  }), [accentColor, amplitude, backgroundColor, centerGap, compression, dashGap, dashLength, dataSquareColor, decay, horizontalSpan, lineWidth, mirror, opacity, rotation, scale, showDataSquares, speed, squareCount, squareSize, strands, turns])
  const optionsRef = useRef(options)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    let disposed = false
    void loadAnimation()
      .then(() => {
        if (disposed) return
        getAnimationApi()?.initialize(canvas)
        const animation = canvas.__convergingHelixAnimation
        animation?.setOptions(resolveOptions(optionsRef.current))
        animation?.restart()
        animation?.syncVisibility?.()
        if (animation && !animation.visible) animation.render()
      })
      .catch(() => {
        canvas.dataset.animationError = 'true'
      })
    return () => {
      disposed = true
      getAnimationApi()?.destroy(canvas)
    }
  }, [])

  useEffect(() => {
    optionsRef.current = options
    const applyOptions = () => {
      canvasRef.current?.__convergingHelixAnimation?.setOptions(resolveOptions(options))
    }
    applyOptions()
    window.addEventListener('main-palette-change', applyOptions)
    return () => window.removeEventListener('main-palette-change', applyOptions)
  }, [options])

  return (
    <div className={['converging-helix-embed', className].filter(Boolean).join(' ')}>
      <canvas
        ref={canvasRef}
        className="converging-helix-embed__canvas"
        data-animation="converging-helix"
        data-mirror={mirror ? 'true' : 'false'}
        aria-hidden="true"
      />
    </div>
  )
}

export const CTA_HELIX_FALLBACK = {
  ...DEFAULT_SETTINGS,
  opacity: 1,
}
