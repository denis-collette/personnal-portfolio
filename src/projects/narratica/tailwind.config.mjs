/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/projects/narratica/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'narratica-dark': '#121212',       // The main dark background
        'narratica-gray-light': '#282828', // Cards, player background
        'narratica-gray-dark': '#181818',  // Hover states, secondary background
        'narratica-green': '#1DB954',      // Primary buttons, accents
        'narratica-text-primary': '#FFFFFF',
        'narratica-text-secondary': '#B3B3B3',
      },
    },
  },
  plugins: [],
};