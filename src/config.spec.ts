import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { readConfig } from './config';

const environmentKeys = [
    'APP_NAME',
    'APP_VERSION',
    'PORT',
    'ALLOWED_ORIGINS',
    'TASK_SERVICE_URL',
    'TASK_SERVICE_TIMEOUT_MS',
    'TASK_SERVICE_AUTHENTICATION_ENABLED',
    'OPENAPI_SPEC_PATH',
] as const;
const originalEnvironment = new Map(
    environmentKeys.map((key) => [key, process.env[key]]),
);
const directories: string[] = [];

afterEach(async () => {
    for (const key of environmentKeys) {
        const value = originalEnvironment.get(key);
        if (value === undefined) {
            delete process.env[key];
        } else {
            process.env[key] = value;
        }
    }

    await Promise.all(
        directories
            .splice(0)
            .map((directory) =>
                rm(directory, { recursive: true, force: true }),
            ),
    );
});

describe('readConfig', () => {
    it('returns defaults and an absolute default OpenAPI specification path', () => {
        for (const key of environmentKeys) {
            delete process.env[key];
        }

        const config = readConfig();

        expect(config).toMatchObject({
            appName: 'Task Manager Gateway',
            appVersion: '1.0.0',
            server: { port: 8081, allowedOrigins: ['http://localhost:5173'] },
            taskService: {
                baseUrl: 'http://localhost:8080',
                timeoutMs: 5000,
                authenticationEnabled: false,
            },
        });
        expect(path.isAbsolute(config.docs.specPath)).toBe(true);
        expect(config.docs.specPath).toMatch(
            /docs[/\\]specs[/\\]openapi\.yaml$/,
        );
    });

    it('uses environment overrides and trims allowed origins', () => {
        process.env.APP_NAME = 'Gateway';
        process.env.APP_VERSION = '2.0.0';
        process.env.PORT = '9090';
        process.env.ALLOWED_ORIGINS =
            ' https://one.example, https://two.example ';
        process.env.TASK_SERVICE_URL = 'https://tasks.example';
        process.env.TASK_SERVICE_TIMEOUT_MS = '1200';
        process.env.TASK_SERVICE_AUTHENTICATION_ENABLED = 'true';
        process.env.OPENAPI_SPEC_PATH = '/tmp/openapi.yaml';

        expect(readConfig()).toMatchObject({
            appName: 'Gateway',
            appVersion: '2.0.0',
            server: {
                port: 9090,
                allowedOrigins: ['https://one.example', 'https://two.example'],
            },
            taskService: {
                baseUrl: 'https://tasks.example',
                timeoutMs: 1200,
                authenticationEnabled: true,
            },
            docs: { specPath: '/tmp/openapi.yaml' },
        });
    });

    it('keeps default documentation path when current directory changes', async () => {
        const directory = await mkdtemp(
            path.join(os.tmpdir(), 'configuration-'),
        );
        directories.push(directory);
        const currentDirectory = process.cwd();
        delete process.env.OPENAPI_SPEC_PATH;

        process.chdir(directory);
        const config = readConfig();
        process.chdir(currentDirectory);

        expect(config.docs.specPath).not.toContain(directory);
        expect(path.isAbsolute(config.docs.specPath)).toBe(true);
    });
});
