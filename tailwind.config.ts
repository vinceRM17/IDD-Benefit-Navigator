import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        blue: {
          50: '#f0f9f6',
          100: '#d5f0ea',
          200: '#a8ddd0',
          300: '#73c5b3',
          400: '#43a896',
          500: '#2d8f7f',
          600: '#1f7268',
          700: '#1a5d55',
          800: '#174a44',
          900: '#143d38',
          950: '#0a201e',
        },
        gray: {
          50: '#F9F9F6',
          100: '#F3F3EF',
          200: '#E5E5E0',
          300: '#D4D4CE',
          400: '#A3A39C',
          500: '#73736D',
          600: '#52524D',
          700: '#3D3D38',
          800: '#272723',
          900: '#1A1A17',
          950: '#0F0F0D',
        },
      },
    },
  },
  plugins: [],
};
export default config;
