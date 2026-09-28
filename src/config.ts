import 'dotenv/config';
import path from 'node:path';

import type { Configuration } from './platform/config/config';

const packageRoot = path.resolve(__dirname, '..');

const getEnv = (name: string, fallback: string): string =>
    process.env[name]?.trim() || fallback;

const getBooleanEnv = (name: string, fallback: boolean): boolean =>
    getEnv(name, String(fallback)).toLowerCase() === 'true';

const getAllowedOrigins = (): string[] =>
    getEnv('ALLOWED_ORIGINS', 'http://localhost:5173')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

export const readConfig = (): Configuration => ({
    appName: getEnv('APP_NAME', 'Task Manager Gateway'),
    appVersion: getEnv('APP_VERSION', '1.0.0'),
    server: {
        port: Number.parseInt(getEnv('PORT', '8081'), 10),
        allowedOrigins: getAllowedOrigins(),
    },
    taskService: {
        baseUrl: getEnv('TASK_SERVICE_URL', 'http://localhost:8080'),
        timeoutMs: Number.parseInt(
            getEnv('TASK_SERVICE_TIMEOUT_MS', '5000'),
            10,
        ),
        authenticationEnabled: getBooleanEnv(
            'TASK_SERVICE_AUTHENTICATION_ENABLED',
            false,
        ),
    },
    docs: {
        specPath: path.resolve(
            getEnv(
                'OPENAPI_SPEC_PATH',
                path.join(packageRoot, 'docs/specs/openapi.yaml'),
            ),
        ),
    },
});
