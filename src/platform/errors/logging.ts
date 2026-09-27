import type { ApplicationError } from './applicationError';

const originalMessage = (cause: unknown): string => {
    if (cause instanceof Error) {
        return cause.message;
    }

    return cause === undefined ? '' : String(cause);
};

export const logApplicationError = (error: ApplicationError): void => {
    console.error(
        JSON.stringify({
            level: 'error',
            message: 'application error',
            internal_code: error.code,
            status_code: error.status,
            detail: error.message,
            original_message: originalMessage(error.cause),
        }),
    );
};
