/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  // Follow the OS theme, except where <html> forces one: light-only / dark-only (api-pricing toggle)
  darkMode: ['variant', ['@media (prefers-color-scheme: dark) { &:not(.light-only *) }', '&:is(.dark-only *)']],
  theme: {
    extend: {
      fontFamily: {
        bitter: ["Arial", "serif"],
        worksans: ["Arial", "sans-serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#666',
            a: {
              color: '#3662ff',
              '&:hover': {
                color: '#203ff6',
              },
            },
          },
        },
      }
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'black': colors.black,
      'white': colors.white,
      'gray': colors.gray,
      'blue': colors.blue,
      'indigo': colors.indigo,
      'yellow': colors.yellow,
      'green': colors.green,
      'red': colors.red,
      'light': '#EEFEF8',
      'lighter': '#EEFEF8',
      'dark': '#121212',
      'primary': '#3662ff',
      'top-banner': '#7449ee',
    },
  },
  plugins: [require('flowbite-typography'), require('tailwind-scrollbar'),],
}
