module.exports = {
  env: {
    browser: true,
    es2017: true,
    node: true
  },
  // extends: 'standard-with-typescript',
  extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/eslint-recommended",
      "plugin:@typescript-eslint/recommended",
      // "plugin:react/recommended",
      "plugin:prettier/recommended",
      // "prettier/@typescript-eslint",
      "plugin:nestjs/recommended",
      "prettier",
  ],
  overrides: [
    {
        "files": ["*.tsx"],
        "rules": {
            "react/prop-types": "off"
        }
    },
    {
        "files": ["*.js"],
        "rules": {
            "@typescript-eslint/no-var-requires": "off"
        }
    }
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'nestjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "nestjs/use-validation-pipe": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-empty-function": "off",
    "no-useless-escape": "off",
    "no-var": "off",
  }
}
