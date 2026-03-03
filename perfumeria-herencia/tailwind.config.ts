import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C2A27A',    // Champagne suave
        dark: '#111111',       // Negro elegante
        background: '#F4F2EE', // Marfil
        accent: '#8C6A43',     // Oro envejecido
        deep: '#382d2c',       // Mantener para compatibilidad
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'widest-xl': '0.35em',
        'widest-2xl': '0.4em',
      },
    },
  },
  plugins: [],
}
export default config
