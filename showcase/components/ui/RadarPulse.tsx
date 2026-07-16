"use client";

import { motion } from "framer-motion";

interface RadarPulseProps {
  size?: number;
  className?: string;
}

export function RadarPulse({ size = 320, className = "" }: RadarPulseProps) {
  const rings = [0, 1, 2];
  const center = size / 2;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(14,165,233,0.12) 0%, rgba(14,165,233,0.03) 50%, transparent 70%)",
        }}
      />

      {/* Static grid lines */}
      <svg
        width={size}
        height={size}
        className="absolute inset-0"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Concentric static circles */}
        {[0.2, 0.4, 0.6, 0.8].map((scale, i) => (
          <circle
            key={`static-${i}`}
            cx={center}
            cy={center}
            r={center * scale}
            fill="none"
            stroke="rgba(14,165,233,0.08)"
            strokeWidth="1"
          />
        ))}
        {/* Cross lines */}
        <line
          x1={center}
          y1={0}
          x2={center}
          y2={size}
          stroke="rgba(14,165,233,0.06)"
          strokeWidth="1"
        />
        <line
          x1={0}
          y1={center}
          x2={size}
          y2={center}
          stroke="rgba(14,165,233,0.06)"
          strokeWidth="1"
        />
        {/* Diagonal lines */}
        <line
          x1={center * 0.3}
          y1={center * 0.3}
          x2={center * 1.7}
          y2={center * 1.7}
          stroke="rgba(14,165,233,0.04)"
          strokeWidth="1"
        />
        <line
          x1={center * 1.7}
          y1={center * 0.3}
          x2={center * 0.3}
          y2={center * 1.7}
          stroke="rgba(14,165,233,0.04)"
          strokeWidth="1"
        />
      </svg>

      {/* Animated pulse rings */}
      {rings.map((i) => (
        <motion.div
          key={`pulse-${i}`}
          className="absolute rounded-full border border-accent/40"
          style={{
            width: size * 0.5,
            height: size * 0.5,
            left: center - (size * 0.5) / 2,
            top: center - (size * 0.5) / 2,
          }}
          animate={{
            scale: [0.5, 2.5],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Center dot */}
      <motion.div
        className="absolute rounded-full bg-accent"
        style={{
          width: 12,
          height: 12,
          left: center - 6,
          top: center - 6,
          boxShadow: "0 0 20px rgba(14,165,233,0.6), 0 0 40px rgba(14,165,233,0.3)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Scanning line */}
      <motion.div
        className="absolute"
        style={{
          width: center,
          height: 2,
          left: center,
          top: center - 1,
          transformOrigin: "0% 50%",
          background:
            "linear-gradient(90deg, rgba(14,165,233,0.6) 0%, transparent 100%)",
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* District dots */}
      {[
        { x: 0.35, y: 0.25, label: "Rangpur", delay: 0.5 },
        { x: 0.65, y: 0.2, label: "Sylhet", delay: 1.0 },
        { x: 0.2, y: 0.5, label: "Rajshahi", delay: 1.5 },
        { x: 0.5, y: 0.5, label: "Dhaka", delay: 2.0 },
        { x: 0.75, y: 0.45, label: "Chittagong", delay: 2.5 },
        { x: 0.35, y: 0.7, label: "Khulna", delay: 3.0 },
        { x: 0.6, y: 0.75, label: "Barisal", delay: 3.5 },
      ].map((dot, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute"
          style={{
            left: size * dot.x - 3,
            top: size * dot.y - 3,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: dot.delay,
            ease: "easeInOut",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
        </motion.div>
      ))}
    </div>
  );
}
