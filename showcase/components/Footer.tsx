"use client";

import { Github, ExternalLink, Heart } from "lucide-react";
import Image from "next/image";
import { PROJECT } from "@/lib/data";
import { useTheme } from "./ThemeProvider";

export function Footer() {
  const { theme } = useTheme();
  return (
    <footer className="relative py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center border border-accent/20 overflow-hidden">
                <Image src={theme === "dark" ? "/images/icon_dark.png" : "/images/icon_light.png"} alt="Logo" width={24} height={24} className="object-contain" />
              </div>
              <span className="text-base font-bold tracking-tight">
                Flood Forecast <span className="text-accent">BD</span>
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              {PROJECT.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted">
              <span>{PROJECT.course}</span>
              <span className="text-white/20">|</span>
              <span>{PROJECT.semester}</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold text-text mb-4">Resources</h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/YOUR_USERNAME/cse445_flood_forecast_bd"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
              >
                <Github className="w-4 h-4" />
                Source Code
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://flood-forecast-api.onrender.com/health"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                API Health Check
              </a>
              <a
                href="https://github.com/n-gauhar/Flood-prediction"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Dataset Source
              </a>
            </div>

            {/* Tech stack */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["Next.js", "Tailwind", "Framer Motion", "Recharts", "XGBoost", "Flask", "Flutter"].map(
                (tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-[10px] font-medium text-muted bg-white/5 rounded border border-white/5"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted/50">
            Academic project — {PROJECT.course} ({PROJECT.semester})
          </p>
          <p className="text-xs text-muted/50 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-high/50" /> by Team Ryzen 4090
          </p>
        </div>
      </div>
    </footer>
  );
}
