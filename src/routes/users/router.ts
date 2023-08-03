import { Router } from 'express';
import { getUser } from './handlers';

const usersRouter: Router = Router();

usersRouter.get('/info', getUser);

export default usersRouter;