/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        risk: {
          critical: {
            text: '#b91c1c',
            solid: '#dc2626',
            bg: '#fef2f2',
            border: '#fca5a5',
          },
          high: {
            text: '#c2410c',
            solid: '#ea580c',
            bg: '#fff7ed',
            border: '#fdba74',
          },
          medium: {
            text: '#b45309',
            solid: '#d97706',
            bg: '#fffbeb',
            border: '#fcd34d',
          },
          low: {
            text: '#15803d',
            solid: '#16a34a',
            bg: '#f0fdf4',
            border: '#86efac',
          },
        },
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.07), 0 2px 4px -1px rgba(15, 23, 42, 0.04)',
        'elevated': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
