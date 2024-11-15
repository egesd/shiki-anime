// .prettierrc.js
module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  svelteSortOrder: "scripts-markup-styles",
  svelteStrictMode: true,
  svelteBracketNewLine: true,
  svelteAllowShorthand: true,
  svelteIndentScriptAndStyle: true,
  trailingComma: 'es5',
  printWidth: 80,
	plugins: ["prettier-plugin-svelte"] // Ensure the Svelte plugin is included
};
