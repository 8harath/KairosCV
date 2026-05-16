import tseslint from "typescript-eslint"

export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "documentation/**",
      "public/**",
      "uploads/**",
      "outputs/**",
    ],
  },
  ...tseslint.config({
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: false,
      },
    },
    rules: {},
  }),
]
