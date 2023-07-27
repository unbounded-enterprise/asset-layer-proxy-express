import { Router } from 'express';

const slotsRouter: Router = Router();

slotsRouter.get('/info', getSlot);
slotsRouter.get('/collections', getSlotCollections);

// slotsRouter.post('/new', createSlot);
// slotsRouter.post('/add', addSlot);
// slotsRouter.post('/remove', removeSlot);

// slotsRouter.put('/update', updateSlot);

export default slotsRouter;