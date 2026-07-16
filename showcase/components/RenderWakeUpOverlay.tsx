"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, RefreshCw } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://cse445-flood-forecast-bd.onrender.com";

const RETRY_INTERVAL = 10000;

interface Props {
  onAwake?: () => void;
}

export function RenderWakeUpOverlay({ onAwake }: Props) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [checking, setChecking] = useState(true);

  const checkHealth = async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(`${API_BASE}/health`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        setShowOverlay(false);
        setChecking(false);
        onAwake?.();
        return true;
      }
    } catch {
      // Server not responding
    }
    return false;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let mounted = true;

    const initialCheck = async () => {
      const awake = await checkHealth();
      if (!mounted) return;
      if (!awake) {
        setShowOverlay(true);
        setChecking(false);
        interval = setInterval(async () => {
          if (!mounted) return;
          setRetryCount((c) => c + 1);
          await checkHealth();
        }, RETRY_INTERVAL);
      }
    };

    initialCheck();

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (!showOverlay) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl overflow-hidden"
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-void/80 backdrop-blur-md" />

      {/* Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="relative z-10 text-center px-8 py-10"
      >
        {/* Animated water drop */}
        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-cyan-400 mb-6"
        >
          <Droplets className="w-8 h-8 text-white" />
        </motion.div>

        <h3 className="text-lg font-bold text-text mb-2">
          Server is waking up...
        </h3>
        <p className="text-sm text-muted max-w-xs mb-1">
          Hosted on Render free tier. It may take 30-60 seconds to come online.
        </p>
        <p className="text-xs text-muted/60 mb-6">
          {retryCount > 0 && `Retrying... (${retryCount})`}
        </p>

        <button
          onClick={async () => {
            setRetryCount((c) => c + 1);
            await checkHealth();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-text hover:bg-white/10 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try now
        </button>
      </motion.div>
    </motion.div>
  );
}
