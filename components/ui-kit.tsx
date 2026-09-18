"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { DURATION, EASE, transition, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * A number that counts up when it scrolls into view.
 *
 * Driven by a MotionValue rather than React state: a `setState` tween inside
 * an effect trips this repo's `react-hooks/set-state-in-effect` rule, and it
 * would re-render the whole subtree on every frame.
 *
 * It holds at `from` until the element enters the viewport, then tweens to
 * `value`. It also re-runs when `value` changes while already in view, which
 * is what makes it work with persisted progress: the tile mounts showing 0,
 * localStorage rehydrates a moment later, and the counter rolls up to the
 * real figure rather than snapping.
 *
 * `tabular-nums` on the span keeps the width steady so the layout doesn't
 * jitter as the digits change.
 */
export function AnimatedNumber({
  value,
  from = 0,
  className,
}: {
  value: number;
  from?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, viewportOnce);
  const raw = useMotionValue(from);
  const text = useTransform(raw, (v) => Math.round(v).toLocaleString());

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(raw, value, {
      duration: reduced ? 0 : DURATION.slow * 1.6,
      ease: EASE,
    });
    return () => controls.stop();
  }, [inView, raw, reduced, value]);

  return (
    <motion.span ref={ref} className={cn("tabular-nums", className)}>
      {text}
    </motion.span>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground text-th mt-1.5 text-sm sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

/**
 * A labelled bar. Used for the dashboard's three daily meters and the
 * progress page's skill list, so they read as one component.
 */
export function MeterRow({
  label,
  value,
  hint,
  tone = "primary",
}: {
  label: string;
  value: number;
  hint?: string;
  tone?: "primary" | "chart-2" | "chart-3" | "chart-4";
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const fill = {
    primary: "bg-primary",
    "chart-2": "bg-chart-2",
    "chart-3": "bg-chart-3",
    "chart-4": "bg-chart-4",
  }[tone];

  // `useInView` + `animate` rather than `whileInView`: a once-only
  // `whileInView` fires and then ignores later value changes, so a bar would
  // freeze at its first reading after, say, completing a lesson. This reveals
  // on scroll *and* keeps tracking.
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, viewportOnce);

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-muted-foreground text-xs font-semibold tabular-nums">
          {hint ?? `${clamped}%`}
        </span>
      </div>
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="bg-muted h-2 overflow-hidden rounded-full"
      >
        {/*
          Motion owns this width now — the previous `transition-[width]`
          utility would fight it and produce stutter.
        */}
        <motion.div
          className={cn("h-full rounded-full", fill)}
          initial={{ width: 0 }}
          animate={{ width: inView ? `${clamped}%` : 0 }}
          transition={{ duration: DURATION.slow, ease: EASE }}
        />
      </div>
    </div>
  );
}

/** Circular meter for the three "Today's Progress" tiles (§23). */
export function ProgressRing({
  value,
  label,
  tone = "primary",
}: {
  value: number;
  label: string;
  tone?: "primary" | "chart-2" | "chart-3";
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const stroke = {
    primary: "stroke-primary",
    "chart-2": "stroke-chart-2",
    "chart-3": "stroke-chart-3",
  }[tone];

  return (
    <Card className="border-border/70 shadow-none">
      <CardContent className="flex flex-col items-center gap-2 px-3 py-5">
        <div className="relative grid place-items-center">
          <svg viewBox="0 0 64 64" className="size-16 -rotate-90">
            <circle
              cx="32"
              cy="32"
              r={radius}
              className="stroke-muted fill-none"
              strokeWidth="6"
            />
            <motion.circle
              cx="32"
              cy="32"
              r={radius}
              className={cn("fill-none", stroke)}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference * (1 - clamped / 100) }}
              transition={{ duration: DURATION.slow * 1.4, ease: EASE }}
            />
          </svg>
          <span className="absolute text-sm font-bold tabular-nums">
            {clamped}%
          </span>
        </div>
        <span className="text-muted-foreground text-center text-xs font-medium">
          {label}
        </span>
      </CardContent>
    </Card>
  );
}

export function StatTile({
  icon,
  value,
  label,
  className,
  /** Pass a number to have it count up instead of appearing. */
  countTo,
  suffix,
}: {
  icon?: React.ReactNode;
  value?: React.ReactNode;
  label: string;
  className?: string;
  countTo?: number;
  suffix?: string;
}) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={transition}>
      <Card className={cn("border-border/70 h-full shadow-none", className)}>
        <CardContent className="px-4 py-4">
          {icon && <div className="text-primary mb-2">{icon}</div>}
          <div className="text-2xl font-bold tracking-tight tabular-nums">
            {countTo !== undefined ? (
              <>
                <AnimatedNumber value={countTo} />
                {suffix}
              </>
            ) : (
              value
            )}
          </div>
          <div className="text-muted-foreground mt-0.5 text-xs font-medium">
            {label}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/** Shown when a list has nothing in it yet — never an error, always a nudge. */
export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="border-border/70 flex flex-col items-center rounded-2xl border border-dashed px-6 py-12 text-center">
      {icon && <div className="text-muted-foreground mb-3">{icon}</div>}
      <p className="font-semibold">{title}</p>
      {body && (
        <p className="text-muted-foreground text-th mt-1.5 max-w-sm text-sm">
          {body}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
