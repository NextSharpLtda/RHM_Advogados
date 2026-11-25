module.exports = {
  content: ['./*.html', './assets/app.js'],
  theme: {
    extend: {
      colors: {
        brand: { orange: '#d86017', 'orange-light': '#f39200', navy: '#0b141b', 'navy-dark': '#060f16', 'card-bg': '#141d24', 'card-hover': '#1d2731', border: '#25323d' },
        surface: '#0b141b',
        'on-surface': '#dae4ed'
      },
      fontFamily: { sans: ['Hanken Grotesk', 'sans-serif'], serif: ['Libre Caslon Text', 'serif'], 'body-md': ['Hanken Grotesk', 'sans-serif'] }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
