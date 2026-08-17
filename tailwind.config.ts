import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0B1220",
          900: "#0F1A2B",
          850: "#131F33",
          800: "#182640",
          700: "#243352",
          600: "#334469",
        },
        surface: {
          DEFAULT: "#F7F8FA",
          card: "#FFFFFF",
          muted: "#EEF1F5",
        },
        ink: {
          900: "#131A24",
          700: "#33404F",
          500: "#5B6B7C",
          400: "#8593A3",
          300: "#B7C0CB",
        },
        accent: {
          teal: "#0E8388",
          tealSoft: "#E4F3F3",
          amber: "#B4791F",
          amberSoft: "#FAF0DF",
          rose: "#B3455A",
          roseSoft: "#FBE9EC",
          indigo: "#3E5C9A",
          indigoSoft: "#E9EDF7",
        },
        status: {
          good: "#1E8A5F",
          warn: "#B4791F",
          bad: "#C1443F",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(19, 26, 36, 0.04), 0 1px 8px rgba(19, 26, 36, 0.04)",
        pop: "0 8px 24px rgba(19, 26, 36, 0.10)",
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};

export default config;
