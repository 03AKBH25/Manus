/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        surface: "rgba(24, 24, 27, 0.6)",
        surfaceHover: "rgba(39, 39, 42, 0.8)",
        primary: "#8b5cf6",
        primaryDark: "#7c3aed",
        secondary: "#d946ef",
        accent: "#10b981",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      }
    },
  },
  plugins: [],
}
