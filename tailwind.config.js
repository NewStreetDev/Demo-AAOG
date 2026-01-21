/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors - Verde AAOG principal
        brand: {
          DEFAULT: '#1e5631',
          light: '#2d7a4a',
          dark: '#163f24',
          foreground: '#ffffff',
        },
        primary: {
          DEFAULT: '#1e5631',
          light: '#2d7a4a',
          dark: '#163f24',
          foreground: '#ffffff',
        },
        // Module colors
        modules: {
          agricultura: '#10b981',
          pecuario: '#f97316',
          apicultura: '#fbbf24',
          procesamiento: '#7c3aed',
          finanzas: '#3b82f6',
        },
        // Status colors
        status: {
          success: '#22c55e',
          warning: '#f59e0b',
          danger: '#ef4444',
          info: '#3b82f6',
        },
        // Inventory status
        inventory: {
          stock: '#10b981',
          low: '#f59e0b',
          critical: '#ef4444',
        },
        // Legacy support (mantener compatibilidad)
        apicultura: '#fbbf24',
        agro: '#10b981',
        pecuario: '#f97316',
        finca: '#1e5631',
        finanzas: '#3b82f6',
      },
    },
  },
  plugins: [],
}
