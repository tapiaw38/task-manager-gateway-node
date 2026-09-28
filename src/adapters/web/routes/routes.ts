import type { Application } from 'express';

import { createTaskRoutes } from './task.routes';
import {
    createDocsSpecController,
    createDocsUiController,
    docsUiAssets,
} from '../controllers/docs/get';
import { createHealthController } from '../controllers/health/get';
import { createInfoController } from '../controllers/info/get';
import type { Configuration } from '../../../platform/config/config';
import type { UseCases } from '../../../usecases/usecases';

export const registerRoutes = (
    app: Application,
    useCases: UseCases,
    config: Configuration,
): void => {
    app.get('/health', createHealthController());
    app.get('/api/info', createInfoController(config));
    app.get('/api/docs/openapi.yaml', createDocsSpecController(config));
    app.use('/api/docs', docsUiAssets, createDocsUiController());
    app.use('/api/tasks', createTaskRoutes(useCases.task));
};
