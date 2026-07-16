"use client";

import { motion } from "framer-motion";
import { BookOpen, Lightbulb, ArrowRight, Check, X } from "lucide-react";
import { GlassCard } from "./ui/GlassCard";
import { PAPERS, NOVELTY } from "@/lib/data";

export function Literature() {
  return (
    <section id="literature" className="relative py-24 overflow-hidden">
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
            <BookOpen className="w-3.5 h-3.5" />
            Research Foundation
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Building on{" "}
            <span className="gradient-text">Established Research</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Our approach synthesizes insights from three peer-reviewed papers
            on ML-based flood forecasting, addressing their identified gaps
            with a novel combination of interpretable ML, conversational AI, and
            mobile UX.
          </p>
        </motion.div>

        {/* Papers Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {PAPERS.map((paper, i) => (
            <GlassCard key={paper.id} delay={i * 0.1} className="flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-md bg-accent/15 flex items-center justify-center border border-accent/20">
                  <span className="text-xs font-mono font-bold text-accent">
                    P{paper.id}
                  </span>
                </div>
                <span className="text-xs text-muted font-medium">
                  {paper.novelty}
                </span>
              </div>

              <h4 className="text-sm font-bold text-text mb-2 leading-snug">
                {paper.title}
              </h4>

              <p className="text-xs text-accent/80 mb-3">
                Focus: {paper.focus}
              </p>

              <p className="text-xs text-muted mb-4 leading-relaxed flex-1">
                {paper.approach}
              </p>

              {/* Strength */}
              <div className="flex items-start gap-2 mb-2 p-2 rounded-lg bg-low/5 border border-low/10">
                <Check className="w-3.5 h-3.5 text-low mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted leading-relaxed">
                  {paper.strength}
                </p>
              </div>

              {/* Weakness */}
              <div className="flex items-start gap-2 p-2 rounded-lg bg-high/5 border border-high/10">
                <X className="w-3.5 h-3.5 text-high mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted leading-relaxed">
                  {paper.weakness}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Novelty Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard hover={false} className="glow-accent">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center border border-accent/20">
                <Lightbulb className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-text">{NOVELTY.title}</h3>
            </div>

            {/* Our novelty points */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {NOVELTY.points.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-accent/5 border border-accent/10"
                >
                  <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-text">{point}</span>
                </motion.div>
              ))}
            </div>

            {/* Gaps Bridged */}
            <h4 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-accent" />
              Gaps We Bridge
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              {NOVELTY.gapsBridged.map((gap, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl bg-surface border border-white/5"
                >
                  <p className="text-xs text-accent font-semibold mb-2">
                    {gap.paper}
                  </p>
                  <div className="flex items-start gap-2 mb-2">
                    <X className="w-3 h-3 text-high mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted">{gap.gap}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3 h-3 text-low mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-text font-medium">
                      {gap.solution}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
