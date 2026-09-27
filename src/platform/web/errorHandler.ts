import type { ErrorRequestHandler, RequestHandler } from 'express';

import { ApplicationError } from '../errors/applicationError';
import { logApplicationError } from '../errors/logging';
import { errors } from '../errors/mappings';

export const notFoundHandler: RequestHandler = (_request, response) => {
    const error = new ApplicationError(errors.notFound);
    logApplicationError(error);
    response.status(error.status).json(error.toJSON());
};

export const errorHandler: ErrorRequestHandler = (
    error,
    _request,
    response,
    _next,
) => {
    const applicationError = toApplicationError(error);
    logApplicationError(applicationError);
    response.status(applicationError.status).json(applicationError.toJSON());
};

const toApplicationError = (error: unknown): ApplicationError => {
    if (error instanceof ApplicationError) {
        return error;
    }

    if (error instanceof SyntaxError && 'body' in error) {
        return new ApplicationError(errors.invalidRequestBody, error);
    }

    return new ApplicationError(errors.internalServerError, error);
};
