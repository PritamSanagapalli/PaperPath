/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'paper': '#3b82f6',
        'method': '#10b981',
        'result': '#f59e0b',
        'disease': '#ef4444',
        'region': '#8b5cf6',
      }
    },
  },
  plugins: [],
}
