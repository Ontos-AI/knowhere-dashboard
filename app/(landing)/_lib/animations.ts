/**
 * Animation Variants for Framer Motion
 * Centralized animation configurations for consistency
 */

import type { Variants } from "framer-motion";

// Timing constants
export const timings = {
  instant: 0,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  verySlow: 1,
} as const;

// Easing functions
export const easings = {
  easeOut: [0.16, 1, 0.3, 1] as const,
  easeIn: [0.4, 0, 1, 1] as const,
  easeInOut: [0.4, 0, 0.2, 1] as const,
  spring: { type: "spring" as const, stiffness: 260, damping: 20 },
} as const;

// Standard fade-in animation
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Fade in from bottom (most common)
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 60 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: timings.slow,
      ease: easings.easeOut,
    },
  },
  exit: { opacity: 0, y: 20 },
};

// Fade in from top
export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -60 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: timings.slow,
      ease: easings.easeOut,
    },
  },
  exit: { opacity: 0, y: -20 },
};

// Fade in from left
export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -60 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: timings.slow,
      ease: easings.easeOut,
    },
  },
  exit: { opacity: 0, x: -20 },
};

// Fade in from right
export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 60 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: timings.slow,
      ease: easings.easeOut,
    },
  },
  exit: { opacity: 0, x: 20 },
};

// Scale in animation
export const scaleIn: Variants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: timings.normal,
      ease: easings.easeOut,
    },
  },
  exit: { scale: 0.9, opacity: 0 },
};

// Stagger container (for lists/grids)
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Stagger item (use with staggerContainer)
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: timings.slow,
      ease: easings.easeOut,
    },
  },
};

// Slide in from right (for drawers/panels)
export const slideInRight: Variants = {
  initial: { x: "100%" },
  animate: {
    x: 0,
    transition: {
      duration: timings.normal,
      ease: easings.easeOut,
    },
  },
  exit: {
    x: "100%",
    transition: {
      duration: timings.fast,
      ease: easings.easeIn,
    },
  },
};

// Slide in from left
export const slideInLeft: Variants = {
  initial: { x: "-100%" },
  animate: {
    x: 0,
    transition: {
      duration: timings.normal,
      ease: easings.easeOut,
    },
  },
  exit: {
    x: "-100%",
    transition: {
      duration: timings.fast,
      ease: easings.easeIn,
    },
  },
};

// Rotate and scale in (for icons/badges)
export const rotateScaleIn: Variants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: easings.spring,
  },
};

// Pulse animation (for badges/notifications)
export const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
};

// Hover scale effect
export const hoverScale = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: timings.fast,
      ease: easings.easeOut,
    },
  },
  tap: { scale: 0.98 },
};

// 3D tilt effect on hover (for cards)
export const tiltHover = {
  rest: {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: timings.fast,
      ease: easings.easeOut,
    },
  },
};

// Shimmer/sweep effect (for loading states)
export const shimmer: Variants = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      ease: "linear",
    },
  },
};

// Float animation (for floating elements)
export const float: Variants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
};

// Typing indicator animation
export const typingDot: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
};

// Page transition
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: timings.slow,
      ease: easings.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: timings.normal,
      ease: easings.easeIn,
    },
  },
};

// Utility: Create custom stagger with delay
export const createStagger = (staggerChildren = 0.1, delayChildren = 0) => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

// Utility: Create custom fade in up with delay
export const createFadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 60 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: timings.slow,
      ease: easings.easeOut,
      delay,
    },
  },
});
