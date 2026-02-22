/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#E8EDF4',
          100: '#C5D0E6',
          200: '#9BAFD0',
          300: '#7190BA',
          400: '#4A71A4',
          500: '#1E3A5F',
          600: '#162D4D',
          700: '#0F213B',
          800: '#0B1F3A',
          900: '#071629',
          950: '#040D19',
        },
        dark: {
          bg: '#0f1117',
          card: '#181a20',
          border: '#23262f',
          hover: '#1e2028',
          surface: '#1a1c23',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
