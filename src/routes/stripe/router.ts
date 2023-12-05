import { Router } from 'express';
import { createPaymentIntent } from './handlers';

const stripeRouter: Router = Router();

stripeRouter.post('/createPaymentIntent', createPaymentIntent);

export default stripeRouter;