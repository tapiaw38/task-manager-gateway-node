import { Router } from 'express';

import { createCompleteController } from '../controllers/task/complete';
import { createCreateController } from '../controllers/task/create';
import { createDeleteController } from '../controllers/task/delete';
import { createListController } from '../controllers/task/list';
import type { TaskUseCases } from '../../../usecases/usecases';

export const createTaskRoutes = (useCases: TaskUseCases): Router => {
    const router = Router();

    router.get('/', createListController(useCases.list));
    router.post('/', createCreateController(useCases.create));
    router.patch('/:id/complete', createCompleteController(useCases.complete));
    router.delete('/:id', createDeleteController(useCases.delete));

    return router;
};
