import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['node_modules', '.expo', 'dist', 'web-build']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      // React Native / Hermes runtime
      globals: { ...globals.browser, ...globals.node, __DEV__: 'readonly' },
    },
  },
  {
    files: ['*.config.js'],
    languageOptions: { globals: globals.node, sourceType: 'commonjs' },
  },
]);
