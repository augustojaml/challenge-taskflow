import path from 'node:path'

import swc from 'unplugin-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    tsconfigPaths({
      projects: [path.resolve(__dirname, './tsconfig.json')],
    }),
    swc.vite({
      module: { type: 'es6' },
      jsc: {
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    }),
  ],

  test: {
    name: 'e2e',
    environment: 'node',
    globals: true,
    include: ['src/tests/e2e/**/*.spec.ts'],
    hookTimeout: 60000,
    testTimeout: 30000,
    setupFiles: './vitest.setup.ts',
  },
})
