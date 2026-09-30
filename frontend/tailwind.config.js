/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#0A0A0F',
        darkSurface: '#13131A',
        darkCard: '#181824',
        darkBorder: '#232332',
        spark: {
          500: '#E8472A',
          600: '#D03B20',
          glow: 'rgba(232, 71, 42, 0.35)'
        },
        violetAccent: {
          500: '#6C47FF',
          600: '#5A35E5',
          glow: 'rgba(108, 71, 255, 0.35)'
        },
        textPrimary: '#F2F2F2',
        textMuted: '#6B7280'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-spark': '0 0 25px rgba(232, 71, 42, 0.3)',
        'glow-violet': '0 0 25px rgba(108, 71, 255, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      }
    },
  },
  plugins: [],
}
