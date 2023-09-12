import { Router } from 'express';
import { getRolltopiaUser, getUser } from './handlers';

const usersRouter: Router = Router();

usersRouter.get('/info', getUser);

usersRouter.post('/', getRolltopiaUser);

export default usersRouter;