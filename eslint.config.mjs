import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier';

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  pluginReact.configs.flat.recommended,
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { settings: { react: { version: 'detect' } } },
  {
    plugins: {
      ['prettier']: eslintPluginPrettierRecommended
    }
  },
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      'no-console': 1,
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': 2
    }
  }
];
