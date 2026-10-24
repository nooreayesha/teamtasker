/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Dark mode is driven by a `dark` class on <html> (see ThemeContext).
  darkMode: "class",
  theme: { extend: {} },
  plugins: [],
};
