import { Router } from 'express';
import { breedRollies, claimInitialRollie } from './handlers';

const rolliesRouter: Router = Router();

rolliesRouter.post('/claimInitial', claimInitialRollie);
rolliesRouter.post('/breed', breedRollies);

export default rolliesRouter;