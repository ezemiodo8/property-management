/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2b2d42',
        secondary: '#8d99ae',
        accent: '#ef233c',
        background: '#f7f8fa',
      },
    },
  },
  plugins: [],
};