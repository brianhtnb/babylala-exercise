import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: { 100: '#B3E5FC', 500: '#4FC3F7' },
        green: { 50: '#E8F5E9', 500: '#81C784' },
        purple: { 200: '#E1BEE7' },
        orange: { 200: '#FFE0B2' },
        slate: { 800: '#37474F' },
      },
    },
  },
  plugins: [],
};
export default config;
