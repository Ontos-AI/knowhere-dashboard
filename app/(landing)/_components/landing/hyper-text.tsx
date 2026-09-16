// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

// Magic UI HyperText's progressive scramble, adapted for case-sensitive code.
// https://magicui.design/docs/components/hyper-text
export function HyperText({ children, active = true, duration = 800, renderText }) {
  const reducedMotion = useReducedMotion()
  const [displayText, setDisplayText] = useState(children)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setDisplayText(children)
    if (!active || reducedMotion) {
      setIsAnimating(false)
      return undefined
    }

    setIsAnimating(true)
    const start = performance.now()
    let frame
    const animate = now => {
      const progress = Math.min((now - start) / duration, 1)
      const revealed = Math.floor(progress * children.length)
      setDisplayText(Array.from(children, (letter, index) => (
        /[^a-zA-Z0-9]/.test(letter) || index <= revealed
          ? letter
          : CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
      )).join(''))
      if (progress < 1) frame = requestAnimationFrame(animate)
      else setIsAnimating(false)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [children, active, duration, reducedMotion])

  return (
    <span aria-busy={isAnimating}>
      {renderText ? renderText(displayText) : displayText}
    </span>
  )
}
