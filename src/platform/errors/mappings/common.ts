import { StatusCodes } from 'http-status-codes';

import type { ErrorDetails } from './errorDetails';

export const commonErrors = {
    invalidRequestBody: {
        code: 'common:request-body-parsing-error',
        status: StatusCodes.BAD_REQUEST,
        message: 'invalid request body format',
    },
    invalidParams: {
        code: 'common:invalid-params',
        status: StatusCodes.BAD_REQUEST,
        message: 'invalid request parameters',
    },
    notFound: {
        code: 'common:not-found',
        status: StatusCodes.NOT_FOUND,
        message: 'resource not found',
    },
    internalServerError: {
        code: 'common:internal-server-error',
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'an internal server error occurred',
    },
} as const satisfies Record<string, ErrorDetails>;
