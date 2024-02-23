import { Router } from 'express';
import { shopSummary } from './handlers';

const shopRouter: Router = Router();

shopRouter.get('/summary', shopSummary);

// shopRouter.post('/newItem', newItem);
// shopRouter.post('/buy', buyItem);

// shopRouter.put('/removeItem', removeItem);

export default shopRouter;