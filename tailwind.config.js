/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        navy: {
          950: '#050814',
          900: '#080d1f',
          800: '#0d1530',
          700: '#111d3f',
          600: '#162352',
        },
        accent: {
          DEFAULT: '#6366f1',
          hover: '#818cf8',
          muted: 'rgba(99,102,241,0.15)',
        }
      },
      boxShadow: {
        'glow': '0 0 30px rgba(99,102,241,0.15)',
        'glow-sm': '0 0 12px rgba(99,102,241,0.1)',
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)',
      }
    },
  },
  plugins: [],
}
