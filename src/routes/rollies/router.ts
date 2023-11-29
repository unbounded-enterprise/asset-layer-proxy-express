import { Router } from 'express';
import { claimInitialRollie } from './handlers';

const rolliesRouter: Router = Router();

rolliesRouter.post('/claim', claimInitialRollie);

export default rolliesRouter;