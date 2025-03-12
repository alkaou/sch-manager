/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'border-glow': 'borderGlow 3s infinite linear',
        'border-shine': 'borderShine 1s forwards',
        'typing': "typing 3s steps(20) infinite",
        'gradient': "gradient 3s ease infinite",
      },
      keyframes: {
        borderGlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        borderShine: {
          '0%': { borderColor: 'transparent' },
          '100%': { borderColor: 'rgba(99, 102, 241, 1)' }, // Indigo-500
        },
        typing: {
          "from": { width: "0" },
          "to": { width: "100%" },
        },
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    // require('tailwind-scrollbar'),
    require("daisyui"),
  ],
};