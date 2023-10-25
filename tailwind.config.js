/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-user-info":
          "linear-gradient(180deg, #FAF9FB 0%, #E3DDE8 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-pink":
          "linear-gradient(90deg, #F4A26E 0%, #EF858C 33.33%, #BA79B1 66.67%, #9070AF 100%)",
      },
      boxShadow: {
        "manner-mode": "0px 4px 16px 0px rgba(0, 0, 0, 0.15)",
      },
      transitionProperty: {
        height: "height",
      },
      animation: {
        stretch1: "stretch1 1s ease-in-out infinite",
        stretch2: "stretch2 1s ease-in-out 0.1s infinite",
        stretch3: "stretch3 1s ease-in-out 0.2s infinite",
        stretch4: "stretch3 1s ease-in-out 0.3s infinite",
        stretch5: "stretch2 1s ease-in-out 0.4s infinite",
        stretch6: "stretch1 1s ease-in-out 0.5s infinite",
      },
      keyframes: {
        stretch1: {
          "0%": { height: "20%" },
          "50%": { height: "40%" },
          "100%": { height: "20%" },
        },
        stretch2: {
          "0%": { height: "35%" },
          "50%": { height: "55%" },
          "100%": { height: "35%" },
        },
        stretch3: {
          "0%": { height: "50%" },
          "50%": { height: "75%" },
          "100%": { height: "50%" },
        },
      },
    },
  },
  plugins: [require("daisyui")],
};
