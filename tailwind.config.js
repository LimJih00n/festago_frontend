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
          50: '#fdf2f8',   // 매우 연한 분홍
          100: '#fce7f3',  // 연한 분홍
          200: '#fbcfe8',  // 밝은 분홍
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',  // 주 색상
          600: '#db2777',  // 진한 분홍 (hover)
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
      },
    },
  },
  plugins: [],
}
