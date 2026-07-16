"use client";

import { ChatSimulation } from "@/components/ChatSimulation";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import Image from "next/image";

export default function ChatPage() {
  const { theme, toggle } = useTheme();

  return (
    <main className="relative min-h-screen">
      {/* Minimal chat header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <nav className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center border border-accent/20 group-hover:bg-accent/25 transition-colors overflow-hidden">
              <Image src={theme === "dark" ? "/images/icon_dark.png" : "/images/icon_light.png"} alt="Logo" width={20} height={20} className="object-contain" />
            </div>
            <span className="text-sm font-bold tracking-tight">
              Flood Forecast <span className="text-accent">BD</span>
            </span>
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-muted hover:text-text"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
            <a
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted hover:text-text transition-colors rounded-lg hover:bg-white/5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </a>
          </div>
        </nav>
      </header>

      <div className="pt-14 min-h-screen">
        <ChatSimulation />
      </div>
    </main>
  );
}
