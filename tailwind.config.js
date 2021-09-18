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
      height: theme => ({
        "screen-1/2": "50vh",
        "screen-1/3": "calc(100vh / 3)",
        "screen-2/3": "calc(100vh * 0.66666)",
        "screen-1/4": "calc(100vh / 4)",
        "screen-1/5": "calc(100vh / 5)",
        "screen-3/4": "calc(100vh * 0.75)",
      }),
      width: theme => ({
        "screen-1/2": "50vh",
        "screen-1/3": "calc(100vh / 3)",
        "screen-2/3": "calc(100vh * 0.66666)",
        "screen-1/4": "calc(100vh / 4)",
        "screen-1/5": "calc(100vh / 5)",
        "screen-3/4": "calc(100vh * 0.75)",
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
