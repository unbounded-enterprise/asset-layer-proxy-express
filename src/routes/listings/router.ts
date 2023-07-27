import { Router } from 'express';
import { buyListing, getListing, removeListing } from './handlers';

const listingsRouter: Router = Router();

listingsRouter.get('/info', getListing);
// listingsRouter.get('/user', getUserListings);
// listingsRouter.get('/collection', getCollectionListings);
// listingsRouter.get('/app', getAppListings);

// listingsRouter.post('/new', createListing);
listingsRouter.post('/buy', buyListing);

// listingsRouter.put('/update', updateListing);

listingsRouter.delete('/', removeListing);

export default listingsRouter;