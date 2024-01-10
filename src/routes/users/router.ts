import { Router } from 'express';
import { getUser, registerUser } from './handlers';

const usersRouter: Router = Router();

usersRouter.get('/info', getUser);

usersRouter.post('/register', registerUser);

export default usersRouter;