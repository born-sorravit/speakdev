import type { Transition, Variants } from "motion/react";

/**
 * One motion vocabulary for the whole app.
 *
 * The brief asks for "minimal, not childish, suitable for adults" (§22), and
 * a learner sees these transitions dozens of times per session — so: short
 * durations, ease-out curves, and no bounce or overshoot anywhere. Movement
 * is small (8–16px) and exists to show where something came from, never to
 * draw attention to itself.
 *
 * Reduced motion is handled globally by `<MotionConfig reducedMotion="user">`
 * in `components/providers.tsx`, so nothing here needs to branch on it.
 */

export const DURATION = {
  fast: 0.18,
  base: 0.26,
  slow: 0.42,
} as const;

/** Ease-out quint: quick departure, soft landing, no overshoot. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const transition: Transition = {
  duration: DURATION.base,
  ease: EASE,
};

export const fastTransition: Transition = {
  duration: DURATION.fast,
  ease: EASE,
};

/** Content arriving: a small lift into place. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition },
};

/**
 * Parent for a list or grid whose children should arrive in sequence.
 * Pair with `fadeUp` on each child.
 */
export function staggerContainer(stagger = 0.06, delay = 0): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
}

/**
 * Lesson stages and other full-panel swaps.
 *
 * Used with `AnimatePresence mode="wait"` so the outgoing panel is gone
 * before the next arrives — without it both panels are briefly in the DOM,
 * which lets a click land on the stage the learner just left.
 */
export const panelSwap: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition },
  exit: { opacity: 0, y: -8, transition: fastTransition },
};

/** A chat message arriving. Slight scale so it reads as "appearing", not sliding. */
export const messageIn: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition },
};

/**
 * The correction panel. Marginally slower and softer than everything else —
 * this is the moment the learner finds out they made a mistake (§28), so it
 * should feel like help arriving rather than a verdict landing.
 */
export const feedbackIn: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASE },
  },
};

/** Default `viewport` for scroll reveals: fire once, slightly before entry. */
export const viewportOnce = { once: true, margin: "-60px" } as const;
