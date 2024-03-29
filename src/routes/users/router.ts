import { Router } from 'express';
import { getUser, getUserCollections, registerUser } from './handlers';

const usersRouter: Router = Router();

usersRouter.get('/info', getUser);
usersRouter.get('/collections', getUserCollections);

usersRouter.post('/register', registerUser);

export default usersRouter;