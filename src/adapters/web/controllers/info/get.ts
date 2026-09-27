import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import type { Configuration } from '../../../../platform/config/config';

export const createInfoController =
    (config: Configuration): RequestHandler =>
    (_request, response) => {
        response.status(StatusCodes.OK).json({
            application: config.appName,
            version: config.appVersion,
        });
    };
