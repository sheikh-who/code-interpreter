module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true
  },
  extends: ['eslint:recommended', 'plugin:node/recommended', 'plugin:security/recommended', 'prettier'],
  plugins: ['security'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'script'
  },
  rules: {
    'no-console': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-missing-require': 'off'
  }
};
