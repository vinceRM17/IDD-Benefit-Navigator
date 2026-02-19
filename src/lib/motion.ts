import type { Variants } from "motion/react";

// Detect user's motion preference
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Duration constants (in seconds)
export const duration = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  page: 0.4,
} as const;

// Easing curves
export const easing = {
  easeOut: [0.16, 1, 0.3, 1] as const,
  easeInOut: [0.42, 0, 0.58, 1] as const,
  spring: { type: "spring", stiffness: 300, damping: 24 } as const,
} as const;

// Page transition — fade + slight upward slide
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.page, ease: easing.easeOut },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: duration.fast, ease: easing.easeInOut },
  },
};

// Fade in (for sections loading into view)
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: duration.normal, ease: easing.easeOut },
  },
};

// Slide up (for cards, list items)
export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal, ease: easing.easeOut },
  },
};

// Stagger children (for lists of cards)
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Scale on hover (for interactive cards)
export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring", stiffness: 400, damping: 17 },
} as const;

// Button micro-interaction
export const buttonPress = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
  transition: { type: "spring", stiffness: 500, damping: 20 },
} as const;

// Focus ring glow animation (CSS class applied via Tailwind)
export const FOCUS_RING_CLASS = "focus-ring-glow";
