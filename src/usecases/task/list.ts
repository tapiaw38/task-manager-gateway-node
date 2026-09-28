import type { TaskListOutput } from './output-types';
import { toTaskOutputData } from './output-types';
import { toTask } from './task-mapper';
import type { AppContextFactory } from '../../platform/appcontext/appcontext';

export interface ListUseCase {
    execute(): Promise<TaskListOutput>;
}

export const createListUseCase = (
    contextFactory: AppContextFactory,
): ListUseCase => ({
    async execute() {
        const app = contextFactory();
        const response = await app.integrations.task.list();

        return {
            data: response.data.map(toTask).map(toTaskOutputData),
            total: response.total,
        };
    },
});
