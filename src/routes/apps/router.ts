import { Router } from 'express';
import { getApp, getAppSlots } from './handlers';

const appsRouter: Router = Router();

appsRouter.get('/info', getApp);
appsRouter.get('/slots', getAppSlots);
// appRouter.get('/listings', appsHandler.getAppsWithListings);
// appRouter.get('/secret', appsHandler.getAppSecret);

// appRouter.post('/secret/reset', appsHandler.resetAppSecret);
// appRouter.post('/new', appsHandler.addApp);

// appRouter.put('/update', appsHandler.updateApp);

export default appsRouter;