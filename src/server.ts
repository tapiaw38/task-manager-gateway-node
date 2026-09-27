import http from 'node:http';
import cors from 'cors';
import express, { type Application } from 'express';

import { createIntegrationsFactory } from './adapters/integrations/integrations';
import { logging } from './adapters/web/middlewares/logging';
import { registerRoutes } from './adapters/web/routes/routes';
import { createAppContextFactory } from './platform/appcontext/appcontext';
import { readConfig } from './config';
import type { Configuration } from './platform/config/config';
import { errorHandler, notFoundHandler } from './platform/web/errorHandler';
import { createUseCases } from './usecases/usecases';

export const createApplication = (
    configuration = readConfig(),
): Application => {
    const contextFactory = createAppContextFactory(
        createIntegrationsFactory(configuration),
    );
    const useCases = createUseCases(contextFactory);
    const app = express();

    app.use(logging());
    app.use(cors({ origin: configuration.server.allowedOrigins }));
    app.use(express.json());
    registerRoutes(app, useCases, configuration);
    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
};

export const startServer = (
    configuration: Configuration = readConfig(),
): http.Server => {
    const app = createApplication(configuration);
    const server = app.listen(configuration.server.port, () => {
        console.info(
            JSON.stringify({
                level: 'info',
                message: 'gateway listening',
                application: configuration.appName,
                version: configuration.appVersion,
                port: configuration.server.port,
                taskService: configuration.taskService.baseUrl,
            }),
        );
    });

    const shutdown = () => server.close();
    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);

    return server;
};

if (require.main === module) {
    startServer();
}
