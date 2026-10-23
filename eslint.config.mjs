import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tseslint.config(
  {
    ignores: ['node_modules/', 'playwright-report/', 'test-results/'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.ts', 'pages/**/*.ts', 'fixtures/**/*.ts'],
  }
);