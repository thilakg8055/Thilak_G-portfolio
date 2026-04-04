/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        acid: '#00FFB3',
        'acid-blue': '#00D4FF',
        'acid-dark': '#00B37A',
        'neon-blue': '#0080FF',
        dark: '#050A0E',
        'dark-2': '#0A1628',
        'dark-card': '#0D1F2D',
      },
    },
  },
  plugins: [],
}
