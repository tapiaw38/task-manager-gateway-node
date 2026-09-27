import { commonErrors } from './common';
import { taskErrors } from './task';

export type { ErrorDetails } from './errorDetails';

export const errors = {
    ...commonErrors,
    ...taskErrors,
} as const;
