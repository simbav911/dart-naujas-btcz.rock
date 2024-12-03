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
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
