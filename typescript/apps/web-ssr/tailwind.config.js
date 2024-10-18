const tailwindConfig = require('@dbbs/tailwind-components/src/baseTailwindConfig')

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...tailwindConfig,
  content: ['./src/**/*.{js,ts,jsx,tsx}', '../../packages/tailwind-components/src/**/*.{js,ts,jsx,tsx}']
}
