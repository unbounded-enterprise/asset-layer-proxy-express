import { Router } from 'express';
import { activateCollection, createCollection, deactivateCollection, getCollection, getCollectionAssets, getCollections, updateCollection, updateCollectionImage } from './handlers';

const collectionsRouter: Router = Router();

collectionsRouter.get('/info', getCollection);
collectionsRouter.get('/infos', getCollections);
collectionsRouter.get('/assets', getCollectionAssets);

collectionsRouter.post('/new', createCollection);
collectionsRouter.post('/image', updateCollectionImage);

collectionsRouter.put('/update', updateCollection);
collectionsRouter.put('/activate', activateCollection);
collectionsRouter.put('/deactivate', deactivateCollection);

export default collectionsRouter;