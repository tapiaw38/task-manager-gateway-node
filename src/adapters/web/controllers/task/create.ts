import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { parseTaskPayload } from '../../../../platform/web/request';
import type { CreateUseCase } from '../../../../usecases/task/create';

export const createCreateController =
    (useCase: CreateUseCase) =>
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            const output = await useCase.execute(
                parseTaskPayload(request.body),
            );
            response.status(StatusCodes.CREATED).json(output);
        } catch (error) {
            next(error);
        }
    };
