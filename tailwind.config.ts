/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./error.vue",
  ],
  theme: {
    extend: {
      screens: {
        sm: "576px",
        md: "768px",
        lg: "1024px",
        xl: "1200px",
      },
      container: {
        lg: "1200px",
      },
      colors: ({ colors }) => ({
        inherit: colors.inherit,
        current: colors.current,
        transparent: colors.transparent,
        black: colors.black,
        white: colors.white,
        slate: colors.slate,
        gray: colors.gray,
        zinc: colors.zinc,
        neutral: colors.neutral,
        stone: colors.stone,
        red: colors.red,
        orange: colors.orange,
        amber: colors.amber,
        yellow: colors.yellow,
        lime: colors.lime,
        green: colors.green,
        emerald: colors.emerald,
        teal: colors.teal,
        cyan: colors.cyan,
        sky: colors.sky,
        blue: colors.blue,
        indigo: colors.indigo,
        violet: colors.violet,
        purple: colors.purple,
        fuchsia: colors.fuchsia,
        pink: colors.pink,
        rose: colors.rose,
      }),
      keyframes: {
        "slide-down": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0%)" },
        },
        "bounce-left": {
          "0%": { transform: "translate3d(100%, -50%, 0)" },
          "50%": { transform: "translate3d(-30px, -50%, 0)" },
          "100%": { transform: "translate3d(0, -50%, 0)" },
        },
        "bounce-right": {
          "0%": { transform: "translate3d(0, -50%, 0)" },
          "50%": { transform: "translate3d(calc(100% + 30px), -50%, 0)" },
          "100%": { transform: "translate3d(100%, -50%, 0)" },
        },
      },
    },
  },
  plugins: [],
};
