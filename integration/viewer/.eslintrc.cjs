/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['../../configs/base.eslintrc.json'],
  ignorePatterns: ['**/{css,node_modules,lib}', 'vite.*.ts'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json'
  }
};