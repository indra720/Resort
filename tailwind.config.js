/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Theme Colors
        background: '#0B0B0F',
        card: '#14141A',
        elevated: '#1C1C24',
        border: '#2A2A35',
        
        // Brand Primary & Hover Orange
        primary: {
          DEFAULT: '#FF6B00',
          hover: '#FF8A33',
          foreground: '#FFFFFF',
        },

        // Text Colors
        foreground: '#F5F5F7',
        muted: {
          DEFAULT: '#1C1C24',
          foreground: '#A1A1AA',
        },

        // Status Colors
        success: {
          DEFAULT: '#22C55E',
          foreground: '#FFFFFF',
          bg: 'rgba(34, 197, 94, 0.12)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          foreground: '#FFFFFF',
          bg: 'rgba(245, 158, 11, 0.12)',
        },
        danger: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
          bg: 'rgba(239, 68, 68, 0.12)',
        },
        info: {
          DEFAULT: '#3B82F6',
          foreground: '#FFFFFF',
          bg: 'rgba(59, 130, 246, 0.12)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '6px',
      },
      boxShadow: {
        glow: '0 0 20px -5px rgba(255, 107, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
