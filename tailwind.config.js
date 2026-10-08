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
        // Theme Colors (Clean White Light Theme with Dark Orange Branding)
        background: '#FFFFFF',
        card: '#FFFFFF',
        elevated: '#FFFFFF',
        border: '#E5E7EB',
        
        // Brand Primary & Hover Dark Orange
        primary: {
          DEFAULT: '#C2410C',
          hover: '#9A3412',
          button: '#C2410C',
          accent: '#D95F02',
          soft: '#FFF1E6',
          foreground: '#FFFFFF',
        },

        // Sidebar Theme Colors (Dark Orange Sidebar)
        sidebar: {
          DEFAULT: '#C2410C',
          hover: '#9A3412',
          active: '#FFF1E6',
          foreground: '#FFFFFF',
          muted: '#FED7AA',
        },

        // Text Colors
        foreground: '#1F2937',
        muted: {
          DEFAULT: '#FFF8F3',
          foreground: '#6B7280',
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
        glow: '0 0 20px -5px rgba(194, 65, 12, 0.25)',
      },
    },
  },
  plugins: [],
};
