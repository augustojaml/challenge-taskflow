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
    }),
  ],

  test: {
    name: 'unit',
    environment: 'node',
    globals: true,
    include: ['src/tests/unit/**/*.spec.ts'],
  },
})
