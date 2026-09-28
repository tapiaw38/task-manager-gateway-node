import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

export const createHealthController =
    (): RequestHandler => (_request, response) => {
        response.status(StatusCodes.OK).json({ status: 'ok' });
    };
