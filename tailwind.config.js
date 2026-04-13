/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional Audit System Colors
        background: '#F1F5F9',
        foreground: '#1E293B',
        card: '#FFFFFF',
        'card-foreground': '#1E293B',
        primary: {
          DEFAULT: '#2563EB',
          foreground: '#FFFFFF',
          hover: '#1D4ED8',
          pressed: '#1E40AF',
        },
        secondary: {
          DEFAULT: '#E2E8F0',
          foreground: '#475569',
        },
        muted: {
          DEFAULT: '#F8FAFC',
          foreground: '#64748B',
        },
        accent: {
          DEFAULT: '#F1F5F9',
          foreground: '#1E293B',
        },
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },
        border: '#E2E8F0',
        input: '#E2E8F0',
        ring: '#2563EB',
        sidebar: {
          DEFAULT: '#0F172A',
          foreground: '#F8FAFC',
          primary: '#3B82F6',
          'primary-foreground': '#FFFFFF',
          accent: '#1E293B',
          'accent-foreground': '#F8FAFC',
          border: '#1E293B',
        },
        success: {
          DEFAULT: '#16A34A',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#CA8A04',
          foreground: '#FFFFFF',
        },
        chart: {
          1: '#2563EB',
          2: '#16A34A',
          3: '#CA8A04',
          4: '#DC2626',
          5: '#7C3AED',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
