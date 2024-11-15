// .eslintrc.js
module.exports = {
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:svelte/recommended', // Adds Svelte support for ESLint
  ],
  plugins: ['prettier', 'svelte3'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  rules: {
    'prettier/prettier': 'error', // Shows Prettier errors as ESLint errors
    'indent': ['error', 2], // Enforces consistent 2-space indentation
    'semi': ['error', 'always'], // Enforces semicolons
    'quotes': ['error', 'single'], // Enforces single quotes
    'svelte3/no-inline-styles': 2, // Disallows inline styles in Svelte components
    'svelte3/self-closing-comp': 2, // Enforces self-closing tags for components without children
  },
  settings: {
    'svelte3/ignore-styles': () => true,
  },
};