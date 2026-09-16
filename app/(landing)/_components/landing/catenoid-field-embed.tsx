// @ts-nocheck
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "@app/(landing)/_components/landing/catenoid-field-embed.css";

const animationUrl = "/landing-embeds/catenoid-field.js";

const DEFAULT_VIEW_ROTATION = [-22, 0, 0]
const DEFAULT_CYCLE_SPEED = 0.35
const DEFAULT_ROTATION_SPEED = 1
const DEFAULT_COLORS = {
  accentColor: '#19A88B',
  secondaryColor: '#19A88B',
  backgroundColor: '#FFFFFF',
}
const DEFAULT_FIELD_LAYOUT = { x: 0, y: 13, scale: 1.5 }
const SETTINGS_STORAGE_KEY = 'knowhere:catenoid-field-settings'
const PYTHON_CODE = `# pip install knowhere-python-sdk
import knowhere

client = knowhere.Knowhere(api_key="sk_...")

result = client.parse(url="https://arxiv.org/pdf/1706.03762.pdf")

print(result.statistics.total_chunks)
print(result.full_markdown[:200])`
const NODE_CODE = `// npm install @ontos-ai/knowhere-sdk
import Knowhere from "@ontos-ai/knowhere-sdk";

const client = new Knowhere({
  apiKey: "sk_...",
});

const result = await client.parse({
  url: "https://arxiv.org/pdf/1706.03762.pdf",
});

console.log("Text chunks:", result.textChunks.length);
console.log(result.textChunks[0]?.content);`
const CURL_CODE = `curl -X POST https://api.knowhereto.ai/v1/jobs \\
  --oauth2-bearer "$KNOWHERE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "source_type": "url",
    "source_url": "https://arxiv.org/pdf/1706.03762.pdf",
    "parsing_params": {
      "model": "base",
      "ocr_enabled": true
    }
  }'`
const CODE_EXAMPLES = {
  python: { label: 'Python', code: PYTHON_CODE },
  node: { label: 'Node.js', code: NODE_CODE },
  curl: { label: 'CURL', code: CURL_CODE },
}
let animationLoad = null

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function getAnimationApi() {
  return window.__parametricWireframesAnimations
}

function resolveColor(color) {
  const token = color.match(/^var\((--[^,)]+)(?:,[^)]+)?\)$/)?.[1]
  return token ? getComputedStyle(document.documentElement).getPropertyValue(token).trim() : color
}

function resolveOptions(options) {
  return {
    ...options,
    accent: resolveColor(options.accent),
    background: resolveColor(options.background),
    secondary: resolveColor(options.secondary),
  }
}

function loadSavedSettings() {
  const defaults = {
    viewRotation: DEFAULT_VIEW_ROTATION,
    cycleSpeed: DEFAULT_CYCLE_SPEED,
    rotationSpeed: DEFAULT_ROTATION_SPEED,
    colors: DEFAULT_COLORS,
    fieldLayout: DEFAULT_FIELD_LAYOUT,
  }

  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY))
    if (!saved) return defaults
    const viewRotation = saved.viewRotation === null
      ? null
      : Array.isArray(saved.viewRotation) && saved.viewRotation.length === 3 && saved.viewRotation.every(Number.isFinite)
        ? saved.viewRotation
        : defaults.viewRotation
    const color = (value, fallback) => /^#[0-9a-f]{6}$/i.test(value) ? value : fallback
    const number = (value, fallback, min, max) => Number.isFinite(value) ? clamp(value, min, max) : fallback
    return {
      viewRotation,
      cycleSpeed: number(saved.cycleSpeed, defaults.cycleSpeed, 0, 2),
      rotationSpeed: number(saved.rotationSpeed, defaults.rotationSpeed, 0, 2),
      colors: {
        accentColor: defaults.colors.accentColor,
        secondaryColor: defaults.colors.secondaryColor,
        backgroundColor: color(saved.colors?.backgroundColor, defaults.colors.backgroundColor),
      },
      fieldLayout: {
        x: number(saved.fieldLayout?.x, defaults.fieldLayout.x, -30, 30),
        y: number(saved.fieldLayout?.y, defaults.fieldLayout.y, -30, 30),
        scale: number(saved.fieldLayout?.scale, defaults.fieldLayout.scale, 0.5, 2),
      },
    }
  } catch {
    return defaults
  }
}

