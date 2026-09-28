import { completeTask } from './complete';
import { createTask } from './create';
import { deleteTask } from './delete';
import { listTasks } from './list';
import { getIdentityToken, type IdentityTokenProvider } from './identityToken';
import { ApplicationError } from '../../../platform/errors/applicationError';
import { errors } from '../../../platform/errors/mappings';
import type { Configuration } from '../../../platform/config/config';
import type { CompletePayload, Task, TaskPayload } from '../../../domain/task';

export interface TaskListResponse {
    data: Task[];
    total: number;
}

export interface TaskResponse {
    data: Task;
}

export interface ITaskIntegration {
    list(): Promise<TaskListResponse>;
    create(payload: TaskPayload): Promise<TaskResponse>;
    complete(id: string, payload: CompletePayload): Promise<TaskResponse>;
    remove(id: string): Promise<void>;
}

export interface IntegrationDependencies {
    baseUrl: string;
    timeoutMs: number;
    identityTokenProvider?: IdentityTokenProvider;
}

interface ServiceErrorBody {
    code?: string;
    message?: string;
}

export const requestTaskService = async <T>(
    { baseUrl, timeoutMs, identityTokenProvider }: IntegrationDependencies,
    path: string,
    init?: RequestInit,
): Promise<T> => {
    let response: Response;

    try {
        const identityToken = identityTokenProvider
            ? await identityTokenProvider(baseUrl)
            : undefined;
        response = await fetch(`${baseUrl}${path}`, {
            ...init,
            headers: {
                'Content-Type': 'application/json',
                ...(identityToken
                    ? { Authorization: `Bearer ${identityToken}` }
                    : {}),
                ...init?.headers,
            },
            signal: AbortSignal.timeout(timeoutMs),
        });
    } catch (error) {
        throw new ApplicationError(
            (error as Error)?.name === 'TimeoutError'
                ? errors.taskServiceTimeout
                : errors.taskServiceUnavailable,
            error,
        );
    }

    if (!response.ok) {
        throw await toServiceError(response);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    try {
        return (await response.json()) as T;
    } catch (error) {
        throw new ApplicationError(errors.taskServiceInvalidResponse, error);
    }
};

const toServiceError = async (
    response: Response,
): Promise<ApplicationError> => {
    let body: ServiceErrorBody;

    try {
        body = (await response.json()) as ServiceErrorBody;
    } catch (error) {
        return new ApplicationError(errors.taskServiceInvalidResponse, error);
    }

    if (!body.code || !body.message) {
        return new ApplicationError(errors.taskServiceInvalidResponse, body);
    }

    return new ApplicationError({
        code: body.code,
        status: response.status,
        message: body.message,
    });
};

export const createTaskIntegration = (
    config: Configuration,
): ITaskIntegration => {
    const dependencies: IntegrationDependencies = {
        baseUrl: config.taskService.baseUrl,
        timeoutMs: config.taskService.timeoutMs,
        identityTokenProvider: config.taskService.authenticationEnabled
            ? getIdentityToken
            : undefined,
    };

    return {
        list: listTasks(dependencies),
        create: createTask(dependencies),
        complete: completeTask(dependencies),
        remove: deleteTask(dependencies),
    };
};
