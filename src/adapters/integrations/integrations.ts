import {
    createTaskIntegration,
    type ITaskIntegration,
} from './task/integration';
import type { Configuration } from '../../platform/config/config';

export interface Integrations {
    task: ITaskIntegration;
}

export type IntegrationsFactory = () => Integrations;

export const createIntegrationsFactory =
    (config: Configuration): IntegrationsFactory =>
    () => ({
        task: createTaskIntegration(config),
    });
