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


        booked: "#f8d7da",   // Redish
        mine: "#d1ecf1",     // Light blue
        editing: "#ffcc80",  // Orange
        selected: "#90ee90", // Green
        start: "#ffdeac",    // Light orange

        cancelBtnBorder: "#262626",
        cancelBtnColor: "#D9D9D9",
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
