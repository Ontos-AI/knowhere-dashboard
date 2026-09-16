// @ts-nocheck
"use client";

import { useEffect, useRef } from "react";

export default function ShinyText({
  text,
  speed = 2,
  delay = 0,
  color = 'currentColor',
  shineColor = 'var(--figma-primary)',
  spread = 120,
  direction = 'left',
  yoyo = false,
  pauseOnHover = false,
  className = '',
}) {
  const textRef = useRef(null)

  useEffect(() => {
    const element = textRef.current
    if (!element) return undefined

    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      element.classList.add('is-shine-complete')
      return undefined
    }

    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      element.classList.add('is-shining')
      observer.disconnect()
    }, { threshold: 0, rootMargin: '0px 0px -20% 0px' })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const startPosition = direction === 'right' ? '-120%' : '120%'
  const endPosition = direction === 'right' ? '120%' : '-120%'

  return (
    <span
      ref={textRef}
      className={`shiny-text${yoyo ? ' shiny-text--yoyo' : ''}${pauseOnHover ? ' shiny-text--pause-on-hover' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--shiny-color': color,
        '--shiny-shine-color': shineColor,
        '--shiny-spread': `${spread}px`,
        '--shiny-duration': `${speed}s`,
        '--shiny-delay': `${delay}s`,
        '--shiny-start': startPosition,
        '--shiny-end': endPosition,
      }}
    >
      {text}
    </span>
  )
}
