/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        phonepe: {
          primary: '#5f259f',
          light: '#f2f2f2',
          purple: {
            50: '#f5f0fa',
            100: '#eadff5',
            500: '#5f259f',
            600: '#4d1e80',
            700: '#3a1660',
          }
        },
        sentinel: {
          50: '#f4f7fc',
          100: '#e8eff8',
          200: '#d0def1',
          300: '#a8c3e5',
          400: '#79a2d5',
          500: '#4d80c3',
          600: '#2b5ea3',
          700: '#1e4882',
          800: '#183a69',
          900: '#142f53',
          accent: '#0A84FF',
          success: '#30D158',
          warning: '#FF9F0A',
          danger: '#FF453A',
          shield: '#2563EB',
        },
        surface: {
          bg: '#F8F9FA',
          subtle: '#F2F4F7',
          card: 'rgba(255, 255, 255, 0.85)',
          cardOpaque: '#FFFFFF',
          glass: 'rgba(255, 255, 255, 0.72)',
          border: 'rgba(226, 232, 240, 0.8)',
          glassBorder: 'rgba(255, 255, 255, 0.65)',
        },
        ink: {
          primary: '#111827',
          secondary: '#4B5563',
          muted: '#8E8E93',
          faint: '#C7C7CC',
        }
      },
      fontFamily: {
        apple: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          '"Helvetica Neue"',
          "sans-serif"
        ],
      },
      borderRadius: {
        'ios-sm': '14px',
        'ios': '20px',
        'ios-lg': '24px',
        'ios-xl': '28px',
        'ios-2xl': '34px',
      },
      boxShadow: {
        'ios-card': '0 4px 20px -2px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'ios-glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'ios-float': '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.04)',
        'ios-glow-blue': '0 0 25px -3px rgba(10, 132, 255, 0.25)',
        'ios-glow-green': '0 0 25px -3px rgba(48, 209, 88, 0.25)',
        'ios-glow-amber': '0 0 25px -3px rgba(255, 159, 10, 0.25)',
        'ios-glow-red': '0 0 25px -3px rgba(255, 69, 58, 0.25)',
      },
      backdropBlur: {
        'xs': '2px',
        '2xl': '40px',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'scan': 'scanLine 2s infinite linear',
        'shimmer': 'shimmer 1.5s infinite',
      }
    },
  },
  plugins: [],
}
