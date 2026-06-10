/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // All design tokens point at the CSS variables in globals.css, so
        // night mode (useTheme flips the vars) carries through every Tailwind
        // utility. Components reference these as bg-bg-gallery, text-bg-gallery,
        // bg-bg-glass, border-bg-glass-border, text-text-primary, etc.
        gallery: 'var(--bg-gallery)',
        'bg-gallery': 'var(--bg-gallery)',
        'bg-glass': 'var(--bg-glass)',
        'bg-glass-border': 'var(--bg-glass-border)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'accent-soft-blue': '#E8F0F8',
        'accent-warm': '#F5F0EB',
      },
      fontFamily: {
        heading: ['EB Garamond', 'Times New Roman', 'serif'],
        body: ['Inter', '-apple-system', 'sans-serif'],
        // "font-leah" is reserved for Leah's own voice phrases
        // (chapter taglines, pull-quote attributions). Use sparingly.
        leah: ['Caveat', 'Homemade Apple', 'Snell Roundhand', 'cursive'],
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
