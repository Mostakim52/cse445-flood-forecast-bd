"use client";

import { motion } from "framer-motion";
import { Server, Smartphone, Bot, ExternalLink, ArrowRight } from "lucide-react";
import { GlassCard } from "./ui/GlassCard";
import { COMPONENTS } from "@/lib/data";

const iconMap = {
  server: Server,
  smartphone: Smartphone,
  bot: Bot,
};

export function Architecture() {
  return (
    <section id="architecture" className="relative py-24 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="section-label w-fit mx-auto mb-4">
            <Server className="w-3.5 h-3.5" />
            System Architecture
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Three Components,{" "}
            <span className="gradient-text">One Ecosystem</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            A distributed system designed for scalability, real-time inference,
            and seamless user experience across mobile and web platforms.
          </p>
        </motion.div>

        {/* Architecture Blocks */}
        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connecting lines (desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent -translate-y-1/2" />

          {COMPONENTS.map((comp, i) => {
            const Icon = iconMap[comp.icon];
            return (
              <motion.div
                key={comp.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <GlassCard className="h-full flex flex-col">
                  {/* Icon + Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center border border-accent/20">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-text">
                        {comp.name}
                      </h3>
                      <p className="text-xs text-accent font-mono">
                        {comp.tech}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted mb-4 leading-relaxed">
                    {comp.description}
                  </p>

                  {/* Details */}
                  <ul className="flex flex-col gap-2 mb-4 flex-1">
                    {comp.details.map((detail, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-xs text-muted"
                      >
                        <div className="w-1 h-1 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>

                  {/* Host badge */}
                  <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                    <div className="w-2 h-2 rounded-full bg-low animate-pulse" />
                    <span className="text-xs text-muted">
                      Hosted on{" "}
                      <span className="text-text font-medium">{comp.host}</span>
                    </span>
                  </div>
                </GlassCard>

                {/* Arrow between cards (desktop) */}
                {i < COMPONENTS.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-surface border border-white/10 items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-accent/60" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* App Mockups Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <GlassCard hover={false}>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Home Screen Mockup */}
              <div className="flex flex-col items-center">
                <div className="w-[200px] h-[360px] rounded-3xl bg-surface border-2 border-white/10 overflow-hidden shadow-2xl shadow-black/40 relative">
                  {/* Status bar */}
                  <div className="h-6 bg-void flex items-center justify-between px-4">
                    <span className="text-[8px] text-muted">9:41</span>
                    <div className="flex gap-1">
                      <div className="w-2.5 h-1.5 rounded-sm bg-muted/40" />
                      <div className="w-2.5 h-1.5 rounded-sm bg-muted/40" />
                      <div className="w-2.5 h-1.5 rounded-sm bg-muted/40" />
                    </div>
                  </div>

                  {/* Header gradient */}
                  <div className="h-28 bg-gradient-to-b from-accent/20 to-surface flex flex-col items-center justify-center px-4">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mb-2">
                      <div className="w-4 h-4 rounded-full bg-accent/40" />
                    </div>
                    <p className="text-[10px] font-bold text-text text-center">
                      Flood Forecast BD
                    </p>
                    <p className="text-[7px] text-muted text-center">
                      AI-Powered Flood Forecast
                    </p>
                  </div>

                  {/* District list */}
                  <div className="p-3 flex flex-col gap-1.5">
                    {["Dhaka", "Chittagong", "Sylhet", "Rajshahi"].map(
                      (d, i) => (
                        <div
                          key={d}
                          className="flex items-center gap-2 p-2 rounded-lg bg-white/5"
                        >
                          <div className="w-5 h-5 rounded-md bg-accent/15 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-accent/40" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[8px] font-semibold text-text">
                              {d}
                            </p>
                            <p className="text-[6px] text-muted">
                              23.{8 + i}°N, 90.{3 + i}°E
                            </p>
                          </div>
                          <div className="w-3 h-3 rounded bg-accent/10 flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-accent/40" />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted mt-3 font-medium">
                  Home Screen
                </p>
              </div>

              {/* Map Screen Mockup */}
              <div className="flex flex-col items-center">
                <div className="w-[200px] h-[360px] rounded-3xl bg-void border-2 border-white/10 overflow-hidden shadow-2xl shadow-black/40 relative">
                  {/* Map background */}
                  <div className="absolute inset-0 opacity-40">
                    <div
                      className="w-full h-full"
                      style={{
                        background:
                          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
                      }}
                    />
                    {/* Grid pattern */}
                    <svg className="absolute inset-0 w-full h-full opacity-20">
                      <defs>
                        <pattern
                          id="grid"
                          width="20"
                          height="20"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 20 0 L 0 0 0 20"
                            fill="none"
                            stroke="rgba(14,165,233,0.3)"
                            strokeWidth="0.5"
                          />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>

                  {/* District markers */}
                  {[
                    { x: "35%", y: "25%", name: "Rangpur" },
                    { x: "65%", y: "20%", name: "Sylhet" },
                    { x: "20%", y: "50%", name: "Rajshahi" },
                    { x: "50%", y: "45%", name: "Dhaka" },
                    { x: "75%", y: "50%", name: "Chittagong" },
                    { x: "35%", y: "70%", name: "Khulna" },
                    { x: "60%", y: "75%", name: "Barisal" },
                  ].map((m) => (
                    <div
                      key={m.name}
                      className="absolute"
                      style={{ left: m.x, top: m.y, transform: "translate(-50%, -50%)" }}
                    >
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-accent to-cyan-400 border-2 border-white shadow-lg shadow-accent/30" />
                      <p className="text-[6px] text-text text-center mt-0.5 font-medium whitespace-nowrap">
                        {m.name}
                      </p>
                    </div>
                  ))}

                  {/* Top bar */}
                  <div className="absolute top-3 left-3 right-3 h-8 rounded-xl bg-surface/80 backdrop-blur-sm border border-white/10 flex items-center px-3">
                    <div className="w-4 h-4 rounded bg-white/10" />
                    <p className="text-[7px] text-text ml-2 font-medium">
                      Bangladesh Stations
                    </p>
                    <div className="ml-auto px-1.5 py-0.5 rounded bg-accent/20">
                      <p className="text-[6px] text-accent font-bold">33</p>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-surface/80 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <p className="text-[6px] text-muted">Station</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted mt-3 font-medium">
                  Interactive Map
                </p>
              </div>

              {/* Chat Screen Mockup */}
              <div className="flex flex-col items-center">
                <div className="w-[200px] h-[360px] rounded-3xl bg-surface border-2 border-white/10 overflow-hidden shadow-2xl shadow-black/40 flex flex-col">
                  {/* Chat header */}
                  <div className="h-10 bg-void/80 border-b border-white/5 flex items-center px-3 gap-2">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-accent to-cyan-400 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-sm bg-white/80" />
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-text">
                        Flood Forecast AI
                      </p>
                      <p className="text-[6px] text-muted">
                        Powered by gemma2:2b
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-low" />
                      <p className="text-[6px] text-low">Online</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-3 flex flex-col gap-2 overflow-hidden">
                    {/* User message */}
                    <div className="self-end max-w-[80%] p-2 rounded-xl rounded-br-sm bg-accent/20 border border-accent/20">
                      <p className="text-[7px] text-text">
                        Will there be a flood?
                      </p>
                    </div>

                    {/* Bot message */}
                    <div className="self-start max-w-[80%] p-2 rounded-xl rounded-bl-sm bg-white/5 border border-white/10">
                      <p className="text-[7px] text-muted">
                        Which district? (e.g., Dhaka)
                      </p>
                    </div>

                    {/* User message */}
                    <div className="self-end max-w-[80%] p-2 rounded-xl rounded-br-sm bg-accent/20 border border-accent/20">
                      <p className="text-[7px] text-text">Dhaka</p>
                    </div>

                    {/* Bot message */}
                    <div className="self-start max-w-[80%] p-2 rounded-xl rounded-bl-sm bg-white/5 border border-white/10">
                      <p className="text-[7px] text-muted">
                        This month or next?
                      </p>
                    </div>

                    {/* User message */}
                    <div className="self-end max-w-[80%] p-2 rounded-xl rounded-br-sm bg-accent/20 border border-accent/20">
                      <p className="text-[7px] text-text">This month</p>
                    </div>

                    {/* Result */}
                    <div className="self-start max-w-[85%] p-2 rounded-xl rounded-bl-sm bg-high/10 border border-high/20">
                      <div className="flex items-center gap-1 mb-1">
                        <div className="w-2 h-2 rounded-full bg-high" />
                        <p className="text-[7px] font-bold text-high">
                          HIGH RISK
                        </p>
                        <p className="text-[6px] font-mono text-high ml-auto">
                          78.5%
                        </p>
                      </div>
                      <p className="text-[6px] text-muted leading-relaxed">
                        Consider moving to higher ground...
                      </p>
                    </div>
                  </div>

                  {/* Input bar */}
                  <div className="h-9 bg-void/80 border-t border-white/5 flex items-center px-2 gap-1.5">
                    <div className="flex-1 h-5 rounded-md bg-white/5 px-2 flex items-center">
                      <p className="text-[6px] text-muted/50">
                        Ask about flood forecasting...
                      </p>
                    </div>
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-accent to-cyan-400 flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[3px] border-l-white border-y-[3px] border-y-transparent ml-0.5" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted mt-3 font-medium">
                  AI Chat Interface
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
