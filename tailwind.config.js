/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          50: "#F2FDF8",
          100: "#E5FAF0",
          200: "#C7F5DF",
          300: "#ADF0D1",
          400: "#8FEBC0",
          500: "#75E6B1",
          600: "#5BE1A3",
          700: "#3DDC92",
          800: "#1DA063",
          900: "#0E4E30",
          950: "#072718",
        },
        blue: {
          50: "#F5FCFF",
          100: "#EBF8FF",
          200: "#D1F0FF",
          300: "#BDE9FF",
          400: "#A3E0FF",
          500: "#8FDAFF",
          600: "#76D1FF",
          700: "#1AB2FF",
          800: "#007EBD",
          900: "#003D5C",
          950: "#001F2E",
        },
        pink: {
          50: "#FFFAFA",
          100: "#FEF6F5",
          200: "#FEECEC",
          300: "#FDE1E0",
          400: "#FCCCCA",
          500: "#FAB5B2",
          600: "#F99E9A",
          700: "#F67874",
          800: "#F2413B",
          900: "#BB120C",
          950: "#8B0D09",
        },
        brown: {
          50: "#FDFCFB",
          100: "#FAF7F4",
          200: "#F6F0EA",
          300: "#F1E8DF",
          400: "#EBDED0",
          500: "#E5D4C2",
          600: "#E1CCB7",
          700: "#DBC2A9",
          800: "#D3B597",
          900: "#CCA987",
          950: "#A57546",
        },
        gray: {
          50: "#F9FAFA",
          100: "#F7F7F8",
          200: "#ECECEF",
          300: "#E3E4E8",
          400: "#D8DADF",
          500: "#CFD1D7",
          600: "#A0A4B0",
          700: "#747A8B",
          800: "#4C505C",
          900: "#27292F",
          950: "#131316",
        },
      },
    },
  },
  plugins: [],
};
