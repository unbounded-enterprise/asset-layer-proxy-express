import { Router } from 'express';
import { checkPaymentCompleted, createHandcashPayment, handcashPaymentWebhook } from './handlers';

const handcashRouter: Router = Router();

handcashRouter.post('/createPayment', createHandcashPayment);
handcashRouter.post('/paymentWebhook', handcashPaymentWebhook);
handcashRouter.post('/checkPayment', checkPaymentCompleted);

export default handcashRouter;