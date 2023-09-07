import { Router } from 'express';
import { getEquips, removeEquip, setEquip } from './handlers';

const equipsRouter: Router = Router();

equipsRouter.get('/info', getEquips);

equipsRouter.post('/new', setEquip);

equipsRouter.delete('/', removeEquip);

export default equipsRouter;