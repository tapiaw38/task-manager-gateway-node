import { toTaskOutputData, type TaskOutput } from './output-types';
import type { TaskPayload } from '../../domain/task';
import type { AppContextFactory } from '../../platform/appcontext/appcontext';

export interface CreateUseCase {
    execute(payload: TaskPayload): Promise<TaskOutput>;
}

export const createCreateUseCase = (
    contextFactory: AppContextFactory,
): CreateUseCase => ({
    async execute(payload) {
        const app = contextFactory();
        const response = await app.integrations.task.create(payload);

        return { data: toTaskOutputData(response.data) };
    },
});
