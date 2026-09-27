import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
    parseCompletePayload,
    pathParameter,
} from '../../../../platform/web/request';
import type { CompleteUseCase } from '../../../../usecases/task/complete';

export const createCompleteController =
    (useCase: CompleteUseCase) =>
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            const output = await useCase.execute(
                pathParameter(request, 'id'),
                parseCompletePayload(request.body),
            );
            response.status(StatusCodes.OK).json(output);
        } catch (error) {
            next(error);
        }
    };
