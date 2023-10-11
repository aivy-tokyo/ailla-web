/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-46.5':
          'linear-gradient(46.5deg, #F8B856 6.73%, #EF858C 26.64%, #BA79B1 46.55%, #9070AF 66.46%, #7B59A3 86.37%)',
      },
      boxShadow: {
        'manner-mode': '0px 4px 16px 0px rgba(0, 0, 0, 0.15)',
      },      
      transitionProperty: {
        'height': 'height',
      }
    },
  },
  plugins: [require("daisyui")],
}
