import { Router } from 'express';
import { getEquip, removeEquip, setEquip } from './handlers';

const equipsRouter: Router = Router();

equipsRouter.get('/info', getEquip);

equipsRouter.post('/new', setEquip);

equipsRouter.put('/', removeEquip);

export default equipsRouter;