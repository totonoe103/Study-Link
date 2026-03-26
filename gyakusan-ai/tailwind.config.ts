import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#22c55e",
          600: "#16a34a",
        },
      },
    },
  },
  plugins: [],
};

export default config;

