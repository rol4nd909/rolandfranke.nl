module.exports = {
  plugins: [
    require.resolve('prettier-plugin-astro'),
  ],
  overrides: [
    {
      files: '*.astro',
      options: {
        tabWidth: 4,
        parser: 'astro',
      },
    },
    {
      files: "*.css",
      options: {
        tabWidth: 2,
        singleQuote: true
      }
    }
  ],
  astroAllowShorthand: true,
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  jsxBracketSameLine: false,
  trailingComma: "es5",
}