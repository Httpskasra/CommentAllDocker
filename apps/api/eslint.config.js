import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Ignore build artifacts
  { ignores: ['dist/**', 'node_modules/**'] },

  // Base JS rules
  js.configs.recommended,

  // TypeScript rules (no type-checking required)
  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: tseslint.parser,
    },
    rules: {
      // Tweak rules as you like:
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
);
