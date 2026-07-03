import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#020617",
        surface: "#0f172a",
        card: "#0D1B2E",
        cardHover: "#10233c",
        border: "#1e293b",
        blue: {
          DEFAULT: "#3390f0",
          dark: "#1a5fa8",
          light: "#5baaf7",
          lighter: "#7ac0ff",
        },
        gold: {
          DEFAULT: "#f3c869",
          dark: "#c8921f",
        },
        emerald: "#34d399",
        yellow: "#facc15",
        red: "#f87171",
        violet: "#a78bfa",
        cyan: "#22d3ee",
        slate: "#94a3b8",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Sora", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
