import { Router } from 'express';
import { getRolltopiaUser, getUser } from './handlers';

const usersRouter: Router = Router();

usersRouter.get('/info', getUser);
usersRouter.get('/user', getRolltopiaUser);

export default usersRouter;