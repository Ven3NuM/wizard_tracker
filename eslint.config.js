import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

// One config for webapp/ and course/ (app/ is the native shell, no code of ours to lint)
export default defineConfig([
  globalIgnores(['**/dist', '**/dist-native', 'app/android', '**/dev-dist', '**/test-results', '**/playwright-report']),
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
