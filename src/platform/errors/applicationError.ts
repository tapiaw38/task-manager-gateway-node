import type { ErrorDetails } from './mappings/errorDetails';

export type { ErrorDetails };

export class ApplicationError extends Error {
    readonly code: string;
    readonly status: number;

    constructor(
        details: ErrorDetails,
        readonly cause?: unknown,
    ) {
        super(details.message);
        this.name = 'ApplicationError';
        this.code = details.code;
        this.status = details.status;
    }

    toJSON() {
        return { code: this.code, message: this.message };
    }
}
