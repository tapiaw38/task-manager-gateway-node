import type { AppContextFactory } from '../../platform/appcontext/appcontext';

export interface DeleteUseCase {
    execute(id: string): Promise<void>;
}

export const createDeleteUseCase = (
    contextFactory: AppContextFactory,
): DeleteUseCase => ({
    async execute(id) {
        const app = contextFactory();
        await app.integrations.task.remove(id);
    },
});
