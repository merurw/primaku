/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/**/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        'semantic-green': 'var(--semantic-green)',
        'negative-red': 'var(--negative-red)',
        'primaku-grey': 'var(--primaku-grey)'
      },
      keyframes: {
        shake: {
          '25%': { transform: 'translateX(4px)' },
          '50%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' }
        }
      },
      animation: {
        shake: 'shake 300ms'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
