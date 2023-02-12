module.exports = {
  root: true,
  env: {
    node: true
  },
  parser: "vue-eslint-parser",
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended',
    'plugin:vue/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    extraFileExtensions: ['.vue'],
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'semi': 'error',
    'quotes': ['error','single'],
    'indent': ["error", 2],
    'vue/no-unused-components': process.env.NODE_ENV === 'production' ? 1 : 0,
    'standard/no-callback-literal': [0, ['cb', 'callback']]
  }
}
