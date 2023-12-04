import { Router } from 'express';
import bodyParser from 'body-parser';
import { createPaymentIntent, paymentIntentWebhook } from './handlers';

const stripeRouter: Router = Router();

stripeRouter.post('/createPaymentIntent', bodyParser.raw({ type: 'application/json' }), createPaymentIntent);
stripeRouter.post('/paymentIntentWebhook', bodyParser.raw({ type: 'application/json' }), paymentIntentWebhook);

export default stripeRouter;