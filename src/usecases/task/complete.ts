import { toTaskOutputData, type TaskOutput } from './output-types';
import type { CompletePayload } from '../../domain/task';
import type { AppContextFactory } from '../../platform/appcontext/appcontext';

export interface CompleteUseCase {
    execute(id: string, payload: CompletePayload): Promise<TaskOutput>;
}

export const createCompleteUseCase = (
    contextFactory: AppContextFactory,
): CompleteUseCase => ({
    async execute(id, payload) {
        const app = contextFactory();
        const response = await app.integrations.task.complete(id, payload);

        return { data: toTaskOutputData(response.data) };
    },
});
