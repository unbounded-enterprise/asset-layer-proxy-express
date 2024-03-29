import { Router } from 'express';
import { getExpressionTypes, getSlotExpressions } from './handlers';

const expressionsRouter: Router = Router();

expressionsRouter.get('/types', getExpressionTypes);
expressionsRouter.get('/slot', getSlotExpressions);

// expressionsRouter.post('/new', createExpression);

// expressionsRouter.put('/update', updateExpression);

// expressionsRouter.post('/values', updateExpressionValues);
// expressionsRouter.post('/values/bulk', updateBulkExpressionValues);

export default expressionsRouter;