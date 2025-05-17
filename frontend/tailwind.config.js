// tailwind.config.js
module.exports = {
  darkMode: 'class', // Permite que el modo oscuro se active mediante una clase
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}', // Asegúrate de que Tailwind pueda analizar tu código
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3490dc',
        secondary: '#2d3748',
      },
    },
  },
  plugins: [],
}
