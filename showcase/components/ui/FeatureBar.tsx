"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface FeatureBarProps {
  name: string;
  importance: number;
  description: string;
  index: number;
  maxImportance: number;
}

export function FeatureBar({
  name,
  importance,
  description,
  index,
  maxImportance,
}: FeatureBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const widthPercent = (importance / maxImportance) * 100;

  const getBarColor = (imp: number) => {
    if (imp >= 20) return "from-accent to-cyan-400";
    if (imp >= 5) return "from-accent/70 to-cyan-400/70";
    return "from-accent/50 to-cyan-400/50";
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted w-5 text-right">
            {index + 1}.
          </span>
          <span className="text-sm font-semibold text-text">{name}</span>
        </div>
        <span className="text-sm font-mono font-bold text-accent">
          {importance.toFixed(1)}%
        </span>
      </div>
      <div className="ml-8 h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${widthPercent}%` } : { width: 0 }}
          transition={{
            duration: 1.2,
            delay: index * 0.08 + 0.3,
            ease: [0.4, 0, 0.2, 1],
          }}
          className={`h-full rounded-full bg-gradient-to-r ${getBarColor(importance)}`}
          style={{
            boxShadow:
              importance >= 20
                ? "0 0 12px rgba(14,165,233,0.4)"
                : "none",
          }}
        />
      </div>
      <p className="ml-8 mt-1 text-xs text-muted/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {description}
      </p>
    </motion.div>
  );
}
