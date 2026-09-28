import type { Task } from '../../domain/task';

export interface TaskOutputData {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

export interface TaskOutput {
    data: TaskOutputData;
}

export interface TaskListOutput {
    data: TaskOutputData[];
    total: number;
}

export const toTaskOutputData = (task: Task): TaskOutputData => ({
    id: task.id,
    title: task.title,
    description: task.description,
    completed: task.completed,
    created_at: task.createdAt,
    updated_at: task.updatedAt,
});
