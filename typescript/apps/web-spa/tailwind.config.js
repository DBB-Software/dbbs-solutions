const tailwindConfig = require('@dbbs/tailwind-components/src/baseTailwindConfig')

/** @type {import('tailwindcss').Config} */
export default {
  ...tailwindConfig,
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', '../../packages/tailwind-components/**/*.{js,ts,jsx,tsx}']
}
