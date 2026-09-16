// @ts-nocheck
"use client";

import { HyperText } from "@app/(landing)/_components/landing/hyper-text";
import productDocuments from "@app/(landing)/_components/landing/product-documents.json";
import { useMotionValueEvent, useScroll } from "framer-motion";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const MOBILE_PRODUCT_QUERY = '(max-width: 767px)'
const DESKTOP_PRODUCT_QUERY = '(min-width: 1200px)'
const PRODUCT_STICKY_TOP = 68
const PRODUCT_STAGE_COUNT = 5
const PRODUCT_STAGE_SCROLL_VH = 60
const DOCUMENT_ENTRY_END_PROGRESS = 0.05
const DOCUMENT_ENTRY_CAMERA_SHIFT = 200
const DOCUMENT_OUTLINE_END_PROGRESS = 0.14
const DOCUMENT_EXTRACTION_START_PROGRESS = 0.08
const DOCUMENT_EXTRACTION_END_PROGRESS = 0.20
const DOCUMENT_SOURCES_START_PROGRESS = 0.18
const DOCUMENT_SOURCES_END_PROGRESS = 0.34
const CONNECTION_LINE_EXTENSION = 24
const DESKTOP_SOURCE_CONNECTION_EXTENSION = 40
const SOURCE_REVEAL_CAMERA_SHIFT = 560 + DESKTOP_SOURCE_CONNECTION_EXTENSION
const HIERARCHY_REVEAL_CAMERA_SHIFT = 860 + DESKTOP_SOURCE_CONNECTION_EXTENSION * 2
// Hold Source-backed context 64px below the top of the illustration stage.
const SUMMARY_REVEAL_CAMERA_SHIFT = HIERARCHY_REVEAL_CAMERA_SHIFT + 146
const DOCUMENT_HIERARCHY_END_PROGRESS = 0.72
const SECTION_WIDTH = 380.62
const SECTION_GAP = 33
const DOCUMENT_GAP = 101

// PDF page numbers are one-based file positions, not printed folio numbers.
const themeSourcesMap = Object.fromEntries(productDocuments.map(project => [
  project.id,
  project.documents.flatMap((document, documentIndex) => document.sources.map(source => ({
    ...source,
    filename: document.name,
    documentTitle: document.title,
    format: project.format,
    location: source.location ?? `PAGE ${String(source.page).padStart(2, '0')}`,
    caption: source.title,
    citation: source.location
      ? `${document.name} · ${source.sheetName ? source.location : source.title}`
      : `DOCUMENT ${documentIndex + 1} · PDF page ${source.page}`,
  }))),
]))

const themes = productDocuments.map(project => ({
  id: project.id,
  label: project.label,
  format: project.format,
  extension: project.extension,
  icon: project.icon,
  documents: project.documents.map(document => ({
    name: document.name,
    title: document.title,
    sections: document.sources.map(source => ({
      name: source.title,
      copy: source.pageText ?? (source.excerpt ? [source.excerpt] : []),
      sheetName: source.sheetName,
      pages: [{ label: source.location ?? `PAGE ${String(source.page).padStart(2, '0')}`, sourceId: source.id }],
    })),
  })),
}))

function getSourceLayout(documents) {
  let width = 0
  const sources = documents.flatMap((document, documentIndex) => (
    document.sections.map((section, sectionIndex) => {
      const gap = sectionIndex < document.sections.length - 1
        ? SECTION_GAP
        : documentIndex < documents.length - 1 ? DOCUMENT_GAP : 0
      const center = width + SECTION_WIDTH / 2
      width += SECTION_WIDTH + gap
      return { id: section.pages[0].sourceId, center, gap }
    })
  ))
  return { sources, width }
}

function clamp(val, min = 0, max = 1) {
  return Math.max(min, Math.min(max, val))
}

