/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'theme-bg': {
          DEFAULT: 'var(--theme-bg)',
          secondary: 'var(--theme-bg-secondary)',
        },
        'theme-text': {
          DEFAULT: 'var(--theme-text)',
          secondary: 'var(--theme-text-secondary)',
        },
        'theme-border': 'var(--theme-border)',
        'theme-input': 'var(--theme-input)',
      },
    },
  },
  plugins: [],
};