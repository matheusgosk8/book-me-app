/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  // Use 'class' so the app can manually toggle dark mode at runtime
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto_400Regular', 'Roboto_700Bold'], 
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
