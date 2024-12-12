/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',   // Main entry file (App.tsx or App.js)
    './components/**/*.{js,jsx,ts,tsx}',  // If you have a components directory
    './screens/**/*.{js,jsx,ts,tsx}',     // If you have a screens directory
    './services/**/*.{js,jsx,ts,tsx}',    // For service-related files if any
  ],
  presets: [require('nativewind/preset')], // Preset for NativeWind
  theme: {
    extend: {},
  },
  plugins: [],
};
