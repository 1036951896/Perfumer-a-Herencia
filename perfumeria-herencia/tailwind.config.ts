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
        primary: '#C2A27A',    // Champagne
        dark: '#111111',       // Negro elegante
        background: '#F4F2EE', // Marfil cálido
        accent: '#8C6A43',     // Oro envejecido (separadores, activos)
        deep: '#1e293b',       // Azul profundo (botones principales)
        muted: '#737373',      // Texto secundario
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
