/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{app,components,libs,pages,hooks}/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        handwriting: ['Pacifico', 'cursive'],
      },
      colors: {
        brand: {
          DEFAULT: '#2563eb',
          light: '#3b82f6',
          dark: '#1e40af',
          accent: '#38bdf8',
          muted: '#93c5fd',
        },
        gsg: {
          purple: '#6B21A8',
          'purple-light': '#A78BFA',
          'purple-dark': '#581C87',
          black: '#0F0F0F',
          white: '#FFFFFF',
          accent: '#C4B5FD',
        },
      },
      borderRadius: {
        'pill': '9999px',
        'card': '1rem',
        'card-lg': '1.5rem',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
    },
  },
  plugins: [],
}

