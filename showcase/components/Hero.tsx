"use client";

import { motion } from "framer-motion";
import { ArrowDown, MapPin, Database, Brain } from "lucide-react";
import { FluidWave } from "./ui/FluidWave";
import { MetricCard } from "./ui/MetricCard";
import { PROJECT, METRICS } from "@/lib/data";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-void via-surface/50 to-void" />

      {/* Radial glow behind radar */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="flex flex-col gap-8">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="section-label w-fit"
            >
              <Database className="w-3.5 h-3.5" />
              {PROJECT.course} — Academic Project
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95]"
            >
              <span className="text-text">Real-Time</span>
              <br />
              <span className="gradient-text">Flood Intelligence</span>
              <br />
              <span className="text-text">for Bangladesh</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted max-w-lg leading-relaxed"
            >
              {PROJECT.description} Powered by XGBoost ML, real-time Visual
              Crossing weather data, and a fine-tuned Gemma 2 conversational
              agent.
            </motion.p>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              {[
                { icon: MapPin, text: "33 Districts" },
                { icon: Brain, text: "XGBoost + LLM" },
                { icon: Database, text: "65 Years of Data" },
              ].map((pill, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-muted"
                >
                  <pill.icon className="w-3.5 h-3.5 text-accent" />
                  {pill.text}
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex gap-4"
            >
              <a
                href="/chat"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
              >
                Explore the Pipeline
                <ArrowDown className="w-4 h-4" />
              </a>
              <a
                href="#performance"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-muted font-semibold text-sm hover:bg-white/5 hover:text-text transition-colors"
              >
                View Results
              </a>
            </motion.div>

            {/* Metrics row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-3 gap-4 pt-4"
            >
              {METRICS.slice(0, 3).map((metric, i) => (
                <MetricCard
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  suffix={metric.suffix}
                  delay={0.6 + i * 0.1}
                />
              ))}
            </motion.div>
          </div>

          {/* Right: Fluid Wave Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:flex justify-center items-center -mt-36"
          >
            <FluidWave className="w-full max-w-[500px]" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center"
        style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom, 1.5rem))" }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted/50"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
