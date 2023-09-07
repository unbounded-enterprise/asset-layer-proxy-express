import { Router } from 'express';
import { app, buyListing, collection, info, newListing, removeListing, updateListing, user } from './handlers';

const listingsRouter: Router = Router();

listingsRouter.get('/info', info);
listingsRouter.get('/user', user);
listingsRouter.get('/collection', collection);
listingsRouter.get('/app', app);

listingsRouter.post('/new', newListing);
listingsRouter.post('/buy', buyListing);

listingsRouter.put('/update', updateListing);

listingsRouter.delete('/', removeListing);

export default listingsRouter;