import type { Task } from '../../domain/task';
import type { TaskServiceData } from '../../adapters/integrations/task/integration';

export const toTask = (task: TaskServiceData): Task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    completed: task.completed,
    createdAt: task.created_at,
    updatedAt: task.updated_at,
});
