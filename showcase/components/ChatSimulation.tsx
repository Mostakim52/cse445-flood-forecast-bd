"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  User,
  Send,
  RotateCcw,
  Zap,
  Droplets,
  MapPin,
  AlertTriangle,
  Brain,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://cse445-flood-forecast-bd.onrender.com";

const QUICK_PROMPTS = [
  {
    icon: MapPin,
    label: "Check Sunamganj",
    prompt: "What is the flood risk for Sunamganj right now?",
    color: "text-accent",
  },
  {
    icon: Brain,
    label: "How does XGBoost work?",
    prompt: "How does the XGBoost model factor into your flood predictions?",
    color: "text-violet-400",
  },
  {
    icon: AlertTriangle,
    label: "Current alerts",
    prompt: "Are there any active flood alerts in Bangladesh today?",
    color: "text-medium",
  },
  {
    icon: Droplets,
    label: "Forecast my district",
    prompt: "Can you forecast flood risk for Sylhet this month?",
    color: "text-cyan-400",
  },
  {
    icon: Zap,
    label: "What data do you use?",
    prompt: "What weather data does the model use for predictions?",
    color: "text-low",
  },
];

export function ChatSimulation() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Welcome! I\u2019m your Flood Forecast AI. Ask me about flood risks for any of Bangladesh\u2019s 33 districts, or try one of the suggestions on the left.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = async (text?: string) => {
    const messageText = (text ?? input).trim();
    if (!messageText || isTyping) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    let responseText: string;
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) {
        const data = await res.json();
        const remote =
          data.response ?? data.message ?? data.answer ?? null;
        if (remote) {
          responseText = remote;
        } else {
          responseText = "No response from server. Please try again.";
        }
      } else {
        responseText = "Server error. Please try again later.";
      }
    } catch {
      responseText = "Cannot reach the server. Make sure the API is running and try again.";
    }

    const botMsg: Message = {
      id: `b-${Date.now()}`,
      role: "assistant",
      text: responseText,
      timestamp: new Date(),
    };

    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));
    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        text: "Welcome! I\u2019m your Flood Forecast AI. Ask me about flood risks for any of Bangladesh\u2019s 33 districts, or try one of the suggestions on the left.",
        timestamp: new Date(),
      },
    ]);
    setIsTyping(false);
  };

  const renderMarkdown = (text: string) => {
    return text
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold">$1</span>')
      // Risk level colors
      .replace(/\b(HIGH)\b/g, '<span class="font-bold text-rose-400">$1</span>')
      .replace(/\b(MEDIUM)\b/g, '<span class="font-bold text-amber-400">$1</span>')
      .replace(/\b(LOW)\b/g, '<span class="font-bold text-emerald-400">$1</span>')
      // Headers with emoji
      .replace(/^(🌊|📊|🌤️|⚠️|🔴|🟡|🟢|💡)(.*)$/gm, '<span class="font-semibold text-accent">$1$2</span>')
      // Bullet points
      .replace(/^- (.*)$/gm, '<span class="text-muted">•</span> $1')
      // Line breaks
      .replace(/\n/g, "<br/>");
  };

  return (
    <section id="chat-simulation" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-void via-surface/30 to-void" />

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="section-label w-fit mx-auto mb-4">
            <Bot className="w-3.5 h-3.5" />
            Interactive Chat
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Conversational{" "}
            <span className="gradient-text">Flood Intelligence</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Chat directly with our flood forecasting AI. Ask about any
            district, explore how the model works, or check live alerts.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex gap-6 items-start"
        >
          {/* Quick Prompts Sidebar */}
          <div className="hidden lg:flex flex-col gap-2 w-56 flex-shrink-0 sticky top-24">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-1">
              Quick Prompts
            </p>
            {QUICK_PROMPTS.map((qp) => (
              <button
                key={qp.label}
                onClick={() => handleSend(qp.prompt)}
                disabled={isTyping}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm text-text glass-card hover:border-[var(--glass-card-hover-border)] transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <qp.icon
                  className={`w-4 h-4 ${qp.color} flex-shrink-0 group-hover:scale-110 transition-transform`}
                />
                <span className="text-xs font-medium leading-tight">
                  {qp.label}
                </span>
              </button>
            ))}
          </div>

          {/* Chat Window */}
          <div className="flex-1 glass-card overflow-hidden min-w-0">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-cyan-400 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text">
                    Flood Forecast AI
                  </h4>
                  <p className="text-xs text-muted">
                    gemma2:2b \u2014 QLoRA 4-bit
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-low animate-pulse" />
                  <span className="text-xs text-low font-medium">Online</span>
                </div>
                <button
                  onClick={handleReset}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors text-muted hover:text-text"
                  aria-label="Reset chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="px-6 py-6 min-h-[380px] max-h-[380px] overflow-y-auto flex flex-col gap-4 scrollbar-thin">
              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        msg.role === "user"
                          ? "bg-accent/15 border border-accent/20"
                          : "bg-gradient-to-br from-accent to-cyan-400"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User className="w-4 h-4 text-accent" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-accent/15 border border-accent/20 rounded-br-md"
                          : "bg-white/5 border border-white/10 rounded-bl-md"
                      }`}
                    >
                      <p
                        className="text-sm leading-relaxed text-text"
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(msg.text),
                        }}
                      />
                      <p className="text-[10px] text-muted/40 mt-1.5">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-cyan-400 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-muted/50"
                            animate={{
                              y: [0, -4, 0],
                              opacity: [0.4, 1, 0.4],
                            }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              delay: i * 0.15,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Mobile Quick Prompts */}
            <div className="px-6 pb-3 flex gap-2 overflow-x-auto lg:hidden scrollbar-thin">
              {QUICK_PROMPTS.map((qp) => (
                <button
                  key={qp.label}
                  onClick={() => handleSend(qp.prompt)}
                  disabled={isTyping}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-text border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex-shrink-0 disabled:opacity-40"
                >
                  <qp.icon className={`w-3 h-3 ${qp.color}`} />
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="px-6 py-4 border-t border-white/[0.06]">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about flood risks, districts, or the model..."
                    rows={1}
                    className="w-full resize-none rounded-xl px-4 py-3 text-sm text-text bg-white/5 border border-white/10 focus:border-accent/40 focus:outline-none placeholder:text-muted/50 transition-colors"
                    style={{ minHeight: "44px", maxHeight: "120px" }}
                  />
                </div>
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="flex-shrink-0 w-11 h-11 rounded-xl bg-accent hover:bg-accent/90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="text-[10px] text-muted/40 mt-2 text-center">
                Press Enter to send <br></br>
                Shift+Enter for new line
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
