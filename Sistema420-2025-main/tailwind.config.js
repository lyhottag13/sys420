const { colors } = require('tailwindcss/defaultTheme');


module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        red: {
          ...colors.red,
          '800': '#f8546c',
          '900': '#ed354e'
        },
        gray: {
          ...colors.gray,
          '300': '#f0ecec',
          '400': '#929292',
          '500': '#34353c'
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
