import { StatusCodes } from 'http-status-codes';

import type { ErrorDetails } from './errorDetails';

export const taskErrors = {
    taskServiceUnavailable: {
        code: 'gateway:task-service-unavailable',
        status: StatusCodes.SERVICE_UNAVAILABLE,
        message: 'the task service is unavailable',
    },
    taskServiceTimeout: {
        code: 'gateway:task-service-timeout',
        status: StatusCodes.GATEWAY_TIMEOUT,
        message: 'the task service did not respond in time',
    },
    taskServiceInvalidResponse: {
        code: 'gateway:task-service-invalid-response',
        status: StatusCodes.BAD_GATEWAY,
        message: 'the task service returned an unexpected response',
    },
} as const satisfies Record<string, ErrorDetails>;
