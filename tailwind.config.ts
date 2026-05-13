import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import colors from 'tailwindcss/colors';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        app: 'var(--color-bg-app)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          secondary: 'var(--color-surface-secondary)',
        },
        content: {
          DEFAULT: 'var(--color-content)',
          secondary: 'var(--color-content-secondary)',
          subtle: 'var(--color-content-subtle)',
          muted: 'var(--color-content-muted)',
        },
        'dm-border': 'var(--color-border)',
        'dm-border-light': 'var(--color-border-light)',
        primary: {
          ...colors.violet,
          DEFAULT: '#7C3AED',
        },
        brand: {
          50: colors.violet[50],
          500: colors.violet[500],
          600: colors.violet[600],
          700: colors.violet[700],
        },
        secondary: {
          ...colors.teal,
          DEFAULT: '#0D9488',
        },
        success: {
          DEFAULT: '#10B981',
          light: 'rgba(16, 185, 129, 0.12)',
          'dark-light': 'rgba(16, 185, 129, 0.2)',
        },
        danger: {
          DEFAULT: '#F43F5E',
          light: 'rgba(244, 63, 94, 0.12)',
          'dark-light': 'rgba(244, 63, 94, 0.22)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: 'rgba(245, 158, 11, 0.14)',
          'dark-light': 'rgba(245, 158, 11, 0.22)',
        },
        info: {
          DEFAULT: '#0EA5E9',
          light: 'rgba(14, 165, 233, 0.12)',
          'dark-light': 'rgba(14, 165, 233, 0.2)',
        },
        score: {
          green: '#10B981',
          yellow: '#F59E0B',
          red: '#EF4444',
        },
        chrome: {
          sidebar: '#13111c',
          'sidebar-elevated': '#211f2d',
          accent: '#853bce',
        },
      },
      fontFamily: {
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        drama: ['var(--font-drama)', 'Georgia', 'Times New Roman', 'serif'],
        mono: ['var(--font-mono-data)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '8px',
      },
      spacing: {
        4.5: '18px',
      },
      boxShadow: {
        'nexus-sm': '0 1px 2px 0 rgb(15 23 42 / 0.05)',
        'nexus-md':
          '0 4px 6px -1px rgb(15 23 42 / 0.07), 0 2px 4px -2px rgb(15 23 42 / 0.05)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        enter: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.45s ease-out forwards',
        enter: 'enter 0.35s ease-out forwards',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--color-content-secondary)',
            '--tw-prose-headings': 'var(--color-content)',
            '--tw-prose-links': '#7C3AED',
          },
        },
      },
    },
  },
  plugins: [forms({ strategy: 'class' }), typography],
};

export default config;
