import { Router } from 'express';
import { getRolltopiaUser, getUser, newUser } from './handlers';

const usersRouter: Router = Router();

usersRouter.get('/info', getUser);

usersRouter.post('/', getRolltopiaUser);
usersRouter.get('/new', newUser);

export default usersRouter;