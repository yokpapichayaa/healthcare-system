import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    // Custom `xs` breakpoint (below Tailwind's default `sm: 640px`)
    screens: {
      xs:  "375px",   // large phones (iPhone Pro and up)
      sm:  "640px",   // small tablets / landscape phones
      md:  "768px",   // tablets
      lg:  "1024px",  // laptops
      xl:  "1280px",  // desktops
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        sans:  ["DM Sans",          "sans-serif"],
        serif: ["DM Serif Display", "serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#38bd8c",
          dark:    "#2da87d",
        },
        surface: {
          DEFAULT:  "#080c14",
          card:     "#0d1420",
          elevated: "#111827",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.07)",
          focus:   "#38bd8c",
        },
      },
      // Fluid spacing helpers
      spacing: {
        safe: "env(safe-area-inset-bottom)",  // iOS notch / home bar
      },
      animation: {
        "pulse-ring": "pulse-ring 1.5s ease infinite",
        "fade-up":    "fadeUp 0.4s ease both",
        "slide-in":   "slideIn 0.2s ease",
        "dot-blink":  "dotBlink 1.2s infinite",
      },
      keyframes: {
        "pulse-ring": {
          "0%":   { boxShadow: "0 0 0 0 rgba(56,189,140,0.35)" },
          "70%":  { boxShadow: "0 0 0 10px rgba(56,189,140,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(56,189,140,0)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-6px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        dotBlink: {
          "0%, 80%, 100%": { opacity: "0" },
          "40%":           { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