function loadAnimation() {
  if (getAnimationApi()) return Promise.resolve()
  if (animationLoad) return animationLoad

  animationLoad = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-catenoid-field-embed]')
    const script = existing ?? document.createElement('script')
    const onLoad = () => resolve()
    const onError = () => {
      animationLoad = null
      reject(new Error('Unable to load the catenoid field animation.'))
    }

    script.addEventListener('load', onLoad, { once: true })
    script.addEventListener('error', onError, { once: true })
    if (!existing) {
      script.src = animationUrl
      script.async = true
      script.dataset.catenoidFieldEmbed = 'true'
      document.head.appendChild(script)
    }
  })

  return animationLoad
}

/** Renders the standalone 01 / Catenoid Field artwork without controls. */
export function CatenoidFieldEmbed({
  accentColor = 'var(--mineral-green-500)',
  backgroundColor = 'var(--main-950)',
  className,
  cycleSpeed = 1,
  fieldOffsetX = 0,
  fieldOffsetY = 0,
  fieldScale = 1,
  rotationSpeed = 1,
  secondaryColor = 'var(--mineral-green-500)',
  viewRotation = DEFAULT_VIEW_ROTATION,
}) {
  const canvasRef = useRef(null)
  const rotationRadians = useMemo(
    () => viewRotation?.map(value => value * Math.PI / 180) ?? null,
    [viewRotation],
  )
  const rotationRef = useRef(rotationRadians)
  const options = useMemo(() => ({
    accent: accentColor,
    background: backgroundColor,
    cycleSpeed,
    fieldOffsetX,
    fieldOffsetY,
    fieldScale,
    rotationSpeed,
    secondary: secondaryColor,
  }), [accentColor, backgroundColor, cycleSpeed, fieldOffsetX, fieldOffsetY, fieldScale, rotationSpeed, secondaryColor])
  const optionsRef = useRef(options)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    let disposed = false

    void loadAnimation()
      .then(() => {
        if (disposed) return
        getAnimationApi()?.initialize()
        canvas.__catenoidFieldAnimation?.restart()
        canvas.__catenoidFieldAnimation?.setOptions(resolveOptions(optionsRef.current))
        canvas.__catenoidFieldAnimation?.setViewRotation(rotationRef.current)
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
    rotationRef.current = rotationRadians
    canvasRef.current?.__catenoidFieldAnimation?.setViewRotation(rotationRadians)
  }, [rotationRadians])

  useEffect(() => {
    optionsRef.current = options
    const applyOptions = () => {
      canvasRef.current?.__catenoidFieldAnimation?.setOptions(resolveOptions(options))
    }
    applyOptions()
    window.addEventListener('main-palette-change', applyOptions)
    return () => window.removeEventListener('main-palette-change', applyOptions)
  }, [options])

  return (
    <div className={['catenoid-field-embed', className].filter(Boolean).join(' ')}>
      <canvas
        ref={canvasRef}
        className="catenoid-field-embed__canvas"
        data-animation="catenoid-field"
        aria-hidden="true"
      />
    </div>
  )
}

