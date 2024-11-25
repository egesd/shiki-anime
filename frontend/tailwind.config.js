// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,js,svelte}'],
  theme: {
    extend: {
      colors: {
        primary: '#7ED4AD',
        secondary: '#D76C82',
        accent1: '#B03052',
        accent2: '#3D0301',
        gray: '#2D2D2D',
      },
      fontSize: {
        'h1': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }], // e.g., 36px
        'h2': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '600' }], // e.g., 30px
        'h3': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }], // e.g., 24px
        'h4': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '500' }], // e.g., 20px
        'paragraph': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }], // e.g., 16px for regular text
        'small': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }], // e.g., 14px
      },
      fontFamily: {
        yoruka: ['Yoruka'], // Custom font family
        bruce:['Bruce'],
      },
    },
  },
  plugins: [],
};
