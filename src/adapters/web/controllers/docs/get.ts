import { readFile } from 'node:fs/promises';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import swaggerUi from 'swagger-ui-express';

import { ApplicationError } from '../../../../platform/errors/applicationError';
import { errors } from '../../../../platform/errors/mappings';
import type { Configuration } from '../../../../platform/config/config';

export const docsUiAssets: RequestHandler[] = swaggerUi.serve;

export const createDocsUiController = (): RequestHandler =>
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: '/api/docs/openapi.yaml',
            docExpansion: 'list',
            defaultModelsExpandDepth: 1,
        },
    });

export const createDocsSpecController =
    (config: Configuration) =>
    async (_request: Request, response: Response, next: NextFunction) => {
        try {
            const spec = await readFile(config.docs.specPath, 'utf8');
            response.status(StatusCodes.OK).type('application/yaml').send(spec);
        } catch (error) {
            next(new ApplicationError(errors.internalServerError, error));
        }
    };
