import {
    requestTaskService,
    type IntegrationDependencies,
} from './integration';

export const deleteTask =
    (dependencies: IntegrationDependencies) =>
    (id: string): Promise<void> =>
        requestTaskService<void>(
            dependencies,
            `/api/tasks/${encodeURIComponent(id)}`,
            { method: 'DELETE' },
        );
