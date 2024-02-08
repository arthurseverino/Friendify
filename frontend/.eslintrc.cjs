module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: {
    react: { version: '18.2' },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'prefer-const': 'warn',
    'prefer-destructuring': 'off',
    'default-param-last': 'warn',
    'no-useless-constructor': 'warn',
    'no-duplicate-imports': 'warn',
    'dot-notation': 'warn',
    'no-use-before-define': 'warn',
    eqeqeq: 'warn',
   // 'no-nested-ternary': 'warn',
    'no-else-return': 'warn',
    'no-new-wrappers': 'warn',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'react/prop-types': 'off',
    'react/jsx-no-target-blank': 'off',
    'react-hooks/exhaustive-deps': 'off',
  },
};
