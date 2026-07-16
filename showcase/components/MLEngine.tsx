"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Filter,
  GitBranch,
  Layers,
  Sparkles,
  ArrowRight,
  Database,
  Cpu,
} from "lucide-react";
import { GlassCard } from "./ui/GlassCard";
import { FeatureBar } from "./ui/FeatureBar";
import {
  FEATURES,
  PREPROCESSING_STEPS,
  PIPELINE_STEPS,
  MODEL_ARCHITECTURE,
} from "@/lib/data";

const iconMap = {
  filter: Filter,
  gitBranch: GitBranch,
  layers: Layers,
  sparkles: Sparkles,
};

const chartData = FEATURES.slice(0, 8).map((f) => ({
  name: f.name.replace("_", "\n"),
  importance: f.importance,
}));

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { name: string } }>;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 text-xs">
        <p className="font-semibold text-text">{payload[0].payload.name}</p>
        <p className="text-accent font-mono">{payload[0].value.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

export function MLEngine() {
  return (
    <section id="ml-engine" className="relative pt-24 pb-32 overflow-hidden">
      {/* Section glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-30">
        <div
          className="w-full h-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(14,165,233,0.1) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="section-label w-fit mx-auto mb-4">
            <Cpu className="w-3.5 h-3.5" />
            The ML Engine
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            From Raw Data to{" "}
            <span className="gradient-text">Flood Intelligence</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            65 years of climate data processed through a rigorous preprocessing
            pipeline, engineered into 20 predictive features, and modeled with
            an XGBoost classifier tuned via GridSearchCV.
          </p>
        </motion.div>

        {/* Data Journey Pipeline */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold tracking-wider uppercase text-muted mb-8 flex items-center gap-3"
          >
            <Database className="w-4 h-4 text-accent" />
            Data Journey
          </motion.h3>

          <div className="grid md:grid-cols-4 gap-4">
            {PIPELINE_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <GlassCard delay={i * 0.1}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center border border-accent/20">
                      <span className="text-sm font-mono font-bold text-accent">
                        {step.step}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-text">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    {step.detail}
                  </p>
                </GlassCard>
                {i < PIPELINE_STEPS.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-accent/40" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Preprocessing + Feature Importance */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Preprocessing Steps */}
          <div>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm font-semibold tracking-wider uppercase text-muted mb-8 flex items-center gap-3"
            >
              <Filter className="w-4 h-4 text-accent" />
              Preprocessing Pipeline
            </motion.h3>

            <div className="flex flex-col gap-4">
              {PREPROCESSING_STEPS.map((step, i) => {
                const Icon = iconMap[step.icon];
                return (
                  <GlassCard key={step.title} delay={i * 0.1}>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 flex-shrink-0">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-text mb-1">
                          {step.title}
                        </h4>
                        <p className="text-xs text-muted leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>

          {/* Right: Feature Importance */}
          <div>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm font-semibold tracking-wider uppercase text-muted mb-8 flex items-center gap-3"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              Top Feature Importances
            </motion.h3>

            {/* Recharts Bar Chart */}
            <GlassCard className="mb-6" hover={false}>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ left: 10, right: 20, top: 0, bottom: 0 }}
                  >
                    <XAxis
                      type="number"
                      domain={[0, 50]}
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                      axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={120}
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Bar
                      dataKey="importance"
                      radius={[0, 6, 6, 0]}
                      barSize={16}
                    >
                      {chartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            index === 0
                              ? "#0ea5e9"
                              : index < 3
                              ? "rgba(14,165,233,0.6)"
                              : "rgba(14,165,233,0.3)"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Detailed bars */}
            <div className="flex flex-col gap-3">
              {FEATURES.slice(0, 6).map((feature, i) => (
                <FeatureBar
                  key={feature.name}
                  name={feature.name}
                  importance={feature.importance}
                  description={feature.description}
                  index={i}
                  maxImportance={FEATURES[0].importance}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Model Architecture Callout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <GlassCard hover={false} className="glow-accent">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-text mb-3 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-accent" />
                  Model Architecture
                </h3>
                <p className="text-sm text-muted mb-4">
                  {MODEL_ARCHITECTURE.algorithm} with{" "}
                  {MODEL_ARCHITECTURE.features} engineered features and a{" "}
                  {MODEL_ARCHITECTURE.lagMonths}-month rolling history lag
                  feature loop.
                </p>
                <div className="flex flex-wrap gap-2">
                  {MODEL_ARCHITECTURE.lagFeatures.map((f) => (
                    <span
                      key={f}
                      className="px-2.5 py-1 rounded-md bg-accent/10 text-accent text-xs font-medium border border-accent/20"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wider">
                  Hyperparameters
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(MODEL_ARCHITECTURE.hyperparameters).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-muted">{key}:</span>
                        <span className="font-mono text-text font-medium">
                          {String(value)}
                        </span>
                      </div>
                    )
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Cross-Validation:</span>
                    <span className="font-mono text-accent font-medium">
                      {MODEL_ARCHITECTURE.crossValidation}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
