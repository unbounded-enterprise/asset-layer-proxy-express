import { Router } from 'express';
import { getRolltopiaUser, getUser, newUser } from './handlers';

const usersRouter: Router = Router();

usersRouter.get('/info', getUser);
usersRouter.get('/', getRolltopiaUser);

usersRouter.post('/', getRolltopiaUser); // to be deprecated
usersRouter.post('/new', newUser);

export default usersRouter;