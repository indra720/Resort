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
        // Theme Colors (Clean White & Slate Canvas with Joy Resorts Forest Green)
        background: '#F8FAFC',
        card: '#FFFFFF',
        elevated: '#FFFFFF',
        border: '#E5E7EB',
        
        // Brand Primary & Hover Joy Resorts Forest Green
        primary: {
          DEFAULT: '#0F5132',
          hover: '#0B3D25',
          button: '#0F5132',
          accent: '#16A34A',
          soft: '#DCFCE7',
          foreground: '#FFFFFF',
        },

        // Sidebar Theme Colors (Clean White Sidebar with Forest Green Active Pill)
        sidebar: {
          DEFAULT: '#FFFFFF',
          hover: '#F3F4F6',
          active: '#0F5132',
          foreground: '#374151',
          activeText: '#FFFFFF',
          muted: '#6B7280',
          border: '#E5E7EB',
        },

        // Text Colors
        foreground: '#111827',
        muted: {
          DEFAULT: '#F3F4F6',
          foreground: '#6B7280',
        },

        // Metric & Status Colors
        metric: {
          leads: '#22C55E',
          enquiries: '#3B82F6',
          visits: '#F97316',
          bookings: '#8B5CF6',
          revenue: '#10B981',
        },

        success: {
          DEFAULT: '#16A34A',
          foreground: '#FFFFFF',
          bg: '#DCFCE7',
        },
        warning: {
          DEFAULT: '#D97706',
          foreground: '#FFFFFF',
          bg: '#FEF3C7',
        },
        danger: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
          bg: '#FEE2E2',
        },
        info: {
          DEFAULT: '#2563EB',
          foreground: '#FFFFFF',
          bg: '#E0F2FE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        xl: '14px',
        lg: '10px',
        md: '8px',
        sm: '6px',
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        card: '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 2px 4px -1px rgb(0 0 0 / 0.04)',
        glow: '0 0 20px -5px rgba(15, 81, 50, 0.25)',
      },
    },
  },
  plugins: [],
};
