import {
    requestTaskService,
    type IntegrationDependencies,
    type TaskListResponse,
} from './integration';

export const listTasks =
    (dependencies: IntegrationDependencies) => (): Promise<TaskListResponse> =>
        requestTaskService<TaskListResponse>(dependencies, '/api/tasks');
