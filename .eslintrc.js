module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    // typescript的 eslint插件
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    // 整合typescript-eslint与prettier
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'prisma'],
  rules: {
    'no-undef': 'warn', // 禁止使用未定义的变量
    '@typescript-eslint/interface-name-prefix': 'off', // 接口名称必须以I开头
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',// 禁止使用any类型
    '@typescript-eslint/no-unused-vars': 'warn', // 禁止定义未使用的变量
    '@typescript-eslint/no-unsafe-return': 'warn', // 禁止返回any类型
    '@typescript-eslint/no-unsafe-call': 'warn', // 禁止调用any类型的值
    '@typescript-eslint/no-unsafe-member-access': 'warn', // 禁止访问any类型的值
    '@typescript-eslint/no-unsafe-assignment': 'warn', // 禁止对any类型的值进行赋值
    '@typescript-eslint/ban-ts-comment': 'off', // 禁止使用@ts-ignore注释
  },
};