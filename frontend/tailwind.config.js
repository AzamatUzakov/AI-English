const { heroui } = require("@heroui/theme/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#131313",
        surface: "#131313",
        "surface-container-low": "#1b1c1c",
        "surface-container-high": "#2a2a2a",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#ccc3d8",
        primary: "#d2bbff",
        "primary-container": "#7c3aed",
        "outline-variant": "#4a4455",
        error: "#ffb4ab",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Geist", "monospace"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            primary: {
              DEFAULT: "#7c3aed",
              foreground: "#ffffff",
            },
            background: "#131313",
            content1: "#2a2a2a", // surface-container-high
            content2: "#1b1c1c", // surface-container-low
          },
        },
      },
    }),
  ],
};