function IntegrationCodeFrame() {
  const [activeLanguage, setActiveLanguage] = useState('python')
  const [copied, setCopied] = useState(false)
  const [entered, setEntered] = useState(false)
  const [visibleCharacterCount, setVisibleCharacterCount] = useState(0)
  const frameRef = useRef(null)
  const preRef = useRef(null)
  const typingFrameRef = useRef(0)
  const activeCode = CODE_EXAMPLES[activeLanguage].code

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return undefined
    const updateCornerOffsets = () => {
      const { width, height } = frame.getBoundingClientRect()
      const shiftX = width / 2
      const shiftY = height / 2
      const offsets = [
        [shiftX, shiftY],
        [-shiftX, shiftY],
        [shiftX, -shiftY],
        [-shiftX, -shiftY],
      ]
      frame.querySelectorAll('.integration-code-frame__corner').forEach((corner, index) => {
        const [x, y] = offsets[index]
        corner.style.setProperty('--corner-start', `translate(${x}px, ${y}px)`)
      })
    }
    const resizeObserver = new ResizeObserver(updateCornerOffsets)
    const intersectionObserver = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return
      setEntered(true)
      intersectionObserver.disconnect()
    }, { threshold: 0.2 })
    updateCornerOffsets()
    resizeObserver.observe(frame)
    intersectionObserver.observe(frame)
    return () => {
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!entered) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisibleCharacterCount(PYTHON_CODE.length)
      return undefined
    }

    const start = performance.now()
    const typeCode = now => {
      const progress = clamp((now - start - 300) / 1200, 0, 1)
      setVisibleCharacterCount(Math.floor(progress * PYTHON_CODE.length))
      if (progress < 1) typingFrameRef.current = requestAnimationFrame(typeCode)
    }
    typingFrameRef.current = requestAnimationFrame(typeCode)
    return () => cancelAnimationFrame(typingFrameRef.current)
  }, [entered])

  const selectLanguage = language => {
    cancelAnimationFrame(typingFrameRef.current)
    setActiveLanguage(language)
    setVisibleCharacterCount(CODE_EXAMPLES[language].code.length)
    setCopied(false)
    preRef.current?.scrollTo({ top: 0 })
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeCode)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = activeCode
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
    }
    setCopied(true)
  }

  return (
    <div className={`integration-code-frame${entered ? ' is-entering' : ''}`} ref={frameRef}>
      <span className="integration-code-frame__corner integration-code-frame__corner--top-left" aria-hidden="true" />
      <span className="integration-code-frame__corner integration-code-frame__corner--top-right" aria-hidden="true" />
      <span className="integration-code-frame__corner integration-code-frame__corner--bottom-left" aria-hidden="true" />
      <span className="integration-code-frame__corner integration-code-frame__corner--bottom-right" aria-hidden="true" />
      <div className="integration-code-frame__card">
        <div className="integration-code-frame__header">
          <div className="integration-code-frame__tabs" aria-label="SDK examples">
            {Object.entries(CODE_EXAMPLES).map(([language, example]) => (
              <button
                type="button"
                className={activeLanguage === language ? 'is-active' : undefined}
                aria-pressed={activeLanguage === language}
                onClick={() => selectLanguage(language)}
                key={language}
              >{example.label}</button>
            ))}
          </div>
          <button className={`integration-code-frame__copy${copied ? ' is-copied' : ''}`} type="button" onClick={copyCode} aria-label={copied ? 'Code copied' : `Copy ${CODE_EXAMPLES[activeLanguage].label} code`}>
            {copied ? 'Copied' : <i className="ri-file-copy-line" aria-hidden="true" />}
          </button>
        </div>
        <pre ref={preRef} aria-hidden="true"><code><span>{activeCode.slice(0, visibleCharacterCount)}</span><span className="integration-code-frame__untyped">{activeCode.slice(visibleCharacterCount)}</span></code></pre>
        <span className="sr-only">{activeCode}</span>
        <span className="sr-only" aria-live="polite">{copied ? 'Code copied' : ''}</span>
      </div>
    </div>
  )
}

/** Renders the Integration artwork with the same defaults and saved settings as before. */
export function CatenoidFieldTuner() {
  const initialSettings = useMemo(loadSavedSettings, [])
  const { colors, fieldLayout } = initialSettings

  return (
    <div className="catenoid-field-workbench">
      <CatenoidFieldEmbed
        viewRotation={initialSettings.viewRotation}
        accentColor="var(--mineral-green-500)"
        secondaryColor="var(--coral-signal-500)"
        backgroundColor={colors.backgroundColor === DEFAULT_COLORS.backgroundColor ? 'var(--white-100)' : colors.backgroundColor}
        cycleSpeed={initialSettings.cycleSpeed}
        fieldOffsetX={fieldLayout.x}
        fieldOffsetY={fieldLayout.y}
        fieldScale={fieldLayout.scale}
        rotationSpeed={initialSettings.rotationSpeed}
      />
      <IntegrationCodeFrame />
    </div>
  )
}
