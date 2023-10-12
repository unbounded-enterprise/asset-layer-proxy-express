import { Router } from 'express';
import { buyItem, shopSummary } from './handlers';

const shopRouter: Router = Router();

// shopRouter.post('/newItem', newItem);
shopRouter.post('/buy', buyItem);
shopRouter.get('/summary', shopSummary);
// shopRouter.put('/removeItem', removeItem);

export default shopRouter;