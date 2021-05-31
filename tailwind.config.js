module.exports = {
  purge: [
    './**/*.html',
    './**/*.js'
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#20b6f2',
        secondly: '#fd9562',
        'primary-dark': '#0086bf',
        'secondly-dark': '#c66636'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
} 
