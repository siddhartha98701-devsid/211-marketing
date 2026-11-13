/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#F6F2EA', // Warm Ivory
          warm: '#F6F2EA',
          muted: '#EDE7DC',
          subtle: '#F0ECE4'
        },
        navy: {
          DEFAULT: '#263947', // Ink Navy
          deep: '#1C2B36',
          light: '#324A5C',
          dark: '#16222B'
        },
        stone: {
          soft: '#D8D1C6', // Soft Stone (rules and borders)
          rule: '#E2DCD2'
        },
        taupe: {
          quiet: '#9A8A72', // Quiet Taupe (labels and accents)
          dark: '#7A6C56',
          light: '#B3A58F'
        }
      },
      fontFamily: {
        serif: ['"EB Garamond"', 'Garamond', 'Georgia', 'serif'],
        sans: ['Lato', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif']
      },
      screens: {
        xs: '390px'
      }
    }
  },
  plugins: []
};
