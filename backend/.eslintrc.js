module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'prettier',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'prefer-const': 'warn',
    'prefer-destructuring': 'off',
    'default-param-last': 'warn',
    'no-useless-constructor': 'warn',
    'no-duplicate-imports': 'warn',
    'dot-notation': 'warn',
    'no-use-before-define': 'warn',
    eqeqeq: 'warn',
    'no-nested-ternary': 'warn',
    'no-else-return': 'warn',
    'no-new-wrappers': 'warn',
    'import/prefer-default-export': 'warn',
    'import/first': 'warn',
    'import/extensions': 'warn',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    // 'no-console': 'error',
  },
};