function TracePixelReveal({ active, delay = 0, duration = 800 }) {
  const canvasRef = useRef(null)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return undefined

    const context = canvas.getContext('2d')
    if (!context) return undefined

    let animationFrame = 0
    const clear = () => {
      window.cancelAnimationFrame(animationFrame)
      context.clearRect(0, 0, canvas.width, canvas.height)
    }

    if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      host.style.removeProperty('--trace-content-clip')
      canvas.dataset.pixelState = 'idle'
      clear()
      return clear
    }

    const rect = canvas.getBoundingClientRect()
    const width = Math.max(1, Math.round(rect.width))
    const height = Math.max(1, Math.round(rect.height))
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    context.setTransform(dpr, 0, 0, dpr, 0, 0)

    const readColorToken = (token, fallback) => (
      getComputedStyle(document.documentElement).getPropertyValue(token).trim() || fallback
    )
    const resolveColors = () => document.documentElement.dataset.theme === 'dark'
      ? [
          readColorToken('--md-sys-color-primary-container', '#054437'),
          readColorToken('--md-sys-color-primary', '#23D6B1'),
          readColorToken('--md-sys-color-inverse-primary', '#12846C'),
        ]
      : [
          readColorToken('--mineral-green-50', '#CAFFEE'),
          readColorToken('--page-primary', '#19A88B'),
          readColorToken('--mineral-green-700', '#0A6351'),
        ]
    let colors = resolveColors()
    const syncColors = () => { colors = resolveColors() }
    window.addEventListener('main-palette-change', syncColors)
    const gap = 6
    const pixels = []
    let colorIndex = 0
    for (let x = gap / 2; x < width; x += gap) {
      for (let y = gap / 2; y < height; y += gap) {
        pixels.push({
          x,
          y,
          colorIndex: colorIndex++ % colors.length,
          maxSize: .65 + Math.random() * 2.05,
          phase: Math.random() * Math.PI * 2,
          noise: Math.random(),
          settleDelay: (Math.random() - .35) * 50,
        })
      }
    }

    host.style.setProperty('--trace-content-clip', 'inset(0 0 100% 0)')
    canvas.dataset.pixelState = 'running'
    const startedAt = performance.now() + delay

    const renderPixels = now => {
      const elapsed = now - startedAt
      context.clearRect(0, 0, width, height)
      if (elapsed < 0) {
        animationFrame = window.requestAnimationFrame(renderPixels)
        return
      }

      const travel = Math.min(1, elapsed / duration)
      const eased = travel < .5
        ? 2 * travel * travel
        : 1 - Math.pow(-2 * travel + 2, 2) / 2
      const headY = -18 + eased * (height + 50)
      const trailWidth = Math.min(118, height * .55)
      const revealed = Math.max(0, Math.min(1, (headY - 6) / height))
      host.style.setProperty('--trace-content-clip', `inset(0 0 ${(1 - revealed) * 100}% 0)`)

      const fade = elapsed < duration ? 1 : Math.max(0, 1 - (elapsed - duration) / 78)
      pixels.forEach(pixel => {
        const distance = headY - pixel.y
        if (distance < -24 || distance > trailWidth) return
        const leading = distance < 0 ? (distance + 24) / 24 : 1
        const trailing = distance <= 0 ? 1 : 1 - distance / trailWidth
        const envelope = Math.max(0, leading * Math.pow(trailing, .72))
        if (pixel.noise > Math.min(1, envelope * 1.42)) return
        const shimmer = .72 + Math.sin(elapsed * .036 + pixel.phase) * .28
        const size = pixel.maxSize * (.65 + envelope * .7) * shimmer
        context.globalAlpha = fade * (.4 + envelope * .6)
        context.fillStyle = colors[pixel.colorIndex]
        context.fillRect(pixel.x - size / 2, pixel.y - size / 2, size, size)
      })
      context.globalAlpha = 1

      if (elapsed < duration + 78) {
        animationFrame = window.requestAnimationFrame(renderPixels)
      } else {
        host.style.removeProperty('--trace-content-clip')
        context.clearRect(0, 0, width, height)
        canvas.dataset.pixelState = 'complete'
      }
    }

    animationFrame = window.requestAnimationFrame(renderPixels)
    return () => {
      clear()
      host.style.removeProperty('--trace-content-clip')
      window.removeEventListener('main-palette-change', syncColors)
    }
  }, [active, delay, duration])

  return <canvas className="trace-pixel-reveal" data-pixel-state="idle" ref={canvasRef} aria-hidden="true" />
}

function SectionPageContent({ page, source }) {
  if (!source) {
    return <p className="section-source-line"><span className="section-page-reference">{page.label}</span></p>
  }

  if (source.content && !source.documentPageImage) return <SourcePreviewContent source={source} fullPage />

  return (
    <figure className="section-page is-original-page" data-source-id={source.id}>
      <div className="trace-source-preview section-page-preview">
        <SourcePreviewContent source={source} fullPage />
      </div>
      <figcaption><span>{page.label}</span>{source.caption}</figcaption>
    </figure>
  )
}

