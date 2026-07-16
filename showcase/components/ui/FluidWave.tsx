"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

interface FluidWaveProps {
  className?: string;
}

export function FluidWave({ className = "" }: FluidWaveProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`relative w-full h-[600px] overflow-hidden ${className}`}>
      {/* Bottom edge fade — adapts to theme */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-30 pointer-events-none"
        style={{
          background: isDark
            ? "linear-gradient(to bottom, transparent 0%, #030712 100%)"
            : "linear-gradient(to bottom, transparent 0%, #f8fafc 100%)",
        }}
      />

      {/* Deep background glow — subtle accent radial */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse at 50% 80%, rgba(14,165,233,0.08) 0%, transparent 60%)"
            : "radial-gradient(ellipse at 50% 80%, rgba(14,165,233,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Bangladesh Map — behind waves, submerged at bottom */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[1] pointer-events-none">
        <img
          src="/images/bd_map.png"
          alt="Bangladesh"
          className="w-[260px] h-auto object-contain opacity-50 mix-blend-screen"
          style={{
            transform: "scale(2)",
            transformOrigin: "bottom center",
            filter: "drop-shadow(0 0 30px rgba(14,165,233,0.15))",
          }}
        />
      </div>

      {/* SVG Waves */}
      <svg
        className="absolute inset-0 w-full h-full z-[2]"
        viewBox="0 0 600 400"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Wave gradients */}
          <linearGradient id="wave1-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(6,182,212,0.4)" />
            <stop offset="100%" stopColor="rgba(14,165,233,0.05)" />
          </linearGradient>
          <linearGradient id="wave2-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(99,102,241,0.3)" />
            <stop offset="100%" stopColor="rgba(67,56,202,0.02)" />
          </linearGradient>
          <linearGradient id="wave3-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(14,165,233,0.25)" />
            <stop offset="100%" stopColor="rgba(14,165,233,0.02)" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Wave 3 — deepest, slowest */}
        <motion.path
          d="M0,280 C100,260 150,300 250,270 C350,240 400,290 500,260 C550,250 580,270 600,265 L600,400 L0,400 Z"
          fill="url(#wave3-gradient)"
          initial={{ d: "M0,280 C100,260 150,300 250,270 C350,240 400,290 500,260 C550,250 580,270 600,265 L600,400 L0,400 Z" }}
          animate={{
            d: [
              "M0,280 C100,260 150,300 250,270 C350,240 400,290 500,260 C550,250 580,270 600,265 L600,400 L0,400 Z",
              "M0,275 C100,295 180,255 280,280 C380,305 420,250 520,275 C560,285 580,260 600,270 L600,400 L0,400 Z",
              "M0,285 C120,265 170,305 270,275 C370,245 410,295 510,265 C555,255 585,275 600,268 L600,400 L0,400 Z",
              "M0,280 C100,260 150,300 250,270 C350,240 400,290 500,260 C550,250 580,270 600,265 L600,400 L0,400 Z",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Wave 2 — mid layer */}
        <motion.path
          d="M0,240 C80,220 160,260 240,235 C320,210 380,255 460,230 C520,215 560,240 600,230 L600,400 L0,400 Z"
          fill="url(#wave2-gradient)"
          initial={{ d: "M0,240 C80,220 160,260 240,235 C320,210 380,255 460,230 C520,215 560,240 600,230 L600,400 L0,400 Z" }}
          animate={{
            d: [
              "M0,240 C80,220 160,260 240,235 C320,210 380,255 460,230 C520,215 560,240 600,230 L600,400 L0,400 Z",
              "M0,235 C90,255 170,215 260,240 C350,265 400,220 480,245 C530,255 565,225 600,238 L600,400 L0,400 Z",
              "M0,245 C70,225 155,265 245,238 C335,212 385,258 465,232 C525,218 562,242 600,233 L600,400 L0,400 Z",
              "M0,240 C80,220 160,260 240,235 C320,210 380,255 460,230 C520,215 560,240 600,230 L600,400 L0,400 Z",
            ],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Wave 1 — front, fastest */}
        <motion.path
          d="M0,210 C70,190 140,230 210,205 C280,180 340,225 420,200 C480,185 540,215 600,200 L600,400 L0,400 Z"
          fill="url(#wave1-gradient)"
          initial={{ d: "M0,210 C70,190 140,230 210,205 C280,180 340,225 420,200 C480,185 540,215 600,200 L600,400 L0,400 Z" }}
          animate={{
            d: [
              "M0,210 C70,190 140,230 210,205 C280,180 340,225 420,200 C480,185 540,215 600,200 L600,400 L0,400 Z",
              "M0,205 C80,225 150,185 230,210 C310,235 360,195 440,220 C500,230 550,200 600,210 L600,400 L0,400 Z",
              "M0,215 C65,195 145,235 215,208 C285,182 345,228 425,203 C485,188 545,218 600,203 L600,400 L0,400 Z",
              "M0,210 C70,190 140,230 210,205 C280,180 340,225 420,200 C480,185 540,215 600,200 L600,400 L0,400 Z",
            ],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Wave 1 crest highlight line */}
        <motion.path
          d="M0,210 C70,190 140,230 210,205 C280,180 340,225 420,200 C480,185 540,215 600,200"
          fill="none"
          stroke="rgba(14,165,233,0.5)"
          strokeWidth="1.5"
          initial={{ d: "M0,210 C70,190 140,230 210,205 C280,180 340,225 420,200 C480,185 540,215 600,200" }}
          animate={{
            d: [
              "M0,210 C70,190 140,230 210,205 C280,180 340,225 420,200 C480,185 540,215 600,200",
              "M0,205 C80,225 150,185 230,210 C310,235 360,195 440,220 C500,230 550,200 600,210",
              "M0,215 C65,195 145,235 215,208 C285,182 345,228 425,203 C485,188 545,218 600,203",
              "M0,210 C70,190 140,230 210,205 C280,180 340,225 420,200 C480,185 540,215 600,200",
            ],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Active station pulse — floating on wave crest */}
        <g filter="url(#glow)">
          <motion.circle
            cx={210}
            cy={205}
            r={4}
            fill="#0ea5e9"
            initial={{ cy: 205 }}
            animate={{
              cy: [205, 210, 208],
              r: [4, 5, 4],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Pulse rings around station */}
          <motion.circle
            cx={210}
            cy={205}
            r={8}
            fill="none"
            stroke="rgba(14,165,233,0.4)"
            strokeWidth="1"
            initial={{ r: 8, opacity: 0.5 }}
            animate={{
              r: [8, 18, 8],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          <motion.circle
            cx={210}
            cy={205}
            r={12}
            fill="none"
            stroke="rgba(14,165,233,0.3)"
            strokeWidth="1"
            initial={{ r: 12, opacity: 0.4 }}
            animate={{
              r: [12, 24, 12],
              opacity: [0.4, 0, 0.4],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.8,
            }}
          />
        </g>

        {/* Second station node */}
        <g filter="url(#glow)">
          <motion.circle
            cx={420}
            cy={200}
            r={3}
            fill="#06b6d4"
            initial={{ cy: 200 }}
            animate={{
              cy: [200, 220, 203],
              r: [3, 4, 3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.circle
            cx={420}
            cy={200}
            r={6}
            fill="none"
            stroke="rgba(6,182,212,0.3)"
            strokeWidth="1"
            initial={{ r: 6, opacity: 0.4 }}
            animate={{
              r: [6, 14, 6],
              opacity: [0.4, 0, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut",
              delay: 1.5,
            }}
          />
        </g>

        {/* Third station node — smaller, distant */}
        <g filter="url(#glow)">
          <motion.circle
            cx={520}
            cy={215}
            r={2.5}
            fill="#8b5cf6"
            initial={{ cy: 215 }}
            animate={{
              cy: [215, 205, 212],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </g>
      </svg>

      {/* Ambient particles */}
      {[
        { x: "15%", y: "60%", delay: 0, size: 2 },
        { x: "30%", y: "45%", delay: 1.2, size: 1.5 },
        { x: "50%", y: "55%", delay: 0.6, size: 2 },
        { x: "70%", y: "50%", delay: 1.8, size: 1.5 },
        { x: "85%", y: "58%", delay: 0.3, size: 1 },
      ].map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-accent/40"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -12, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
