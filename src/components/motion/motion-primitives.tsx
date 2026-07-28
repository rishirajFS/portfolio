"use client";

/**
 * Motion primitives.
 *
 * Every animated thing on the site composes from these five components, so
 * timing and easing stay consistent and there is exactly one place to tune
 * them. All of them honor prefers-reduced-motion: rather than animating
 * faster, they render the final state immediately and skip the transition.
 *
 * Durations/easings mirror the tokens in styles/tokens.css. They are duplicated
 * here as numbers because Framer Motion needs real values, not CSS vars, so
 * keep the two in sync if you retune.
 */

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionProps,
  type Variants,
} from "motion/react";
import { useRef, type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/cn";

/* -------------------------------------------------------------------- timing */

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const;

export const DUR = {
  fast: 0.15,
  base: 0.25,
  slow: 0.42,
  slower: 0.7,
} as const;

/* -------------------------------------------------------------------- Reveal */

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds. Prefer <Stagger> over hand-tuning this. */
  delay?: number;
  duration?: number;
  /** Travel distance in px. Negative moves down-to-up. */
  y?: number;
  x?: number;
  /** Fraction of the element that must be visible to trigger. */
  amount?: number;
  once?: boolean;
  as?: ElementType;
  blur?: boolean;
};

/**
 * Fades and lifts a block into view once it scrolls into the viewport.
 * The workhorse. Most sections wrap their children in this.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = DUR.slow,
  y = 14,
  x = 0,
  amount = 0.25,
  once = true,
  as = "div",
  blur = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once, amount });
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  if (reduced) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y,
        x,
        filter: blur ? "blur(6px)" : undefined,
      }}
      animate={
        inView
          ? { opacity: 1, y: 0, x: 0, filter: blur ? "blur(0px)" : undefined }
          : undefined
      }
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </MotionTag>
  );
}

/* ------------------------------------------------------------------- Stagger */

const staggerParent = (stagger: number, delay: number): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: DUR.slow, ease: EASE_OUT } },
};

/**
 * Reveals children in sequence. Wrap each child in <StaggerItem>.
 * Cheaper and more consistent than giving every child its own delay.
 */
export function Stagger({
  children,
  className,
  stagger = 0.06,
  delay = 0,
  amount = 0.15,
  once = true,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  amount?: number;
  once?: boolean;
  as?: ElementType;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once, amount });
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  if (reduced) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      ref={ref}
      className={className}
      variants={staggerParent(stagger, delay)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
  ...rest
}: { children: ReactNode; className?: string; as?: ElementType } & MotionProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  if (reduced) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag className={className} variants={staggerChild} {...rest}>
      {children}
    </MotionTag>
  );
}

/* --------------------------------------------------------------- TextReveal */

/**
 * Reveals a headline word by word from below a clipping mask.
 * Reserved for the hero and section titles, since it loses its effect if overused.
 */
export function TextReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.045,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  as?: ElementType;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden align-bottom"
            style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}
          >
            <motion.span
              className={cn("inline-block", wordClassName)}
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: DUR.slower,
                delay: delay + i * stagger,
                ease: EASE_OUT,
              }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}

/* ------------------------------------------------------------------ Parallax */

/**
 * Translates a decorative layer against scroll. Keep `distance` small. Over
 * ~80px it reads as a glitch rather than depth.
 */
export function Parallax({
  children,
  className,
  distance = 40,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ Magnetic */

/**
 * Nudges an element toward the cursor. Used only on primary CTAs.
 * Pointer-driven, so it is inert on touch devices by construction.
 */
export function Magnetic({
  children,
  className,
  strength = 0.25,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 260, damping: 22 });
  const y = useSpring(0, { stiffness: 260, damping: 22 });

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ----------------------------------------------------------- ScrollProgress */

/** Hairline progress bar for the top of the viewport. */
export function ScrollProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 h-px origin-left bg-accent",
        className,
      )}
      style={{ scaleX }}
    />
  );
}
