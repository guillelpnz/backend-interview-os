/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 14px 40px -24px rgb(15 23 42 / 0.45)',
      },
      colors: {
        ink: {
          950: '#111416',
          900: '#171b1f',
          800: '#232930',
        },
      },
    },
  },
  plugins: [],
}
