import { Router } from 'express';
import { claimAchievement } from './handlers';

const achievementsRouter: Router = Router();

achievementsRouter.post('/claim', claimAchievement);

export default achievementsRouter;