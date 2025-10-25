/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#fdf6e8",
        surface: "#f8ebd0",
        outline: "#e5d0a8",
        muted: "#6f6f6f",
        accent: {
          DEFAULT: "#6e4b1f",
          hover: "#5b3d19"
        }
      },
      maxWidth: {
        content: "64rem"
      },
      boxShadow: {
        focus: "0 0 0 4px rgba(110,75,31,0.22)"
      },
      keyframes: {
        "soft-pulse": {
          "0%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.08)" },
          "100%": { opacity: "0.55", transform: "scale(1)" }
        },
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
          "100%": { transform: "translateY(0px)" }
        },
        "hero-shimmer": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        }
      },
      animation: {
        "soft-pulse": "soft-pulse 14s ease-in-out infinite",
        float: "float 18s ease-in-out infinite",
        "hero-shimmer": "hero-shimmer 8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
