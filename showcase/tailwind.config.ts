import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Dark theme (default)
        void: "var(--void)",
        surface: "var(--surface)",
        card: "var(--card)",
        accent: "var(--accent)",
        high: "var(--high)",
        medium: "var(--medium)",
        low: "var(--low)",
        text: "var(--text)",
        muted: "var(--muted)",
      },
      fontFamily: {
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      animation: {
        "pulse-ring": "pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-ring-delay": "pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.8s",
        "pulse-ring-delay-2": "pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite 1.6s",
        "blink": "blink 1s step-end infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "count-up": "count-up 1.5s ease-out forwards",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.5)", opacity: "0.8" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
