import { Router } from 'express';
import { claim, claimHelix } from './handlers';

const dailiesRouter: Router = Router();

dailiesRouter.post('/claim', claim);

dailiesRouter.post('/claim-helix', claimHelix);

export default dailiesRouter;