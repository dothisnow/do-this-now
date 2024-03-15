/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          50: '#ebffff',
          100: '#cdfbff',
          200: '#a2f6ff',
          300: '#62edfe',
          400: '#1bd9f5',
          500: '#00bcdb',
          600: '#029ec2',
          700: '#097895',
          800: '#126178',
          900: '#135066',
          950: '#063446',
        },
      },
    },
  },
  plugins: [],
}