function useProductLayoutQuery(query) {
  const [matches, setMatches] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia(query).matches
  ))

  useEffect(() => {
    const media = window.matchMedia(query)
    const sync = () => setMatches(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [query])

  return matches
}

function useMobileProductLayout() {
  return useProductLayoutQuery(MOBILE_PRODUCT_QUERY)
}

function MapFlowSvg({ className, viewBox, path, dots = [], clipProgress = 1, direction = 'vertical' }) {
  const clipStyle = clipProgress < 1
    ? (direction === 'horizontal'
      ? { clipPath: `inset(0 ${(1 - clipProgress) * 100}% 0 0)` }
      : { clipPath: `inset(0 0 ${(1 - clipProgress) * 100}% 0)` })
    : undefined

  return (
    <svg className={className} viewBox={viewBox} preserveAspectRatio="none" aria-hidden="true" style={clipStyle}>
      <path className="map-flow-stroke" d={path} />
      {dots.map(([x, y]) => (
        <circle
          className="map-flow-dot"
          cx={x}
          cy={y}
          r="2"
          key={`${x}-${y}`}
          style={{ opacity: clipProgress >= 0.85 ? 1 : 0 }}
        />
      ))}
    </svg>
  )
}

function DocumentBranchLine({ sectionCount, clipProgress = 1, nodeOffset = 0 }) {
  const forked = sectionCount >= 2
  const height = 37 + CONNECTION_LINE_EXTENSION
  const stem = (
    <MapFlowSvg
      className="document-branch-line-svg is-stem"
      viewBox={`0 0 10 ${height}`}
      path={`M5 0 V${height}`}
      dots={[[5, height]]}
      clipProgress={clipProgress}
    />
  )

  if (!forked) {
    return <div className="document-branch-line" aria-hidden="true">{stem}</div>
  }

  const width = SECTION_WIDTH * sectionCount + SECTION_GAP * (sectionCount - 1)
  const centers = Array.from({ length: sectionCount }, (_, index) => (
    SECTION_WIDTH / 2 + index * (SECTION_WIDTH + SECTION_GAP)
  ))
  const mid = width / 2 + nodeOffset
  const forkY = 16

  return (
    <div className="document-branch-line is-fork" aria-hidden="true">
      <MapFlowSvg
        className="document-branch-line-svg is-fork-path"
        viewBox={`0 0 ${width} ${height}`}
        path={`M${mid} 0 V${forkY} M${centers[0]} ${forkY} H${centers.at(-1)} ${centers.map(x => `M${x} ${forkY} V${height}`).join(' ')}`}
        dots={centers.map(x => [x, height])}
        clipProgress={clipProgress}
      />
      {stem}
    </div>
  )
}

function SectionToSourceLines({
  clipProgress = 1,
  opacity = 1,
  layout,
  className = '',
  heightExtension = 0,
  fork = false,
}) {
  const height = 32 + CONNECTION_LINE_EXTENSION + heightExtension
  const rootClassName = `stage-flow-row is-section-to-source${className ? ` ${className}` : ''}`

  if (fork) {
    const width = layout.sources.at(-1).center - layout.sources[0].center
    const mid = width / 2
    const forkY = height / 2
    return (
      <div className={`${rootClassName} is-workbook-fork`} aria-hidden="true" style={{ opacity, '--flow-width': `${layout.width}px` }}>
        <MapFlowSvg
          className="workbook-source-fork-svg"
          viewBox={`0 0 ${width} ${height}`}
          path={`M${mid} 0 V${forkY} M0 ${forkY} H${width} M0 ${forkY} V${height} M${mid} ${forkY} V${height} M${width} ${forkY} V${height}`}
          dots={[[mid, 0], [0, height], [mid, height], [width, height]]}
          clipProgress={clipProgress}
        />
      </div>
    )
  }

  return (
    <div className={rootClassName} aria-hidden="true" style={{ opacity }}>
      {layout.sources.map(source => (
        <div className="flow-line-slot" key={source.id} style={{ width: SECTION_WIDTH, '--source-gap': `${source.gap}px` }}>
          <MapFlowSvg
            className="stage-flow-line-svg"
            viewBox={`0 0 10 ${height}`}
            path={`M5 0 V${height}`}
            dots={[[5, 0], [5, height]]}
            clipProgress={clipProgress}
          />
        </div>
      ))}
    </div>
  )
}

function ConvergenceLine({ clipProgress = 1, layout, heightExtension = 0, showStartDots = true }) {
  const height = 40 + CONNECTION_LINE_EXTENSION + heightExtension
  const midY = 18
  const centers = layout.sources.map(source => source.center)
  const path = `${centers.map(x => `M${x} 0 V${midY}`).join(' ')} M${centers[0]} ${midY} H${centers.at(-1)} M${layout.width / 2} ${midY} V${height}`

  return (
    <div className="stage-convergence-row" aria-hidden="true" style={{ '--flow-width': `${layout.width}px` }}>
      <MapFlowSvg
        className="stage-convergence-line-svg"
        viewBox={`0 0 ${layout.width} ${height}`}
        path={path}
        dots={[...(showStartDots ? centers.map(x => [x, 0]) : []), [layout.width / 2, height]]}
        clipProgress={clipProgress}
      />
    </div>
  )
}

function SourcePreviewContent({ source, fullPage = false }) {
  if (fullPage && source.documentPageImage) {
    return (
      <Image
        className="product-pdf-image"
        src={source.documentPageImage}
        width={1224}
        height={1584}
        alt={`Original Word page ${source.documentPageNumber} — ${source.title}`}
      />
    )
  }

  if (source.content) {
    return (
      <div className="product-text-excerpt">
        {!fullPage && <strong>{source.extractedTitle ?? source.title}</strong>}
        <p>{fullPage ? source.content : source.extractedContent ?? source.content}</p>
        <span className="product-excerpt-source">{fullPage ? source.location : source.title}</span>
      </div>
    )
  }

  if (!fullPage && source.tables) {
    return (
      <div className="product-evidence-tables">
        {source.tables.map(table => (
          <table className="product-evidence-table" key={table.title}>
            <caption><strong>{table.title}</strong><span>{table.units}</span></caption>
            <thead><tr><th scope="col">{source.format === 'Excel' ? 'Metric' : ''}</th>{table.columns.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead>
            <tbody>{table.rows.map(row => (
              <tr key={row.label}>
                <th scope="row" className={row.indent ? 'is-subrow' : undefined}>{row.label}</th>
                {row.values.map((value, index) => <td key={index}>{value}</td>)}
              </tr>
            ))}</tbody>
          </table>
        ))}
      </div>
    )
  }

  if (!fullPage && source.id === 'attention-formula') {
    return (
      <div className="product-evidence-formula">
        <span className="product-equation-glyphs" role="img" aria-label="Attention(Q, K, V) = softmax(QKᵀ / √dₖ)V" />
      </div>
    )
  }

  const [width, height] = fullPage ? source.imageSize : source.regionSize
  return (
    <Image
      className="product-pdf-image"
      src={fullPage ? source.pageImage : source.regionImage}
      width={width}
      height={height}
      alt={`${source.filename} · PDF page ${source.page} · ${source.title}`}
    />
  )
}

function getThemeHierarchy(theme) {
  if (theme.format === 'Excel') {
    const sources = themeSourcesMap[theme.id]
    return [...new Set(sources.map(source => source.sheetName))].map((name, index) => ({
      source: name,
      locations: sources.filter(source => source.sheetName === name).map(source => `${source.title} · ${source.cellRange}`),
      isActive: index === 0,
    }))
  }
  return theme.documents.flatMap(document => (
    document.sections.map(section => {
      const page = section.pages[0]

      return {
        source: section.sheetName ? `${document.name} / ${section.sheetName}` : document.name,
        location: `${section.name} · ${page.label}`,
      }
    })
  )).map((item, index) => ({
    ...item,
    isActive: index === 0,
  }))
}

function CrossDocumentHierarchyCard({ activeThemeId, opacity = 1, translateY = 0, motionActive = false }) {
  const theme = themes.find(item => item.id === activeThemeId) ?? themes[0]
  const hierarchy = getThemeHierarchy(theme)
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <>
      <span className="trace-summary-label" id="trace-summary-title">Source-backed context</span>
      <aside
        className="trace-summary-card"
        data-trace-summary-card
        data-motion-active={motionActive ? 'true' : undefined}
        aria-labelledby="trace-summary-title"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          transition: reducedMotion ? 'none' : 'opacity 0.15s ease-out, transform 0.15s ease-out',
          pointerEvents: opacity > 0.5 ? 'auto' : 'none',
        }}
      >
        <div className="trace-card-content">
          <div className="trace-hierarchy" data-trace-summary>
            {theme.format === 'Excel' && <p className="product-workbook-name" translate="no">{theme.documents[0].name}</p>}
            <ul className="trace-hierarchy-list" translate="no">
              {hierarchy.map((item, index) => (
                <li
                  className={`trace-hierarchy-node${item.isActive ? ' is-active' : ''}`}
                  data-trace-hierarchy-index={index}
                  key={index}
                >
                  <svg className="trace-hierarchy-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M21 8V20.9932C21 21.5501 20.5552 22 20.0066 22H3.9934C3.44495 22 3 21.556 3 21.0082V2.9918C3 2.45531 3.4487 2 4.00221 2H14.9968L21 8ZM19 9H14V4H5V20H19V9ZM8 7H11V9H8V7ZM8 11H16V13H8V11ZM8 15H16V17H8V15Z" />
                  </svg>
                  <span className="trace-hierarchy-content">
                    <span data-trace-hierarchy-label title={item.source}>{item.source}</span>
                    {(item.locations ?? [item.location]).map(location => (
                      <span className="trace-hierarchy-detail" data-trace-hierarchy-detail key={location}>{location}</span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <TracePixelReveal active={motionActive} delay={400} />
      </aside>
    </>
  )
}

function CodeLines({ lines }) {
  return <code>{lines.map((line, index) => {
    const parts = line.split(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#.*$|\b(?:from|import|for|in|Knowhere|Path|parse|glob)\b|\b\d+\b)/g)
    return (
      <span className="product-code-line" data-line={index + 1} key={index}>
        <span className="product-code-line-content">{parts.map((part, partIndex) => {
          const type = part.startsWith('#') ? 'comment'
            : /^["']/.test(part) ? (/^\s*:/.test(parts[partIndex + 1] ?? '') ? 'key' : 'string')
              : /^(from|import|for|in)$/.test(part) ? 'keyword'
                : /^(Knowhere|Path|parse|glob)$/.test(part) ? 'function'
                  : /^\d+$/.test(part) ? 'number' : 'plain'
          return <span className={`product-code-${type}`} key={partIndex}>{part}</span>
        })}{'\n'}</span>
      </span>
    )
  })}</code>
}

function APIRequestCode({ activeThemeId }) {
  const theme = themes.find(item => item.id === activeThemeId) ?? themes[0]
  const folder = theme.label.toLowerCase().replaceAll(' ', '-')
  const lines = [
    '# pip install knowhere-python-sdk',
    'from pathlib import Path',
    'from knowhere import Knowhere',
    '',
    'client = Knowhere(api_key="sk-YOUR_API_KEY")',
    `documents = Path("${folder}").glob("*.${theme.extension}")`,
    'results = [client.parse(file=file) for file in documents]',
  ]

  return (
    <section className="product-request product-terminal" aria-label="Example Python request" translate="no">
      <pre className="product-request-code product-terminal-code" aria-live="polite">
        <HyperText renderText={text => <CodeLines lines={text.split('\n')} />}>
          {lines.join('\n')}
        </HyperText>
      </pre>
    </section>
  )
}

function RequestToDocumentLines({ theme, layout, firstDocumentOffset = 0 }) {
  let offset = 0
  const centers = theme.documents.map((document, documentIndex) => {
    const width = document.sections.length * SECTION_WIDTH + (document.sections.length - 1) * SECTION_GAP
    const center = offset + width / 2 + (documentIndex === 0 ? firstDocumentOffset : 0)
    offset += width + DOCUMENT_GAP
    return center
  })
  const path = `M${layout.width / 2} 0 V24 M${centers[0]} 24 H${centers.at(-1)} ${centers.map(x => `M${x} 24 V64`).join(' ')}`
  return (
    <div className="request-document-connection" data-parallel={theme.documents.length === 2 && theme.documents.every(document => document.sections.length === 1) ? 'true' : undefined} style={{ '--request-flow-width': `${layout.width}px` }}>
      <MapFlowSvg className="request-document-line" viewBox={`0 0 ${layout.width} 64`} path={path} dots={centers.map(x => [x, 64])} />
      <MapFlowSvg className="request-document-stem" viewBox="0 0 10 64" path="M5 0 V64" dots={[[5, 64]]} />
      <svg className="request-document-parallel" aria-hidden="true">
        <line className="map-flow-stroke" x1="50%" x2="50%" y1="0" y2="24" />
        <line className="map-flow-stroke" x1="0" x2="100%" y1="24" y2="24" />
        <line className="map-flow-stroke" x1="0" x2="0" y1="24" y2="64" />
        <line className="map-flow-stroke" x1="100%" x2="100%" y1="24" y2="64" />
        <circle className="map-flow-dot" cx="0" cy="64" r="2" />
        <circle className="map-flow-dot" cx="100%" cy="64" r="2" />
      </svg>
    </div>
  )
}

function APIOutputReport({
  documentCount = 0,
  project,
  format,
  opacity = 1,
  translateY = 0,
  motionActive = false,
  sources,
}) {
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const fields = format === 'Word' ? {
    file: sources[0].filename,
    texts: sources.map(source => ({ section: source.title, content: source.extractedContent ?? source.content })),
  } : format === 'Excel' ? {
    file: sources[0].filename,
    sheet: sources[0].sheetName,
    range: sources[0].cellRange,
    units: sources[0].tables[0].units,
    columns: ['Metric', ...sources[0].tables[0].columns],
    rows: sources[0].tables[0].rows.map(row => [row.label, ...row.values.map(value =>
      Number((Number(value.replace(/[$,%\s]/g, '')) / (value.includes('%') ? 100 : 1)).toFixed(6))
    )]),
  } : {
    project,
    summary: sources.map(source => source.summary).join(' '),
    citations: sources.map(source => source.citation),
    documents: documentCount,
    source_regions: sources.length,
  }

  return (
    <section
      className="ai-output-report product-terminal"
      translate="no"
      data-ai-summary-document
      data-motion-active={motionActive ? 'true' : undefined}
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        transition: reducedMotion ? 'none' : 'opacity 0.15s ease-out, transform 0.15s ease-out',
      }}
    >
      <div className="product-output-content">
        <div className="product-terminal-head">
          <span className="product-window-dots" aria-hidden="true"><i /><i /><i /></span>
        </div>
        <pre className="product-terminal-code" aria-label="Example API response" tabIndex={0}>
          <CodeLines lines={JSON.stringify(fields, null, 2).replace(/\[\n\s+([^\[\]{}]+?)\n\s*\]/g, (_, values) => `[${values.trim().replace(/\n\s+/g, ' ')}]`).split('\n')} />
        </pre>
      </div>
      <TracePixelReveal active={motionActive} delay={400} />
    </section>
  )
}

function WorkbookPreview({ sources }) {
  const [activeSheet, setActiveSheet] = useState(sources[0].sheetName)
  const source = sources.find(item => item.sheetName === activeSheet)
  const table = source.tables[0]
  const columns = ['A', 'B', 'C', 'D']
  const startRow = Number(source.cellRange.match(/A(\d+)/)[1])

  return (
    <div className="product-workbook-view" translate="no">
      <div className="product-workbook-formula" aria-label="Formula bar">
        <span>A1</span><span aria-hidden="true">ƒx</span><span>NVIDIA quarterly results</span>
      </div>
      <div className="product-workbook-scroll" role="region" aria-label={`${activeSheet} worksheet`} tabIndex={0}>
        <table className="product-workbook-grid">
          <caption className="sr-only">{activeSheet} worksheet preview</caption>
          <colgroup><col style={{ width: 40 }} /><col style={{ width: 260 }} /><col span="3" style={{ width: 140 }} /></colgroup>
          <thead><tr><th aria-label="Row number" />{columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
          <tbody>{Array.from({ length: 11 }, (_, index) => {
            const row = index + 1
            const mergedText = row === 1 ? 'NVIDIA quarterly results'
              : row === 2 ? 'Demo layout using published NVIDIA figures'
                : row === startRow - 1 ? `${table.title} (${table.units})` : null
            const record = table.rows[row - startRow - 1]
            const cells = row === startRow ? ['Metric', ...table.columns] : record ? [record.label, ...record.values] : []
            return <tr key={row} className={row === startRow ? 'is-table-heading' : undefined}>
              <th scope="row">{row}</th>
              {mergedText ? <td colSpan={4} className={row === 1 ? 'is-sheet-title' : 'is-sheet-note'}>{mergedText}</td>
                : columns.map((column, cellIndex) => <td key={column} className={cellIndex > 0 && record ? 'is-numeric' : undefined}>{cells[cellIndex] ?? ''}</td>)}
            </tr>
          })}</tbody>
        </table>
      </div>
      <div className="product-workbook-tabs" aria-label="Workbook sheets">
        {sources.map(item => <button type="button" key={item.sheetName} aria-pressed={activeSheet === item.sheetName} onClick={() => setActiveSheet(item.sheetName)}>{item.sheetName}</button>)}
      </div>
    </div>
  )
}

function DocumentMap({
  activeThemeId,
  animateEntrance = false,
  inactive = false,
  scrollProgress = 1,
}) {
  const isMobile = useMobileProductLayout()
  const isDesktop = useProductLayoutQuery(DESKTOP_PRODUCT_QUERY)
  const [selectedName, setSelectedName] = useState(null)
  const contentRef = useRef(null)
  const [summaryCameraShift, setSummaryCameraShift] = useState(SUMMARY_REVEAL_CAMERA_SHIFT)
  const activeTheme = themes.find(theme => theme.id === activeThemeId) ?? themes[0]
  const currentSources = themeSourcesMap[activeTheme.id] ?? themeSourcesMap[themes[0].id]
  const sourceLayout = getSourceLayout(activeTheme.documents)
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const showCrossDocumentLink = activeTheme.documents.length === 2
    && activeTheme.documents[0].sections.length >= 2
  const firstDocumentOffset = isDesktop && activeTheme.documents.length === 2
    ? (activeTheme.documents[1].sections.length - activeTheme.documents[0].sections.length)
      * (SECTION_WIDTH + SECTION_GAP) / 2
    : 0
  const sourceConnectionHeightExtension = isDesktop ? DESKTOP_SOURCE_CONNECTION_EXTENSION : 0

  useEffect(() => {
    setSelectedName(null)
  }, [activeThemeId])

  useLayoutEffect(() => {
    if (!isDesktop) return undefined
    const content = contentRef.current
    const stage = content.closest('.product-stage')
    const fitOutput = () => setSummaryCameraShift(Math.max(
      SUMMARY_REVEAL_CAMERA_SHIFT,
      content.offsetHeight - stage.clientHeight + 24,
    ))
    fitOutput()
    const observer = new ResizeObserver(fitOutput)
    observer.observe(content)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [activeThemeId, isDesktop])

  // The camera sequence needs desktop geometry; tablet and mobile use static evidence layouts.
  const p = reducedMotion || !isDesktop ? 1 : clamp(
    (scrollProgress - DOCUMENT_ENTRY_END_PROGRESS) / (1 - DOCUMENT_ENTRY_END_PROGRESS),
  )
  const progressBetween = (start, end) => clamp((p - start) / (end - start))
  const smoothProgressBetween = (start, end) => {
    const progress = progressBetween(start, end)
    return progress * progress * (3 - 2 * progress)
  }
  const pDocumentOutline = progressBetween(0, DOCUMENT_OUTLINE_END_PROGRESS)
  const pSecToSourceLine = progressBetween(
    DOCUMENT_EXTRACTION_START_PROGRESS,
    DOCUMENT_EXTRACTION_END_PROGRESS,
  )
  const pSourceCards = progressBetween(
    DOCUMENT_SOURCES_START_PROGRESS,
    DOCUMENT_SOURCES_END_PROGRESS,
  )
  const pSourceCamera = smoothProgressBetween(0.12, 0.30)
  const pHierarchyCamera = smoothProgressBetween(0.34, 0.54)
  const pSummaryCamera = smoothProgressBetween(0.56, 0.74)
  const cameraScale = isDesktop ? 1 : 903 / SUMMARY_REVEAL_CAMERA_SHIFT
  const scrollLinkedCameraShift = (
    DOCUMENT_ENTRY_CAMERA_SHIFT * clamp(scrollProgress / DOCUMENT_ENTRY_END_PROGRESS)
    + (SOURCE_REVEAL_CAMERA_SHIFT - DOCUMENT_ENTRY_CAMERA_SHIFT) * pSourceCamera
    + (HIERARCHY_REVEAL_CAMERA_SHIFT - SOURCE_REVEAL_CAMERA_SHIFT) * pHierarchyCamera
    + (summaryCameraShift - HIERARCHY_REVEAL_CAMERA_SHIFT) * pSummaryCamera
  ) * cameraScale
  const cameraShiftY = (reducedMotion || !isDesktop)
    ? 0
    : scrollLinkedCameraShift

  const pConvergenceLine = progressBetween(0.34, 0.46)
  const pHierarchyCard = progressBetween(0.42, 0.58)
  const pSummaryConnection = progressBetween(0.56, 0.66)
  const pSummaryDocument = progressBetween(0.62, DOCUMENT_HIERARCHY_END_PROGRESS)
  const activeStageIndex = Math.min(PRODUCT_STAGE_COUNT, Math.floor(p * PRODUCT_STAGE_COUNT))

  return (
    <section
      className="document-map"
      id="product-format-panel"
      role="tabpanel"
      aria-labelledby={`product-format-${activeTheme.id}`}
      data-format={activeTheme.format}
      data-animate-entrance={animateEntrance}
      data-product-stage-index={activeStageIndex}
      style={{ '--document-outline-clip': `${(1 - pDocumentOutline) * 100}%` }}
      inert={inactive ? '' : undefined}
    >
      <div className="document-map-hierarchy">
        <div className="document-map-hierarchy-canvas" data-document-count={activeTheme.documents.length} style={{ '--document-count': activeTheme.documents.length }}>
          <div
            className="document-map-content"
            ref={contentRef}
            key={activeTheme.id}
            aria-live="polite"
            style={{
              transform: `translateY(-${cameraShiftY}px)`,
              transition: 'none',
            }}
          >
            <div className="mobile-narrative-stage">
              <APIRequestCode activeThemeId={activeThemeId} />
              <RequestToDocumentLines theme={activeTheme} layout={sourceLayout} firstDocumentOffset={firstDocumentOffset} />
              {/* STAGE 1: Full-height source documents */}
              <div
                className="document-map-documents"
                data-document-count={activeTheme.documents.length}
                data-cross-link={showCrossDocumentLink ? 's2-s1' : undefined}
              >
              {activeTheme.documents.map((document, documentIndex) => {
                const documentSections = document.sections
                const nodeOffset = documentIndex === 0 ? firstDocumentOffset : 0

                return (
                <article
                  className={`document-branch${selectedName === document.name ? ' is-selected' : ''}`}
                  key={document.name}
                >
                  <header className="document-node" style={nodeOffset ? { transform: `translateX(${nodeOffset}px)` } : undefined}>
                    <span>{activeTheme.format === 'Excel' ? 'WORKBOOK' : 'DOCUMENT'} {documentIndex + 1}</span>
                    <strong title={document.title} translate="no">{document.name}</strong>
                  </header>
                  <DocumentBranchLine
                    sectionCount={activeTheme.format === 'Excel' ? 1 : documentSections.length}
                    clipProgress={1}
                    nodeOffset={nodeOffset}
                  />
                  {activeTheme.format === 'Excel' ? <WorkbookPreview sources={currentSources} /> : <div
                    className="document-sections"
                    data-section-count={documentSections.length}
                    style={{
                      '--section-count': documentSections.length,
                    }}
                  >
                    {documentSections.map((section, sectionIndex) => {
                      const visiblePages = isMobile ? section.pages.slice(0, 1) : section.pages
                      const [firstPage, ...remainingPages] = visiblePages
                      const firstPageSource = currentSources.find(source => source.id === firstPage.sourceId)
                      const [introCopy, ...supportingCopy] = Array.isArray(section.copy)
                        ? section.copy
                        : [section.copy]

                      return (
                        <a
                          className="section-node"
                          data-region={firstPageSource.type}
                          data-has-context={firstPageSource.context ? 'true' : undefined}
                          key={section.name}
                          href={firstPageSource.sourceUrl ?? firstPageSource.pageImage}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${document.name}, ${firstPageSource.location}`}
                          onClick={() => setSelectedName(document.name)}
                          translate="no"
                        >
                          <div className="section-node-head">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M6 2.75h8.5L19 7.25v14H6z" />
                              <path d="M14.5 2.75v4.5H19M9 11h7M9 14.5h7M9 18h4.5" />
                            </svg>
                            <span>{section.sheetName ? `SHEET · ${section.sheetName}` : `SECTION ${sectionIndex + 1}`}</span>
                            <strong>{section.name}</strong>
                          </div>
                          <div className="section-body">
                            {introCopy && <p>{introCopy}</p>}
                            {firstPageSource && <SectionPageContent page={firstPage} source={firstPageSource} />}
                            {supportingCopy.map((paragraph, index) => (
                              <p key={`${section.name}-copy-${index}`}>{paragraph}</p>
                            ))}
                            {firstPageSource.context && (
                              <div className="section-context">
                                <span className="section-context-source">Related text · PDF pages {firstPageSource.context.pages.join(', ')}</span>
                                {firstPageSource.context.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                              </div>
                            )}
                            {remainingPages.map(page => (
                              <SectionPageContent
                                page={page}
                                source={currentSources.find(source => source.id === page.sourceId)}
                                key={page.sourceId}
                              />
                            ))}
                          </div>
                        </a>
                      )
                    })}
                  </div>}
                </article>
                )
              })}
              {showCrossDocumentLink && (
                <div
                  className="cross-document-link"
                  aria-label="Relationship"
                >
                  <MapFlowSvg
                    className="cross-document-link-rail"
                    viewBox="0 0 101 20"
                    path="M0 10 H101 M0.5 0 V20 M100.5 0 V20"
                    clipProgress={1}
                    direction="horizontal"
                  />
                  <span>
                    Relationship
                  </span>
                </div>
              )}
              </div>

              {/* STAGE 2: Extraction lines from the source documents */}
              <SectionToSourceLines
                clipProgress={pSecToSourceLine}
                opacity={1}
                layout={sourceLayout}
                className={isMobile ? 'mobile-source-connection' : ''}
                heightExtension={sourceConnectionHeightExtension}
                fork={activeTheme.format === 'Excel' && !isMobile}
              />

              {/* STAGES 2–4: Extracted source-region cards and relationship */}
              <div
                className="source-sections"
                data-source-count={currentSources.length}
                data-document-count={activeTheme.documents.length}
                style={{
                  opacity: pSourceCards,
                  transform: `translateY(${(1 - pSourceCards) * 18}px)`,
                  transition: 'none',
                  pointerEvents: pSourceCards > 0.5 ? 'auto' : 'none',
                }}
              >
              {currentSources.map((source, index) => {
                const isPrimary = index === 0
                const slot = isPrimary ? 'primary' : index === 1 ? 'secondary-one' : 'secondary-two'
                return (
                  <figure
                    className="trace-source-card"
                    translate="no"
                    key={source.id}
                    data-source-slot={slot}
                    data-region={source.type}
                    data-orientation={source.regionSize[1] > source.regionSize[0] ? 'portrait' : 'landscape'}
                    data-motion-active={animateEntrance && isDesktop && pSourceCards > 0.05 ? 'true' : undefined}
                    style={{
                      '--trace-motion-delay': `${index * 70}ms`,
                      '--source-gap': `${sourceLayout.sources[index].gap}px`,
                    }}
                  >
                    <div className="trace-card-content">
                      <figcaption>
                        <span className="trace-folder-tab">
                          {source.type.toUpperCase()}<span className="mobile-source-index">{source.type !== 'text' && ` ${String(index + 1).padStart(2, '0')}`}</span>
                        </span>
                        <span data-trace-coordinate>{source.format} · {source.location}</span>
                      </figcaption>
                      <a className="trace-source-thumb" href={source.sourceUrl ?? source.pageImage} target="_blank" rel="noopener noreferrer" aria-label={`Open ${source.filename}, ${source.location}`}>
                        <div className="trace-source-frame">
                          <div className="trace-source-media">
                            <div className="trace-source-preview">
                              <SourcePreviewContent source={source} />
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                    {isDesktop && <span className="source-evidence-tail" aria-hidden="true" style={{ opacity: pConvergenceLine }} />}
                    <TracePixelReveal
                      active={animateEntrance && isDesktop && pSourceCards > 0.05}
                      delay={index * 70}
                    />
                  </figure>
                )
              })}
              </div>

              {/* STAGE 3: Source convergence and document hierarchy */}
              <ConvergenceLine
                clipProgress={pConvergenceLine}
                layout={sourceLayout}
                heightExtension={sourceConnectionHeightExtension}
                showStartDots={!isDesktop}
              />

              <div
                className="mobile-summary-item"
              >
                <CrossDocumentHierarchyCard
                  activeThemeId={activeTheme.id}
                  opacity={pHierarchyCard}
                  translateY={(1 - pHierarchyCard) * 18}
                  motionActive={animateEntrance && isDesktop && pHierarchyCard > 0.05}
                />
              </div>

              <MapFlowSvg
                className="hierarchy-summary-connection"
                viewBox={`0 0 10 ${48 + CONNECTION_LINE_EXTENSION}`}
                path={`M5 0 V${48 + CONNECTION_LINE_EXTENSION}`}
                dots={[[5, 0], [5, 48 + CONNECTION_LINE_EXTENSION]]}
                clipProgress={pSummaryConnection}
              />
            </div>

            <APIOutputReport
              documentCount={activeTheme.documents.length}
              project={activeTheme.label}
              format={activeTheme.format}
              opacity={pSummaryDocument}
              translateY={(1 - pSummaryDocument) * 18}
              motionActive={animateEntrance && isDesktop && pSummaryDocument > 0.05}
              sources={currentSources}
            />

          </div>
        </div>
      </div>
    </section>
  )
}

function DocumentMapSwitcher({ activeThemeId, onChange }) {
  return (
    <div className="document-map-switcher" role="tablist" aria-label="Choose a file format">
      {themes.map(theme => {
        return (
          <button
            type="button"
            key={theme.id}
            id={`product-format-${theme.id}`}
            role="tab"
            aria-controls="product-format-panel"
            aria-selected={theme.id === activeThemeId}
            aria-pressed={theme.id === activeThemeId}
            tabIndex={theme.id === activeThemeId ? 0 : -1}
            onClick={() => onChange(theme.id)}
            onKeyDown={event => {
              const index = themes.indexOf(theme)
              const next = event.key === 'ArrowRight' ? (index + 1) % themes.length
                : event.key === 'ArrowLeft' ? (index + themes.length - 1) % themes.length
                  : event.key === 'Home' ? 0 : event.key === 'End' ? themes.length - 1 : null
              if (next === null) return
              event.preventDefault()
              onChange(themes[next].id)
              event.currentTarget.parentElement.children[next].focus()
            }}
          >
            <Image src={theme.icon} alt="" width={20} height={20} unoptimized />
            <span translate="no">{theme.format}</span>
          </button>
        )
      })}
    </div>
  )
}

export function ProductStage({ heading }) {
  const isMobile = useMobileProductLayout()
  const isDesktop = useProductLayoutQuery(DESKTOP_PRODUCT_QUERY)
  const [activeThemeId, setActiveThemeId] = useState(themes[0].id)
  const [animateEntrance, setAnimateEntrance] = useState(true)
  const visitedThemesRef = useRef(new Set([themes[0].id]))
  const [scrollProgress, setScrollProgress] = useState(0)
  const trackRef = useRef(null)
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: [`start ${PRODUCT_STICKY_TOP}px`, 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', latest => {
    setScrollProgress(reducedMotion || !isDesktop ? 1 : clamp(latest))
  })

  useEffect(() => {
    setScrollProgress(reducedMotion || !isDesktop ? 1 : clamp(scrollYProgress.get()))
  }, [isDesktop, reducedMotion, scrollYProgress])

  const changeTheme = themeId => {
    if (themeId === activeThemeId) return
    setAnimateEntrance(!visitedThemesRef.current.has(themeId))
    visitedThemesRef.current.add(themeId)
    setActiveThemeId(themeId)
  }

  return (
    <>
      {heading}
      <div
        className="playground-scroll-track"
        ref={trackRef}
        style={{ '--product-stage-scroll-distance': `${PRODUCT_STAGE_COUNT * PRODUCT_STAGE_SCROLL_VH}svh` }}
      >
        <div className="playground-sticky">
          <div className="product-stage-switcher-row">
            <DocumentMapSwitcher activeThemeId={activeThemeId} onChange={changeTheme} />
          </div>
          <div className={`product-stage${isMobile ? ' is-stacked' : ''}`}>
            <div className="product-stage-track">
              <DocumentMap
                activeThemeId={activeThemeId}
                animateEntrance={animateEntrance}
                scrollProgress={scrollProgress}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
