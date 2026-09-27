import { createCompleteUseCase, type CompleteUseCase } from './task/complete';
import { createCreateUseCase, type CreateUseCase } from './task/create';
import { createDeleteUseCase, type DeleteUseCase } from './task/delete';
import { createListUseCase, type ListUseCase } from './task/list';
import type { AppContextFactory } from '../platform/appcontext/appcontext';

export interface TaskUseCases {
    list: ListUseCase;
    create: CreateUseCase;
    complete: CompleteUseCase;
    delete: DeleteUseCase;
}

export interface UseCases {
    task: TaskUseCases;
}

export const createUseCases = (
    contextFactory: AppContextFactory,
): UseCases => ({
    task: {
        list: createListUseCase(contextFactory),
        create: createCreateUseCase(contextFactory),
        complete: createCompleteUseCase(contextFactory),
        delete: createDeleteUseCase(contextFactory),
    },
});
