/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'oklch(0.13 0.005 260)',
        foreground: 'oklch(0.95 0 0)',
        primary: 'oklch(0.65 0.18 160)',
        destructive: 'oklch(0.55 0.22 25)',
        success: 'oklch(0.65 0.18 145)',
        warning: 'oklch(0.75 0.15 75)',
        sidebar: 'oklch(0.1 0.005 260)',
        accent: 'oklch(0.15 0.005 260)',
        'sidebar-accent': 'oklch(0.18 0.005 260)',
        border: 'oklch(0.25 0.005 260)',
        muted: 'oklch(0.2 0.005 260)',
        'muted-foreground': 'oklch(0.6 0 0)',
      }
    },
  },
  plugins: [],
}
