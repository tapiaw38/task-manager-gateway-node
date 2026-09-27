import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include: ['src/**/*.ts'],
            exclude: [
                'src/server.ts',
                'src/config.ts',
                'src/domain/**',
                'src/**/*.spec.ts',
                'src/test/**',
                'src/adapters/web/controllers/docs/**',
                'src/platform/errors/mappings/**',
            ],
            thresholds: {
                statements: 80,
                branches: 80,
                functions: 80,
                lines: 80,
            },
        },
    },
});
