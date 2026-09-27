import type { Request } from 'express';

import { ApplicationError } from '../errors/applicationError';
import { errors } from '../errors/mappings';
import type { CompletePayload, TaskPayload } from '../../domain/task';

export const queryString = (value: unknown): string =>
    typeof value === 'string' ? value : '';

export const pathParameter = (request: Request, name: string): string =>
    queryString(request.params[name]);

const asRecord = (body: unknown): Record<string, unknown> => {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        throw new ApplicationError(errors.invalidRequestBody);
    }

    return body as Record<string, unknown>;
};

const readString = (value: unknown): string => {
    if (value === undefined) {
        return '';
    }

    if (typeof value !== 'string') {
        throw new ApplicationError(errors.invalidRequestBody);
    }

    return value;
};

export const parseTaskPayload = (body: unknown): TaskPayload => {
    const record = asRecord(body);

    return {
        title: readString(record.title),
        description: readString(record.description),
    };
};

export const parseCompletePayload = (body: unknown): CompletePayload => {
    const record = asRecord(body);

    if (typeof record.completed !== 'boolean') {
        throw new ApplicationError(errors.invalidRequestBody);
    }

    return { completed: record.completed };
};
