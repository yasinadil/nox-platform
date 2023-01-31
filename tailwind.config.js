/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      'mobile': '319px',
      // => @media (min-width: 420px) { ... }
  
      'tablet': '768px',
      // => @media (min-width: 768px) { ... }
  
      'laptop': '1024px',
      // => @media (min-width: 1024px) { ... }
  
      'desktop': '1280px',
      // => @media (min-width: 1280px) { ... }
  
      'lgDesktop': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
  },
 
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
};
