/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'fantasy': ['Cinzel', 'serif'],
      },
      colors: {
        'card-bg': '#2a1810',
        'card-border': '#8b4513',
        'mana-blue': '#0ea5e9',
        'attack-orange': '#f97316',
        'health-red': '#ef4444',
      },
      boxShadow: {
        'card': '0 4px 8px rgba(0, 0, 0, 0.3), 0 6px 20px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 8px 16px rgba(0, 0, 0, 0.4), 0 12px 40px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
} 