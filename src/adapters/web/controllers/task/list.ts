import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import type { ListUseCase } from '../../../../usecases/task/list';

export const createListController =
    (useCase: ListUseCase) =>
    async (_request: Request, response: Response, next: NextFunction) => {
        try {
            response.status(StatusCodes.OK).json(await useCase.execute());
        } catch (error) {
            next(error);
        }
    };
