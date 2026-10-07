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
        // Theme Colors (Clean White Light Theme with Soft Slate Canvas)
        background: '#F1F5F9',
        card: '#FFFFFF',
        elevated: '#FFFFFF',
        border: '#E2E8F0',
        
        // Brand Primary & Hover Dark Orange
        primary: {
          DEFAULT: '#B84C00',
          hover: '#9C3800',
          button: '#B84C00',
          accent: '#CC5500',
          soft: 'rgba(184, 76, 0, 0.10)',
          foreground: '#FFFFFF',
        },

        // Sidebar Theme Colors (Dark Orange Sidebar)
        sidebar: {
          DEFAULT: '#B84C00',
          hover: '#A33E00',
          active: '#8F3800',
          foreground: '#FFFFFF',
          muted: '#FED7AA',
        },

        // Text Colors
        foreground: '#0F172A',
        muted: {
          DEFAULT: '#F1F5F9',
          foreground: '#64748B',
        },

        // Status Colors
        success: {
          DEFAULT: '#16A34A',
          foreground: '#FFFFFF',
          bg: 'rgba(22, 163, 74, 0.10)',
        },
        warning: {
          DEFAULT: '#D97706',
          foreground: '#FFFFFF',
          bg: 'rgba(217, 119, 6, 0.10)',
        },
        danger: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
          bg: 'rgba(220, 38, 38, 0.10)',
        },
        info: {
          DEFAULT: '#2563EB',
          foreground: '#FFFFFF',
          bg: 'rgba(37, 99, 235, 0.10)',
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
        glow: '0 0 20px -5px rgba(184, 76, 0, 0.25)',
      },
    },
  },
  plugins: [],
};
