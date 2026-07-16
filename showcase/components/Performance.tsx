"use client";

import { motion } from "framer-motion";
import { Target, TrendingUp } from "lucide-react";
import { GlassCard } from "./ui/GlassCard";
import { MetricCard } from "./ui/MetricCard";
import { METRICS, CONFUSION_MATRIX } from "@/lib/data";

export function Performance() {
  const { trueNegative, falsePositive, falseNegative, truePositive } =
    CONFUSION_MATRIX;
  const total = trueNegative + falsePositive + falseNegative + truePositive;

  return (
    <section id="performance" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-void via-surface/30 to-void" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="section-label w-fit mx-auto mb-4">
            <Target className="w-3.5 h-3.5" />
            Model Performance
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Defense-Grade{" "}
            <span className="gradient-text">Predictive Accuracy</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Validated on 20% temporal holdout data (not random split) to
            simulate real forecasting conditions. Every metric reflects
            production-ready reliability.
          </p>
        </motion.div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
          {METRICS.map((metric, i) => (
            <MetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              suffix={metric.suffix}
              delay={i * 0.1}
            />
          ))}
        </div>

        {/* Confusion Matrix + Summary */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Confusion Matrix */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard hover={false}>
              <h3 className="text-lg font-bold text-text mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Confusion Matrix
              </h3>

              {/* Matrix Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {/* True Negative */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="matrix-cell bg-gradient-to-br from-low/15 to-low/5 border border-low/25"
                >
                  <span className="text-xs text-muted mb-1">True Negative</span>
                  <span className="text-3xl font-mono font-bold text-low">
                    {trueNegative.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-muted mt-1">
                    {((trueNegative / total) * 100).toFixed(1)}%
                  </span>
                </motion.div>

                {/* False Positive */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="matrix-cell bg-medium/10 border border-medium/20"
                >
                  <span className="text-xs text-muted mb-1">False Positive</span>
                  <span className="text-3xl font-mono font-bold text-medium">
                    {falsePositive}
                  </span>
                  <span className="text-[10px] text-muted mt-1">
                    {((falsePositive / total) * 100).toFixed(1)}%
                  </span>
                </motion.div>

                {/* False Negative */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="matrix-cell bg-high/10 border border-high/20"
                >
                  <span className="text-xs text-muted mb-1">False Negative</span>
                  <span className="text-3xl font-mono font-bold text-high">
                    {falseNegative}
                  </span>
                  <span className="text-[10px] text-muted mt-1">
                    {((falseNegative / total) * 100).toFixed(1)}%
                  </span>
                </motion.div>

                {/* True Positive */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="matrix-cell bg-gradient-to-br from-accent/15 to-low/10 border border-accent/25"
                >
                  <span className="text-xs text-muted mb-1">True Positive</span>
                  <span className="text-3xl font-mono font-bold text-accent">
                    {truePositive}
                  </span>
                  <span className="text-[10px] text-muted mt-1">
                    {((truePositive / total) * 100).toFixed(1)}%
                  </span>
                </motion.div>
              </div>

              {/* Axis labels */}
              <div className="flex justify-between text-xs text-muted px-4">
                <span>Predicted: No Flood</span>
                <span>Predicted: Flood</span>
              </div>
            </GlassCard>
          </motion.div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            <GlassCard hover={false}>
              <h4 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">
                Test Set Composition
              </h4>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Total Samples</span>
                  <span className="text-sm font-mono font-bold text-text">
                    {total.toLocaleString()}
                  </span>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">No Flood (Class 0)</span>
                  <span className="text-sm font-mono font-bold text-low">
                    {(trueNegative + falsePositive).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Flood (Class 1)</span>
                  <span className="text-sm font-mono font-bold text-high">
                    {(truePositive + falseNegative).toLocaleString()}
                  </span>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Class Imbalance Ratio</span>
                  <span className="text-sm font-mono font-bold text-medium">
                    {(
                      (trueNegative + falsePositive) /
                      (truePositive + falseNegative)
                    ).toFixed(1)}
                    :1
                  </span>
                </div>
              </div>
            </GlassCard>

            <GlassCard hover={false}>
              <h4 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">
                Risk Classification Thresholds
              </h4>
              <div className="flex flex-col gap-3">
                {[
                  {
                    label: "HIGH Risk",
                    threshold: "> 66%",
                    dotClass: "bg-high",
                    descClass: "text-high",
                    description: "Immediate action required",
                  },
                  {
                    label: "MEDIUM Risk",
                    threshold: "33–66%",
                    dotClass: "bg-medium",
                    descClass: "text-medium",
                    description: "Prepare and monitor closely",
                  },
                  {
                    label: "LOW Risk",
                    threshold: "< 33%",
                    dotClass: "bg-low",
                    descClass: "text-low",
                    description: "Normal awareness sufficient",
                  },
                ].map((risk, i) => (
                  <motion.div
                    key={risk.label}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-white/5"
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${risk.dotClass}`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-text">
                          {risk.label}
                        </span>
                        <span className="text-xs font-mono text-muted">
                          {risk.threshold}
                        </span>
                      </div>
                      <p className="text-xs text-muted">{risk.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <GlassCard hover={false} className="glow-accent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center border border-accent/20">
                  <Target className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text">
                    Production-Ready Model
                  </p>
                  <p className="text-xs text-muted">
                    95.6% accuracy on temporal holdout — ready for real-world
                    deployment.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
