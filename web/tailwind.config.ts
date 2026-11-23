import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { botanical: "#4c1d95", sage: "#0f766e" } } },
  plugins: [],
};
export default config;
