import { Router } from 'express';
import { claim } from './handlers';

const dailiesRouter: Router = Router();

dailiesRouter.post('/claim', claim);

export default dailiesRouter;