/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [
        {
            name: 'mock-markdown',
            transform(code, id) {
                if (id.endsWith('.md') || id.endsWith('.mdx')) {
                    return {
                        code: 'export default {}',
                        map: null
                    }
                }
            }
        }
    ],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
    },
})
