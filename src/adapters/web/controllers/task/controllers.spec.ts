import express, { type Application, type RequestHandler } from 'express';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { describe, expect, it, vi } from 'vitest';

import { createCompleteController } from './complete';
import { createCreateController } from './create';
import { createDeleteController } from './delete';
import { createListController } from './list';
import {
    buildTaskOutputData,
    taskPayload,
} from '../../../../test/fixtures/task';
import { ApplicationError } from '../../../../platform/errors/applicationError';
import { errors } from '../../../../platform/errors/mappings';
import { errorHandler } from '../../../../platform/web/errorHandler';

const buildApp = (
    method: 'get' | 'post' | 'patch' | 'delete',
    route: string,
    controller: RequestHandler,
): Application => {
    const app = express();
    app.use(express.json());
    app[method](route, controller);
    app.use(errorHandler);

    return app;
};

const silenceErrorLog = () =>
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

describe('task controllers', () => {
    it('returns the task list', async () => {
        const useCase = {
            execute: vi
                .fn()
                .mockResolvedValue({ data: [buildTaskOutputData()], total: 1 }),
        };

        await request(
            buildApp('get', '/api/tasks', createListController(useCase)),
        )
            .get('/api/tasks')
            .expect(StatusCodes.OK)
            .expect({ data: [buildTaskOutputData()], total: 1 });
    });

    it('creates a task and answers with created', async () => {
        const useCase = {
            execute: vi.fn().mockResolvedValue({ data: buildTaskOutputData() }),
        };

        await request(
            buildApp('post', '/api/tasks', createCreateController(useCase)),
        )
            .post('/api/tasks')
            .send(taskPayload())
            .expect(StatusCodes.CREATED);

        expect(useCase.execute).toHaveBeenCalledWith(taskPayload());
    });

    it('rejects a create request with a non-string title', async () => {
        const useCase = { execute: vi.fn() };
        const logger = silenceErrorLog();

        await request(
            buildApp('post', '/api/tasks', createCreateController(useCase)),
        )
            .post('/api/tasks')
            .send({ title: 1, description: 'Description' })
            .expect(StatusCodes.BAD_REQUEST)
            .expect({
                code: errors.invalidRequestBody.code,
                message: errors.invalidRequestBody.message,
            });

        expect(useCase.execute).not.toHaveBeenCalled();
        logger.mockRestore();
    });

    it('completes a task with the parsed flag', async () => {
        const useCase = {
            execute: vi.fn().mockResolvedValue({
                data: buildTaskOutputData({ completed: true }),
            }),
        };

        await request(
            buildApp(
                'patch',
                '/api/tasks/:id/complete',
                createCompleteController(useCase),
            ),
        )
            .patch('/api/tasks/task-1/complete')
            .send({ completed: true })
            .expect(StatusCodes.OK);

        expect(useCase.execute).toHaveBeenCalledWith('task-1', {
            completed: true,
        });
    });

    it('rejects a complete request with a non-boolean flag', async () => {
        const useCase = { execute: vi.fn() };
        const logger = silenceErrorLog();

        await request(
            buildApp(
                'patch',
                '/api/tasks/:id/complete',
                createCompleteController(useCase),
            ),
        )
            .patch('/api/tasks/task-1/complete')
            .send({ completed: 'yes' })
            .expect(StatusCodes.BAD_REQUEST);

        expect(useCase.execute).not.toHaveBeenCalled();
        logger.mockRestore();
    });

    it('deletes a task and answers without content', async () => {
        const useCase = { execute: vi.fn().mockResolvedValue(undefined) };

        await request(
            buildApp(
                'delete',
                '/api/tasks/:id',
                createDeleteController(useCase),
            ),
        )
            .delete('/api/tasks/task-1')
            .expect(StatusCodes.NO_CONTENT);

        expect(useCase.execute).toHaveBeenCalledWith('task-1');
    });

    it('forwards integration errors to the error handler', async () => {
        const useCase = {
            execute: vi
                .fn()
                .mockRejectedValue(
                    new ApplicationError(errors.taskServiceUnavailable),
                ),
        };
        const logger = silenceErrorLog();

        await request(
            buildApp('get', '/api/tasks', createListController(useCase)),
        )
            .get('/api/tasks')
            .expect(StatusCodes.SERVICE_UNAVAILABLE)
            .expect({
                code: errors.taskServiceUnavailable.code,
                message: errors.taskServiceUnavailable.message,
            });

        logger.mockRestore();
    });
});
