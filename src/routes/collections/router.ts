import { Router } from 'express';
import { activateCollection, assets, createCollection, deactivateCollection, info, updateCollection, updateCollectionImage } from './handlers';

const collectionsRouter: Router = Router();

collectionsRouter.get('/info', info);
collectionsRouter.get('/assets', assets);

collectionsRouter.post('/new', createCollection);
collectionsRouter.post('/image', updateCollectionImage);

collectionsRouter.put('/update', updateCollection);
collectionsRouter.put('/activate', activateCollection);
collectionsRouter.put('/deactivate', deactivateCollection);

export default collectionsRouter;