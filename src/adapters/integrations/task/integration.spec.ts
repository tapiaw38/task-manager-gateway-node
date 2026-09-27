import { afterEach, describe, expect, it, vi } from 'vitest';

import { createTaskIntegration } from './integration';
import { buildTask, taskPayload } from '../../../test/fixtures/task';
import { emptyResponse, jsonResponse } from '../../../test/mocks/fetch';
import { ApplicationError } from '../../../platform/errors/applicationError';
import { errors } from '../../../platform/errors/mappings';
import type { Configuration } from '../../../platform/config/config';

const configuration = {
    taskService: { baseUrl: 'http://task-service', timeoutMs: 50 },
} as Configuration;

const integration = () => createTaskIntegration(configuration);

const errorResponse = (code: string, message: string, status: number) =>
    jsonResponse({ code, message }, status);

describe('task integration', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('lists tasks from the task service', async () => {
        const task = buildTask();
        const fetchMock = vi
            .fn()
            .mockResolvedValue(jsonResponse({ data: [task], total: 1 }));
        vi.stubGlobal('fetch', fetchMock);

        await expect(integration().list()).resolves.toEqual({
            data: [task],
            total: 1,
        });

        expect(String(fetchMock.mock.calls[0][0])).toBe(
            'http://task-service/api/tasks',
        );
    });

    it('creates a task with a POST body', async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValue(jsonResponse({ data: buildTask() }, 201));
        vi.stubGlobal('fetch', fetchMock);

        await integration().create(taskPayload());

        expect(fetchMock).toHaveBeenCalledWith(
            'http://task-service/api/tasks',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify(taskPayload()),
            }),
        );
    });

    it('completes a task with a PATCH body', async () => {
        const fetchMock = vi
            .fn()
            .mockResolvedValue(jsonResponse({ data: buildTask() }));
        vi.stubGlobal('fetch', fetchMock);

        await integration().complete('task 1', { completed: true });

        expect(String(fetchMock.mock.calls[0][0])).toBe(
            'http://task-service/api/tasks/task%201/complete',
        );
        expect(fetchMock.mock.calls[0][1]).toMatchObject({
            method: 'PATCH',
            body: JSON.stringify({ completed: true }),
        });
    });

    it('deletes a task and resolves without content', async () => {
        const fetchMock = vi.fn().mockResolvedValue(emptyResponse());
        vi.stubGlobal('fetch', fetchMock);

        await expect(integration().remove('task-1')).resolves.toBeUndefined();

        expect(fetchMock.mock.calls[0][1]).toMatchObject({
            method: 'DELETE',
        });
    });

    it('forwards the task service error code and status untouched', async () => {
        vi.stubGlobal(
            'fetch',
            vi
                .fn()
                .mockResolvedValue(
                    errorResponse(
                        'task:shared:not-found',
                        'task not found',
                        404,
                    ),
                ),
        );

        await expect(integration().remove('missing')).rejects.toMatchObject({
            code: 'task:shared:not-found',
            message: 'task not found',
            status: 404,
        });
    });

    it('maps an unreachable task service to a gateway error', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

        await expect(integration().list()).rejects.toMatchObject({
            code: errors.taskServiceUnavailable.code,
            status: errors.taskServiceUnavailable.status,
        });
    });

    it('maps a task service timeout to a gateway timeout error', async () => {
        const timeout = Object.assign(new Error('timed out'), {
            name: 'TimeoutError',
        });
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(timeout));

        await expect(integration().list()).rejects.toMatchObject({
            code: errors.taskServiceTimeout.code,
            status: errors.taskServiceTimeout.status,
        });
    });

    it('maps a malformed error body to an invalid response error', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(
                new Response('not json', {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                }),
            ),
        );

        await expect(integration().list()).rejects.toBeInstanceOf(
            ApplicationError,
        );
        await expect(integration().list()).rejects.toMatchObject({
            code: errors.taskServiceInvalidResponse.code,
        });
    });

    it('maps a malformed success body to an invalid response error', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(
                new Response('not json', {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                }),
            ),
        );

        await expect(integration().list()).rejects.toMatchObject({
            code: errors.taskServiceInvalidResponse.code,
        });
    });
});
