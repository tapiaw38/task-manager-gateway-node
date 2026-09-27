export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TaskPayload {
    title: string;
    description: string;
}

export interface CompletePayload {
    completed: boolean;
}
