/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      colors: {
        ink: {
          900: 'rgb(var(--ink-900) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
          500: 'rgb(var(--ink-500) / <alpha-value>)',
          300: 'rgb(var(--ink-300) / <alpha-value>)',
          100: 'rgb(var(--ink-100) / <alpha-value>)'
        },
        brand: {
          50:  'rgb(var(--brand-50) / <alpha-value>)',
          100: 'rgb(var(--brand-100) / <alpha-value>)',
          200: 'rgb(var(--brand-200) / <alpha-value>)',
          400: 'rgb(var(--brand-400) / <alpha-value>)',
          500: 'rgb(var(--brand-500) / <alpha-value>)',
          600: 'rgb(var(--brand-600) / <alpha-value>)',
          700: 'rgb(var(--brand-700) / <alpha-value>)',
          900: 'rgb(var(--brand-900) / <alpha-value>)'
        },
        canvas: {
          DEFAULT: 'rgb(var(--canvas) / <alpha-value>)',
          card:    'rgb(var(--canvas-card) / <alpha-value>)',
          subtle:  'rgb(var(--canvas-subtle) / <alpha-value>)'
        },
        success: {
          50:  'rgb(var(--success-50) / <alpha-value>)',
          500: 'rgb(var(--success-500) / <alpha-value>)'
        },
        danger: {
          50:  'rgb(var(--danger-50) / <alpha-value>)',
          500: 'rgb(var(--danger-500) / <alpha-value>)'
        },
        warn: {
          50:  'rgb(var(--warn-50) / <alpha-value>)',
          500: 'rgb(var(--warn-500) / <alpha-value>)'
        }
      },
      boxShadow: {
        card: '0 1px 2px rgba(10,19,48,0.04), 0 18px 40px -12px rgba(10,19,48,0.12)',
        pop:  '0 14px 36px -10px rgba(11,95,255,0.45)',
        glass:'0 1px 0 0 rgba(255,255,255,0.6) inset, 0 24px 60px -20px rgba(10,19,48,0.20)'
      },
      borderRadius: {
        xl2: '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2rem'
      },
      backdropBlur: { xs: '2px' },
      keyframes: {
        pulseSoft: {
          '0%,100%': { opacity: '1', transform: 'scale(1)' },
          '50%':     { opacity: '.6', transform: 'scale(.95)' }
        },
        pop: {
          '0%':   { transform: 'scale(.6)', opacity: '0' },
          '60%':  { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        slideUp: {
          '0%':   { transform: 'translateY(14px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' }
        },
        floatY: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-4px)' }
        },
        ringSpin: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        sheen: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        'pulse-soft': 'pulseSoft 1.8s ease-in-out infinite',
        'pop':        'pop 600ms cubic-bezier(.2,.9,.3,1.2)',
        'slide-up':   'slideUp 420ms cubic-bezier(.2,.7,.2,1) both',
        'float-y':    'floatY 4s ease-in-out infinite',
        'ring-spin':  'ringSpin 2.4s linear infinite',
        'sheen':      'sheen 3s linear infinite'
      }
    }
  },
  plugins: []
}
