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
        midnight: {
          950: '#07080e',
          900: '#0c0e17',
          800: '#141824',
          700: '#1c2234',
          600: '#273046'
        },
        roseNeon: {
          500: '#ff2d60',
          600: '#e61d50',
          glow: 'rgba(255, 45, 96, 0.4)'
        },
        violetNeon: {
          500: '#8b5cf6',
          600: '#7c3aed',
          glow: 'rgba(139, 92, 246, 0.4)'
        },
        cyanNeon: {
          500: '#06b6d4',
          glow: 'rgba(6, 182, 212, 0.4)'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-rose': '0 0 25px rgba(255, 45, 96, 0.25)',
        'glow-violet': '0 0 25px rgba(139, 92, 246, 0.25)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
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
