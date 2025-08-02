/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#f0ebdb",
          hover: "#e6e0d0",
          active: "#dcd6c6",
        },
        secondary: "#301d0c",
        accent: {
          DEFAULT: "#a99b84",
          hover: "#9a8c75",
          active: "#8b7d66",
        },
        neutral: "#786650",
        highlight: "#87775f",
        success: {
          DEFAULT: "#10b981",
          light: "#d1fae5",
        },
        warning: {
          DEFAULT: "#f59e0b",
          light: "#fef3c7",
        },
        error: {
          DEFAULT: "#ef4444",
          light: "#fee2e2",
        },
        info: {
          DEFAULT: "#3b82f6",
          light: "#dbeafe",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Georgia", "serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        brand:
          "0 4px 6px -1px rgba(48, 29, 12, 0.1), 0 2px 4px -1px rgba(48, 29, 12, 0.06)",
      },
    },
  },
  plugins: [],
};
