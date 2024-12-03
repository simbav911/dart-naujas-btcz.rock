/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.{html,md}",
    "./themes/**/*.{html,md}"
  ],
  theme: {
    extend: {
      colors: {
        btcz: {
          gold: '#FFD700',
          black: '#000000',
          white: '#FFFFFF',
          gray: {
            50: '#FAFAFA',
            100: '#F7F7F7',
            200: '#E5E5E5',
            300: '#D4D4D4',
            400: '#A3A3A3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#1F1F1F',
            900: '#171717'
          }
        }
      },
      fontFamily: {
        sans: ['Open Sans', 'ui-sans-serif', 'system-ui'],
        heading: ['Montserrat', 'ui-sans-serif', 'system-ui']
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#1F1F1F',
            h1: {
              color: '#FFD700',
            },
            h2: {
              color: '#FFD700',
            },
            h3: {
              color: '#FFD700',
            },
            h4: {
              color: '#FFD700',
            },
            a: {
              color: '#FFD700',
              '&:hover': {
                color: '#FFD700',
                opacity: 0.8,
              },
            },
            strong: {
              color: '#1F1F1F',
            },
            blockquote: {
              borderLeftColor: '#FFD700',
            },
            code: {
              color: '#FFD700',
              backgroundColor: '#F7F7F7',
            },
            pre: {
              backgroundColor: '#F7F7F7',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
