const tailwindConfig = require('@dbbs/tailwind-components/src/baseTailwindConfig')

/** @type {import('tailwindcss').Config} */
export default {
  ...tailwindConfig,
  content: ['./app/**/*.{js,ts,jsx,tsx}', '../../packages/tailwind-components/src/**/*.{js,ts,jsx,tsx}']
}
