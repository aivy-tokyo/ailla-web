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
        'gradient-user-info': 'linear-gradient(180deg, #FAF9FB 0%, #E3DDE8 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-pink': 'linear-gradient(90deg, #F4A26E 0%, #EF858C 33.33%, #BA79B1 66.67%, #9070AF 100%)'
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
