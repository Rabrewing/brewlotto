import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brewBlack: "#050509",
        brewSurface: "#111119",
        brewSurfaceSoft: "#161625",
        brewGold: "#FFD700",
      },
      boxShadow: {
        "brew-glow": "0 0 40px rgba(255, 215, 0, 0.35)",
        "brew-soft": "0 20px 40px rgba(0,0,0,0.7)",
      },
      backgroundImage: {
        "brew-space":
          "radial-gradient(circle at top, rgba(255,215,0,0.1), transparent 55%), radial-gradient(circle at bottom, rgba(0,199,183,0.08), transparent 60%), linear-gradient(135deg, #050509, #050509 40%, #090914 100%)",
        "brew-button":
          "linear-gradient(135deg, #FFD700, #ffef9f)",
        "brew-meter":
          "linear-gradient(to bottom, #FFD700, #FF8A00, #FF0033)",
      },
      borderRadius: {
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;