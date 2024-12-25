/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff5f5",
          100: "#ffe3e3",
          200: "#ffc9c9",
          300: "#ffa8a8",
          400: "#ff8787",
          500: "#ff6b6b",
          600: "#fa5252",
          700: "#f03e3e",
          800: "#e03131",
          900: "#c92a2a",
        },
        secondary: {
          50: "#fff4e6",
          100: "#ffe8cc",
          200: "#ffd8a8",
          300: "#ffc078",
          400: "#ffa94d",
          500: "#ff922b",
          600: "#fd7e14",
          700: "#f76707",
          800: "#e8590c",
          900: "#d9480f",
        },
      },
      fontFamily: {
        sans: ["Inter var", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      fontSize: {
        "display-1": ["4rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }], // 64px - Main hero titles
        "display-2": [
          "3.5rem",
          { lineHeight: "1.2", letterSpacing: "-0.02em" },
        ], // 56px - Section titles
        "heading-1": [
          "2.5rem",
          { lineHeight: "1.2", letterSpacing: "-0.01em" },
        ], // 40px - Large headings
        "heading-2": ["2rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }], // 32px - Medium headings
        "heading-3": [
          "1.5rem",
          { lineHeight: "1.4", letterSpacing: "-0.01em" },
        ], // 24px - Small headings
        "subtitle-1": ["1.25rem", { lineHeight: "1.5", letterSpacing: "0" }], // 20px - Large body/subtitles
        "subtitle-2": ["1.125rem", { lineHeight: "1.5", letterSpacing: "0" }], // 18px - Medium body/subtitles
        "body-1": ["1rem", { lineHeight: "1.5", letterSpacing: "0" }], // 16px - Main body text
        "body-2": ["0.875rem", { lineHeight: "1.5", letterSpacing: "0" }], // 14px - Small body text
        caption: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.02em" }], // 12px - Captions
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
