import { Router } from 'express';
import { start, startHelix, end, endHelix } from './handlers';

const levelsRouter: Router = Router();

levelsRouter.post('/start', start);
levelsRouter.post('/end', end);

levelsRouter.post('/start-helix', startHelix);
levelsRouter.post('/end-helix', endHelix);

export default levelsRouter;