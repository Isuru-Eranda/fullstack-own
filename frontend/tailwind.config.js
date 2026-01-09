/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#35003B",
          600: "#29002E",
          700: "#1D0020",
          light: "#6A2A7A",
        },
        secondary: {
          500: "#5A1E66",
          400: "#7C3A8C",
          300: "#A06BB3",
        },
        accent: {
          blue: "#2AB7CA",
          gold: "#F4C95D",
          magenta: "#FF4AE0",
        },
        background: {
          900: "#0D0D11",
          800: "#131318",
          700: "#1A1A21",
        },
        surface: {
          600: "#201F26",
          500: "#2A2933",
          400: "#353442",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#CFCFD7",
          muted: "#9C9CA7",
          inverse: "#0D0D11",
        },
        semantic: {
          error: "#E63946",
          success: "#2ECC71",
          warning: "#F5A623",
          info: "#2D9CDB",
        }
      },
      animation: {
        'fill-left-to-right': 'fill-left-to-right 2s ease-in-out infinite',
      },
      keyframes: {
        'fill-left-to-right': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
