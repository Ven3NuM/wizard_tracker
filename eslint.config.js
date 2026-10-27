import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

// One config for app/ and course/
export default defineConfig([
  globalIgnores(['**/dist', '**/dev-dist', '**/test-results', '**/playwright-report']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [js.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Tooling and Playwright run in Node
    files: ['**/*.config.js', '**/e2e/**', 'course/lesson.js'],
    languageOptions: { globals: globals.node },
  },
])
