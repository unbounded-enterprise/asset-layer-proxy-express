import { Router } from 'express';
import { updateUserRollidex } from './handlers';

const rollidexRouter: Router = Router();

rollidexRouter.post('/update', updateUserRollidex);

export default rollidexRouter;