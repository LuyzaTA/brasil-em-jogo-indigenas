/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Primary colours inspired by the original “Brasil em Jogo” palette.
        primary: {
          DEFAULT: '#154734', // deep green
        },
        secondary: {
          DEFAULT: '#C9A94A', // gold/dourado
        },
      },
    },
  },
  plugins: [],
};