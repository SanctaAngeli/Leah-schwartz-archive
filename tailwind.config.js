/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gallery: '#FAFAFA',
        'text-primary': '#1A1A1A',
        'text-secondary': '#4A4A4A',
        'text-muted': '#8A8A8A',
        'accent-soft-blue': '#E8F0F8',
        'accent-warm': '#F5F0EB',
      },
      fontFamily: {
        heading: ['EB Garamond', 'Times New Roman', 'serif'],
        body: ['Inter', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'drift': 'cubic-bezier(0.37, 0, 0.63, 1)',
      },
      borderRadius: {
        'pill': '9999px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}
