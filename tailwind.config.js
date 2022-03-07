module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      maxWidth: {
        xxs: "20rem",
      },
      colors: {
        primary: "#42b883",
        gray: {
          850: "hsl(0, 0%, 13%)",
          950: "hsl(0, 0%, 10%)",
        },
        divider: "hsl(255, 0%, 60%)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
