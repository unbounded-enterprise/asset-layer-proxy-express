import { Router } from 'express';
import { getRolltopiaUser, getUser } from './handlers';

const usersRouter: Router = Router();

usersRouter.get('/info', getUser);

usersRouter.post('/user', getRolltopiaUser);

export default usersRouter;