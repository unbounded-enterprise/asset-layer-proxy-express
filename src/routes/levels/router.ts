import { Router } from 'express';
import { start, end } from './handlers';

const levelsRouter: Router = Router();

levelsRouter.post('/start', start);
levelsRouter.post('/end', end);

export default levelsRouter;