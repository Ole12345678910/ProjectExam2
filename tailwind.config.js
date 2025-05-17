export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yellowMain: "#FFDD00",
        blackMain: "#262626",
        greySecond: "#EDEDED",
        inputColor: "#B3B3B",
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],  // Make sure this is correct
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
