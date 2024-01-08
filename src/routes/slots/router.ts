import { Router } from 'express';
import { collections, getSlot } from './handlers';
import { getExpressionTypes, getSlotExpressions } from '../expressions/handlers';

const slotsRouter: Router = Router();

slotsRouter.get('/info', getSlot);
slotsRouter.get('/collections', collections);

// slotsRouter.post('/new', createSlot);
// slotsRouter.post('/add', addSlot);
// slotsRouter.post('/remove', removeSlot);

// slotsRouter.put('/update', updateSlot);

slotsRouter.get('/expressions/types', getExpressionTypes);
slotsRouter.get('/expressions', getSlotExpressions);
// slotsRouter.post('/expressions/new', createExpression);
// slotsRouter.put('/expressions/update', updateExpression);

export default slotsRouter;