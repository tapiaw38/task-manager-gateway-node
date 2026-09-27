import express from 'express';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { describe, it, vi } from 'vitest';

import { ApplicationError } from '../errors/applicationError';
import { errors } from '../errors/mappings';
import { errorHandler, notFoundHandler } from './errorHandler';

const createErrorApplication = (error: Error) => {
    const app = express();
    app.get('/error', (_request, _response, next) => next(error));
    app.use(errorHandler);
    return app;
};

describe('errorHandler', () => {
    it('returns the original application error status and body', async () => {
        const error = new ApplicationError(errors.taskServiceUnavailable);
        const errorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);

        await request(createErrorApplication(error))
            .get('/error')
            .expect(StatusCodes.SERVICE_UNAVAILABLE)
            .expect(error.toJSON());

        errorSpy.mockRestore();
    });

    it('maps body syntax errors to invalid request body', async () => {
        const error = Object.assign(new SyntaxError('invalid JSON'), {
            body: '{}',
        });
        const errorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);

        await request(createErrorApplication(error))
            .get('/error')
            .expect(StatusCodes.BAD_REQUEST)
            .expect({
                code: errors.invalidRequestBody.code,
                message: errors.invalidRequestBody.message,
            });

        errorSpy.mockRestore();
    });

    it('maps unexpected errors to internal server error', async () => {
        const errorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);

        await request(createErrorApplication(new Error('unexpected')))
            .get('/error')
            .expect(StatusCodes.INTERNAL_SERVER_ERROR)
            .expect({
                code: errors.internalServerError.code,
                message: errors.internalServerError.message,
            });

        errorSpy.mockRestore();
    });
});

describe('notFoundHandler', () => {
    it('returns not-found application error', async () => {
        const errorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);
        const app = express();
        app.use(notFoundHandler);

        await request(app)
            .get('/missing')
            .expect(StatusCodes.NOT_FOUND)
            .expect({
                code: errors.notFound.code,
                message: errors.notFound.message,
            });

        errorSpy.mockRestore();
    });
});
