/** @type {import('tailwindcss').Config} */
//Note about editing config:
//Code in the root of theme will override the Tailwind default (if there is one)
//If you want to add a new styling without replacing an old one, put it in extend
//might need custom font size for 32 px
module.exports = {
  content: ['./pages/**/*.jsx', './components/**/*.jsx'],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#1E2F97',
        'light-blue': '#85BDE5',
        'light-green': '#B5E585',
        'header-black': '#242429',
        'text-black': '#404040',
        'light-gray': '#F5F5F5',
      },
      fontFamily: {
        sans: ['var(--font-kumbh-sans)'],
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
