/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'eq-navy':   '#1B2A4A',
        'eq-green':  '#355E3B',
        'eq-maroon': '#800020',
        'eq-brown':  '#5C3D1E',
        'eq-gold':   '#C9A96E',
        'eq-gold-dark': '#A07840',
        'eq-cream':  '#F4EFE6',
        'eq-cream-dark': '#EDE5D8',
      },
      fontFamily: {
        sans: ['Georgia', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [],
}
