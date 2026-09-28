import { describe, expect, it, vi } from 'vitest';

import { createCompleteUseCase } from './complete';
import { createCreateUseCase } from './create';
import { createDeleteUseCase } from './delete';
import { createListUseCase } from './list';
import { buildTaskServiceData, taskPayload } from '../../test/fixtures/task';
import type { ITaskIntegration } from '../../adapters/integrations/task/integration';

const newIntegration = (
    overrides: Partial<ITaskIntegration> = {},
): ITaskIntegration => ({
    list: vi
        .fn()
        .mockResolvedValue({ data: [buildTaskServiceData()], total: 1 }),
    create: vi.fn().mockResolvedValue({ data: buildTaskServiceData() }),
    complete: vi
        .fn()
        .mockResolvedValue({ data: buildTaskServiceData({ completed: true }) }),
    remove: vi.fn().mockResolvedValue(undefined),
    ...overrides,
});

const contextFactory = (integration: ITaskIntegration) => () => ({
    integrations: { task: integration },
});

const outputKeys = [
    'completed',
    'created_at',
    'description',
    'id',
    'title',
    'updated_at',
];

describe('createListUseCase', () => {
    it('maps every task to the output contract', async () => {
        const integration = newIntegration({
            list: vi.fn().mockResolvedValue({
                data: [{ ...buildTaskServiceData(), internal: 'hidden' }],
                total: 1,
            }),
        });

        const output = await createListUseCase(
            contextFactory(integration),
        ).execute();

        expect(integration.list).toHaveBeenCalled();
        expect(output.total).toBe(1);
        expect(Object.keys(output.data[0]).sort()).toEqual(outputKeys);
    });
});

describe('createCreateUseCase', () => {
    it('forwards the payload and maps the output', async () => {
        const integration = newIntegration();

        const output = await createCreateUseCase(
            contextFactory(integration),
        ).execute(taskPayload());

        expect(integration.create).toHaveBeenCalledWith(taskPayload());
        expect(Object.keys(output.data).sort()).toEqual(outputKeys);
    });
});

describe('createCompleteUseCase', () => {
    it('forwards the identifier and the completed flag', async () => {
        const integration = newIntegration();

        const output = await createCompleteUseCase(
            contextFactory(integration),
        ).execute('task-1', { completed: true });

        expect(integration.complete).toHaveBeenCalledWith('task-1', {
            completed: true,
        });
        expect(output.data.completed).toBe(true);
    });
});

describe('createDeleteUseCase', () => {
    it('forwards the identifier to the integration', async () => {
        const integration = newIntegration();

        await createDeleteUseCase(contextFactory(integration)).execute(
            'task-1',
        );

        expect(integration.remove).toHaveBeenCalledWith('task-1');
    });
});
