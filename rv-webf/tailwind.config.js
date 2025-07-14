/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Scan all Vue, JS, TS, JSX, TSX files in src
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}