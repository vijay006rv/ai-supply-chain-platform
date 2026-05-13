/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        display: ["'Outfit'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        intel: {
          950: "#0a0f1a",
          900: "#0f172a",
          850: "#111c2f",
          800: "#152238",
          accent: "#22d3ee",
          amber: "#fbbf24",
          rose: "#fb7185",
        },
      },
      boxShadow: {
        glass: "0 8px 32px rgba(15, 23, 42, 0.12)",
        "glass-lg": "0 24px 64px rgba(15, 23, 42, 0.18)",
        glow: "0 0 40px rgba(34, 211, 238, 0.15)",
        "glow-sm": "0 0 24px rgba(34, 211, 238, 0.12)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.06) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(34,211,238,0.25), transparent)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.65" },
        },
      },
      animation: {
        shimmer: "shimmer 2.2s ease-in-out infinite",
        "fade-up": "fade-up 0.5s ease-out forwards",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
