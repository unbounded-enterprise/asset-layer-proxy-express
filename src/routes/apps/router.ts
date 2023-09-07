import { Router } from 'express';
import { info, slots } from './handlers';

const appsRouter: Router = Router();

appsRouter.get('/info', info);
appsRouter.get('/slots', slots);
// appRouter.get('/listings', listings);
// appRouter.get('/secret', secret);

// appRouter.post('/secret/reset', resetSecret);
// appRouter.post('/new', newApp);

// appRouter.put('/update', update);

export default appsRouter;