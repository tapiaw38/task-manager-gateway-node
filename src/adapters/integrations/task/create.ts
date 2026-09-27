import {
    requestTaskService,
    type IntegrationDependencies,
    type TaskResponse,
} from './integration';
import type { TaskPayload } from '../../../domain/task';

export const createTask =
    (dependencies: IntegrationDependencies) =>
    (payload: TaskPayload): Promise<TaskResponse> =>
        requestTaskService<TaskResponse>(dependencies, '/api/tasks', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
