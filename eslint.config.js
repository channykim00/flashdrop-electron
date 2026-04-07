// eslint.config.js
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import js from '@eslint/js';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig } from 'eslint/config';
import typescriptParser from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';

// ES Module 환경에서 __dirname 정의
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig([
  // JS 기본 추천 규칙
  js.configs.recommended,

  // 무시할 파일/폴더
  {
    ignores: ['dist/**', 'public/**', 'release/**', 'node_modules/**'],
  },

  // src: React + TypeScript
{
  files: ['src/**/*.{js,jsx,ts,tsx}'],
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      ecmaVersion: 'latest',
      ecmaFeatures: { jsx: true },
      sourceType: 'module',
      project: './tsconfig.json', // 이 설정이 제대로 동작하도록 수정
      tsconfigRootDir: __dirname,
    },
    globals: globals.browser,
  },
  plugins: {
    '@typescript-eslint': typescriptEslint,
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    prettier: prettierPlugin,
    import: importPlugin,
  },
  rules: {
    '@typescript-eslint/no-undef': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' },
    ],
    ...reactHooks.configs['recommended-latest'].rules,
    ...reactRefresh.configs.vite.rules,
    'prettier/prettier': 'error',
    'import/order': ['warn', { alphabetize: { order: 'asc' }, 'newlines-between': 'always' }],
  },
},

  // Electron 환경
  {
    files: ['electron/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
        process: 'readonly',
        __dirname: 'readonly',
      },
      parserOptions: {
        sourceType: 'module',
      },
    },
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
        },
      ],
    },
  },

  // Prettier Config
  prettierConfig,
]);
