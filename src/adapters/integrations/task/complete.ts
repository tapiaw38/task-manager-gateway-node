import {
    requestTaskService,
    type IntegrationDependencies,
    type TaskResponse,
} from './integration';
import type { CompletePayload } from '../../../domain/task';

export const completeTask =
    (dependencies: IntegrationDependencies) =>
    (id: string, payload: CompletePayload): Promise<TaskResponse> =>
        requestTaskService<TaskResponse>(
            dependencies,
            `/api/tasks/${encodeURIComponent(id)}/complete`,
            {
                method: 'PATCH',
                body: JSON.stringify(payload),
            },
        );
