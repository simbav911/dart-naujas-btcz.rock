module.exports = {
  content: ['./layouts/**/*.html', './content/**/*.md'],
  theme: {
    extend: {
      colors: {
        btcz: {
          gold: '#FFD700',
          gray: {
            200: '#E5E7EB',  // Lighter text color
            400: '#9CA3AF',  // Muted text color
            700: '#374151',  // Darker background
            800: '#1F2937',  // Dark background
            900: '#111827',  // Darker background
            950: '#030712'   // Darkest background
          }
        }
      },
      animation: {
        'gradient-x': 'gradient-x 5s ease infinite',
        'pulse': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 
            'background-position': '0% 50%'
          },
          '50%': { 
            'background-position': '100% 50%'
          }
        },
        'pulse': {
          '0%, 100%': { 
            opacity: 1 
          },
          '50%': { 
            opacity: 0.5 
          }
        }
      },
      perspective: {
        '1000': '1000px'
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#E5E7EB', // btcz-gray-200
            h1: {
              color: '#FFD700', // btcz-gold
            },
            h2: {
              color: '#FFD700', // btcz-gold
            },
            h3: {
              color: '#FFD700', // btcz-gold
            },
            strong: {
              color: '#E5E7EB', // btcz-gray-200
            },
            a: {
              color: '#FFD700', // btcz-gold
              '&:hover': {
                color: '#FFFFFF',
              },
            },
            code: {
              color: '#FFD700', // btcz-gold
            },
            blockquote: {
              color: '#E5E7EB', // btcz-gray-200
              borderLeftColor: '#FFD700', // btcz-gold
            },
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
