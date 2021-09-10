const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        lime: colors.lime,
        emerald: colors.emerald,
        'custom-gray-a': '#161b22',
        'custom-gray-b': '#0d1117',
        'custom-pink-a': '#fcefed'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
