import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['./vitest.unit.config.ts', './vitest.e2e.config.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/shared/domains/**/use-cases/*.{ts,tsx}'],
    },
  },
})
