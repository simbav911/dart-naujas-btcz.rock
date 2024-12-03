module.exports = {
  content: ['./layouts/**/*.html', './content/**/*.md'],
  theme: {
    extend: {
      colors: {
        btcz: {
          gold: '#FFD700',
          gray: {
            300: '#D1D5DB',
            800: '#1F2937',
            900: '#111827',
            950: '#030712'
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
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
