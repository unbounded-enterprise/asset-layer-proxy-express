import { Router } from 'express';
import bodyParser from 'body-parser';
import { paymentIntentWebhook } from '../stripe/handlers';

const webhooksRouter: Router = Router();

webhooksRouter.post('/stripe/paymentIntent', bodyParser.raw({ type: 'application/json' }), paymentIntentWebhook);

export default webhooksRouter;