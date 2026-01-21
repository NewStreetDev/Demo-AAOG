/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(142, 76%, 36%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        secondary: {
          DEFAULT: 'hsl(30, 25%, 45%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        accent: {
          DEFAULT: 'hsl(45, 93%, 47%)',
          foreground: 'hsl(0, 0%, 0%)',
        },
        apicultura: 'hsl(45, 93%, 47%)',
        agro: 'hsl(142, 76%, 36%)',
        pecuario: 'hsl(25, 75%, 47%)',
        finca: 'hsl(200, 18%, 46%)',
        finanzas: 'hsl(217, 91%, 60%)',
      },
    },
  },
  plugins: [],
}
