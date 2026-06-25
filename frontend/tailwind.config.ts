import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: {
        cream: "#FAF0DC",
        brown: "#5C3D1E",
        salmon: "#E8855A",
        "yellow-soft": "#F5D98B",
        "teal-soft": "#7FB5AA",
        "olive-soft": "#B5BF8F",
      },
      fontFamily: {
        linter: ["var(--font-linter)", "sans-serif"],
        "inria-serif": ["var(--font-inria-serif)", "serif"],
      },
    },
  },
} satisfies Config;
