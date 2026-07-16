"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface MetricCardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  color?: "accent" | "high" | "medium" | "low";
  delay?: number;
}

const colorMap = {
  accent: {
    text: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
    glow: "0 0 30px rgba(14,165,233,0.15)",
  },
  high: {
    text: "text-high",
    bg: "bg-high/10",
    border: "border-high/20",
    glow: "0 0 30px rgba(244,63,94,0.15)",
  },
  medium: {
    text: "text-medium",
    bg: "bg-medium/10",
    border: "border-medium/20",
    glow: "0 0 30px rgba(245,158,11,0.15)",
  },
  low: {
    text: "text-low",
    bg: "bg-low/10",
    border: "border-low/20",
    glow: "0 0 30px rgba(16,185,129,0.15)",
  },
};

export function MetricCard({
  label,
  value,
  suffix = "",
  prefix = "",
  color = "accent",
  delay = 0,
}: MetricCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const colors = colorMap[color];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className={`glass-card p-6 ${colors.border} border`}
      style={{ boxShadow: colors.glow }}
    >
      <div className={`text-xs font-semibold tracking-wider uppercase text-muted mb-2`}>
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        {prefix && (
          <span className={`text-lg font-mono font-bold ${colors.text}`}>
            {prefix}
          </span>
        )}
        <span className={`text-4xl font-mono font-bold ${colors.text}`}>
          {isInView ? (
            <CountUp target={value} suffix={suffix} />
          ) : (
            `0${suffix}`
          )}
        </span>
      </div>
    </motion.div>
  );
}

function CountUp({
  target,
  suffix,
}: {
  target: number;
  suffix: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <span ref={ref}>
      {isInView ? <AnimatedNumber target={target} /> : "0"}
      {suffix}
    </span>
  );
}

function AnimatedNumber({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 1 }}
      animate={isInView ? { opacity: 1 } : {}}
    >
      <CountUpAnimation target={target} inView={isInView} />
    </motion.span>
  );
}

function CountUpAnimation({
  target,
  inView,
}: {
  target: number;
  inView: boolean;
}) {
  const ref = useRef<number | null>(null);

  if (!inView) return "0";

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
    >
      <CountUpInner target={target} />
    </motion.span>
  );
}

function CountUpInner({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  if (typeof window !== "undefined" && !hasAnimated.current) {
    hasAnimated.current = true;
    const start = performance.now();
    const duration = 1500;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      if (ref.current) {
        ref.current.textContent = current.toFixed(1);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  return <span ref={ref}>0</span>;
}
