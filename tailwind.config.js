/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F0F9FF", // Fresh Light Sky
        surface: "#FFFFFF",
        primary: "#38BDF8", // Sky 400
        secondary: "#A78BFA", // Violet 400
        accent: "#F472B6", // Pink 400
        fresh: {
          bg: "#F0F9FF",
          border: "#1E293B", // Slate 800
          shadow: "#334155", // Slate 700
          main: "#6EE7B7", // Mint
          secondary: "#FDE047", // Fresh Yellow
          accent: "#C4B5FD", // Fresh Violet
          pink: "#F9A8D4", // Fresh Pink
          text: "#0F172A", // Slate 900
        }
      },
      boxShadow: {
        'cartoon': '4px 4px 0px 0px #1E293B',
        'cartoon-sm': '2px 2px 0px 0px #1E293B',
        'cartoon-lg': '8px 8px 0px 0px #1E293B',
        'cartoon-hover': '2px 2px 0px 0px #1E293B',
        'cartoon-active': '0px 0px 0px 0px #1E293B',
      },
      borderRadius: {
        'cartoon': '1.5rem', // Extra rounded
      },
      fontFamily: {
        sans: ['"Nunito"', '"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
