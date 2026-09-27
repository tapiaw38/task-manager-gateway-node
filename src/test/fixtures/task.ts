import type { Task } from '../../domain/task';

export const buildTask = (overrides: Partial<Task> = {}): Task => ({
    id: 'task-1',
    title: 'First task',
    description: 'Description of the first task',
    completed: false,
    createdAt: '2026-09-27T10:05:00Z',
    updatedAt: '2026-09-27T10:05:00Z',
    ...overrides,
});

export const taskPayload = (
    overrides: Partial<{ title: string; description: string }> = {},
) => ({
    title: 'First task',
    description: 'Description of the first task',
    ...overrides,
});
