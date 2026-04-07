/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FDFAF5',
        green: {
          farm: '#3B6B35',
          light: '#5A9A52',
        },
        brown: {
          dark: '#2C1A0E',
          light: '#8B6347',
        },
        accent: '#E8A838',
        border: '#E5DDD0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}