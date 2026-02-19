import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      spacing: {
        section: "var(--space-section)",
        "card-padding": "var(--space-card-padding)",
        stack: "var(--space-stack)",
        inline: "var(--space-inline)",
        "page-x": "var(--space-page-x)",
        "page-y": "var(--space-page-y)",
      },
      maxWidth: {
        content: "var(--content-max-width)",
      },
      keyframes: {
        "focus-ring-glow": {
          "0%": { boxShadow: "0 0 0 2px hsl(var(--ring) / 0)" },
          "50%": { boxShadow: "0 0 0 3px hsl(var(--ring) / 0.3)" },
          "100%": { boxShadow: "0 0 0 2px hsl(var(--ring) / 0.15)" },
        },
        "gentle-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "slide-in-up": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "focus-ring": "focus-ring-glow 0.6s ease-out forwards",
        "gentle-pulse": "gentle-pulse 2s ease-in-out infinite",
        "slide-in-up": "slide-in-up 0.3s ease-out",
      },
    },
  },
  plugins: [tailwindAnimate],
};
export default config;
