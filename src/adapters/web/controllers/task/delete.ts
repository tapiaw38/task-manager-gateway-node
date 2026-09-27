import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { pathParameter } from '../../../../platform/web/request';
import type { DeleteUseCase } from '../../../../usecases/task/delete';

export const createDeleteController =
    (useCase: DeleteUseCase) =>
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            await useCase.execute(pathParameter(request, 'id'));
            response.status(StatusCodes.NO_CONTENT).end();
        } catch (error) {
            next(error);
        }
    };
