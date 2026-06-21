/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: { 50: '#fefdf8', 100: '#fdf9ec', 200: '#f9f0d0', DEFAULT: '#f5edd8' },
        teal: { 50: '#edf7f6', 100: '#d0eeec', 400: '#3aafa9', 600: '#1a7a74', 700: '#145f5a', 800: '#0e4440', DEFAULT: '#1a7a74' },
        saffron: { 400: '#f59e0b', 500: '#d97706', DEFAULT: '#f59e0b' },
        earth: { 600: '#92400e', DEFAULT: '#92400e' },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Hind', 'sans-serif'],
        sans: ['Hind', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
